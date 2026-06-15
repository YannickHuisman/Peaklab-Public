import type { Request, Response } from 'express';

import { stripe } from '../../helpers/stripeClient';
import { supabaseAdmin } from '../../helpers/supabaseClient';

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
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Get user's panel assignment from profiles
    const { data: userPanel } = await supabaseAdmin
      .from('profiles')
      .select('panel_id, panel:panel_id(id, name, code, description)')
      .eq('id', userId)
      .single();

    // Get all blood tests
    const { data: bloodTests, error: testsError } = await supabaseAdmin
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
      const { data: results, error: resultsError } = await supabaseAdmin
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

    // Get subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('status, plan, stripe_subscription_id, current_period_end')
      .eq('user_id', userId)
      .maybeSingle();

    res.json({
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        role: authUser.user.app_metadata?.role || 'user',
        created_at: authUser.user.created_at,
        last_sign_in: authUser.user.last_sign_in_at,
      },
      profile,
      panel: userPanel?.panel_id ? userPanel : null,
      bloodTests: bloodTests || [],
      biomarkerResults: biomarkerResults || [],
      subscription: subscription ?? null,
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

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ panel_id: panelId })
      .eq('id', userId)
      .select('panel_id')
      .single();

    if (error) throw error;
    res.json({ message: 'Panel assigned successfully', data });
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

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ panel_id: null })
      .eq('id', userId);

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

    const { data, error } = await supabaseAdmin
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
 * Update biomarker visibility setting for a user
 */
export const updateBiomarkerVisibility = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { showAllBiomarkers } = req.body;

    if (typeof showAllBiomarkers !== 'boolean') {
      return res.status(400).json({ error: 'showAllBiomarkers must be a boolean' });
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ show_all_biomarkers: showAllBiomarkers })
      .eq('id', userId);

    if (error) throw error;

    res.json({ message: 'Biomarker visibility updated' });
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
    await supabaseAdmin.from('blood_test_results').delete().eq('blood_test_id', testId);

    // Then delete the test
    const { error } = await supabaseAdmin.from('blood_tests').delete().eq('id', testId);

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

    const { data, error } = await supabaseAdmin
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

    const biomarkerIds = results.map((r: { biomarker_id: number }) => r.biomarker_id);

    // Delete existing rows for these biomarkers in this test, then re-insert
    const { error: deleteError } = await supabaseAdmin
      .from('blood_test_results')
      .delete()
      .eq('blood_test_id', testId)
      .in('biomarker_id', biomarkerIds);

    if (deleteError) throw deleteError;

    const resultsData = results.map(
      (result: {
        biomarker_id: number;
        value: number;
        unit: string;
        ref_low: number | null;
        ref_high: number | null;
        flag: string | null;
      }) => ({
        blood_test_id: testId,
        biomarker_id: result.biomarker_id,
        value: result.value,
        unit: result.unit,
        ref_low: result.ref_low,
        ref_high: result.ref_high,
        flag: result.flag || null,
      })
    );

    const { data, error } = await supabaseAdmin
      .from('blood_test_results')
      .insert(resultsData)
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

    const { error } = await supabaseAdmin.from('blood_test_results').delete().eq('id', resultId);

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

    const { data, error } = await supabaseAdmin
      .from('blood_test_results')
      .select(
        `
        id,
        biomarker_id,
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

/**
 * Delete a user's Stripe subscription (cancel immediately) and clear panel_id
 */
export const deleteUserSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Fetch subscription row
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .maybeSingle();

    // Cancel on Stripe if subscription exists there
    if (sub?.stripe_subscription_id) {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id);
    }

    // Remove from DB
    const { error: deleteError } = await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Clear panel assignment
    await supabaseAdmin.from('profiles').update({ panel_id: null }).eq('id', userId);

    res.json({ message: 'Subscription deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Permanently delete a user: cancels subscription, deletes profile data, then removes auth account
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Cancel Stripe subscription if present
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (sub?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(sub.stripe_subscription_id);
      } catch {
        // ignore – subscription may already be cancelled
      }
    }

    // Helper to run a delete and throw a descriptive error if it fails
    const del = async (table: string, column: string, value: string) => {
      const { error } = await supabaseAdmin.from(table).delete().eq(column, value);

      if (error) throw new Error(`Failed to delete from ${table}: ${error.message}`);
    };
    const delIn = async (table: string, column: string, ids: string[]) => {
      if (!ids.length) return;
      const { error } = await supabaseAdmin.from(table).delete().in(column, ids);

      if (error) throw new Error(`Failed to delete from ${table}: ${error.message}`);
    };

    // Delete child rows first to avoid FK violations
    // blood_test_results -> blood_tests -> user
    const { data: bloodTests } = await supabaseAdmin
      .from('blood_tests')
      .select('id')
      .eq('user_id', userId);

    await delIn(
      'blood_test_results',
      'blood_test_id',
      (bloodTests ?? []).map((t) => t.id)
    );
    await del('blood_tests', 'user_id', userId);

    // chat_messages -> chat_conversations -> user
    const { data: conversations } = await supabaseAdmin
      .from('chat_conversations')
      .select('id')
      .eq('user_id', userId);

    await delIn(
      'chat_messages',
      'conversation_id',
      (conversations ?? []).map((c) => c.id)
    );
    await del('chat_conversations', 'user_id', userId);

    // other user tables
    await del('performance_profiles', 'user_id', userId);
    await del('user_settings', 'user_id', userId);
    await del('appointments', 'user_id', userId);
    await del('blood_result_uploads', 'user_id', userId);
    await del('admin_notifications', 'user_id', userId);
    await del('subscriptions', 'user_id', userId);
    await del('profiles', 'id', userId);

    // Delete Supabase auth user last
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) throw new Error(`Auth delete failed: ${authError.message}`);

    res.json({ message: 'User deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
