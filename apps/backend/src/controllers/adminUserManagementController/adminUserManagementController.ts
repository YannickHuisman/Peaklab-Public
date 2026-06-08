import type { Request, Response } from 'express';

import { supabase, supabaseAdmin } from '../../helpers/supabaseClient';

/**
 * Get detailed user information including blood tests, panels, and biomarkers
 */
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get user auth data
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError) throw authError;

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Get user's panel link
    const { data: userPanel } = await supabase
      .from('user_panel_links')
      .select(
        `
        panel_id,
        panel:panel_id (
          id,
          name,
          code,
          description
        )
      `
      )
      .eq('user_id', userId)
      .single();

    // Get all blood tests
    const { data: bloodTests, error: testsError } = await supabase
      .from('blood_tests')
      .select(
        `
        id,
        sample_taken_at,
        status,
        created_at,
        panel:panel_id (
          id,
          name,
          code
        )
      `
      )
      .eq('user_id', userId)
      .order('sample_taken_at', { ascending: false });

    if (testsError) throw testsError;

    // Get all biomarker results for user's tests
    const testIds = bloodTests?.map((t) => t.id) || [];
    let biomarkerResults: Record<string, unknown>[] = [];

    if (testIds.length > 0) {
      const { data: results, error: resultsError } = await supabase
        .from('blood_test_results')
        .select(
          `
          id,
          value,
          unit,
          ref_low,
          ref_high,
          flag,
          blood_test_id,
          biomarker:biomarker_id (
            id,
            name,
            display_name,
            category:category_id (
              id,
              name
            )
          )
        `
        )
        .in('blood_test_id', testIds);

      if (resultsError) throw resultsError;
      biomarkerResults = results || [];
    }

    res.json({
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        role: authUser.user.app_metadata?.role || 'user',
        created_at: authUser.user.created_at,
        last_sign_in: authUser.user.last_sign_in_at,
      },
      profile,
      panel: userPanel || null,
      bloodTests: bloodTests || [],
      biomarkerResults: biomarkerResults || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Update user role (Super Admin only)
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
    }

    const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });

    if (error) throw error;

    res.json({ message: `User role updated to ${role}`, user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Update user's panel assignment
 */
export const updateUserPanel = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { panelId } = req.body;

    if (!panelId) {
      return res.status(400).json({ error: 'panelId is required' });
    }

    // Check if panel link exists
    const { data: existing } = await supabase
      .from('user_panel_links')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update existing link
      const { data, error } = await supabase
        .from('user_panel_links')
        .update({ panel_id: panelId })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      res.json({ message: 'Panel updated successfully', data });
    } else {
      // Create new link
      const { data, error } = await supabase
        .from('user_panel_links')
        .insert({ user_id: userId, panel_id: panelId })
        .select()
        .single();

      if (error) throw error;
      res.json({ message: 'Panel assigned successfully', data });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Remove user's panel assignment
 */
export const removeUserPanel = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { error } = await supabase.from('user_panel_links').delete().eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Panel removed successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Create a blood test for a user
 */
export const createUserBloodTest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { panelId, sampleTakenAt, status, labId } = req.body;

    if (!panelId || !sampleTakenAt) {
      return res.status(400).json({ error: 'panelId and sampleTakenAt are required' });
    }

    const insertData: Record<string, unknown> = {
      user_id: userId,
      panel_id: panelId,
      sample_taken_at: sampleTakenAt,
      status: status || 'completed',
    };

    if (labId) {
      insertData.lab_id = labId;
    }

    const { data, error } = await supabase
      .from('blood_tests')
      .insert(insertData)
      .select(
        `
        id,
        sample_taken_at,
        status,
        lab_id,
        panel:panel_id (
          id,
          name,
          code
        )
      `
      )
      .single();

    if (error) throw error;

    res.json({ bloodTest: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Delete a blood test
 */
export const deleteUserBloodTest = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;

    // First delete all related results
    await supabase.from('blood_test_results').delete().eq('blood_test_id', testId);

    // Then delete the test
    const { error } = await supabase.from('blood_tests').delete().eq('id', testId);

    if (error) throw error;

    res.json({ message: 'Blood test deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Get biomarkers for a specific panel
 */
export const getPanelBiomarkers = async (req: Request, res: Response) => {
  try {
    const { panelId } = req.params;

    const { data, error } = await supabase
      .from('panel_biomarkers')
      .select(
        `
        biomarker:biomarker_id (
          id,
          name,
          display_name,
          unit,
          ref_male_min,
          ref_male_max,
          ref_female_min,
          ref_female_max,
          performance_male_min,
          performance_male_max,
          performance_female_min,
          performance_female_max,
          category:category_id (
            id,
            name
          )
        )
      `
      )
      .eq('panel_id', panelId);

    if (error) throw error;

    const biomarkers = data?.map((item) => item.biomarker) || [];

    res.json({ biomarkers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Create or update biomarker results for a blood test
 */
export const upsertBiomarkerResults = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const { results } = req.body; // Array of { biomarker_id, value, unit, ref_low, ref_high, flag }

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: 'results array is required' });
    }

    // Prepare data for upsert
    const resultsData = results.map((result) => ({
      blood_test_id: testId,
      biomarker_id: result.biomarker_id,
      value: result.value,
      unit: result.unit,
      ref_low: result.ref_low,
      ref_high: result.ref_high,
      flag: result.flag || null,
    }));

    const { data, error } = await supabase
      .from('blood_test_results')
      .upsert(resultsData, {
        onConflict: 'blood_test_id,biomarker_id',
      })
      .select();

    if (error) throw error;

    res.json({ results: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Delete a specific biomarker result
 */
export const deleteBiomarkerResult = async (req: Request, res: Response) => {
  try {
    const { resultId } = req.params;

    const { error } = await supabase.from('blood_test_results').delete().eq('id', resultId);

    if (error) throw error;

    res.json({ message: 'Biomarker result deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Get blood test results with biomarker details
 */
export const getBloodTestResults = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;

    const { data, error } = await supabase
      .from('blood_test_results')
      .select(
        `
        id,
        value,
        unit,
        ref_low,
        ref_high,
        flag,
        biomarker:biomarker_id (
          id,
          name,
          display_name,
          category:category_id (
            id,
            name
          )
        )
      `
      )
      .eq('blood_test_id', testId);

    if (error) throw error;

    res.json({ results: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
