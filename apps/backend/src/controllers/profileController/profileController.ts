import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    res.json({ profile: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

const ALLOWED_PROFILE_FIELDS = [
  'username',
  'full_name',
  'avatar_url',
  'website',
  'birth_date',
  'gender',
  'weight_kg',
  'sport_type',
  'sport_frequency_per_week',
] as const;

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    // Only allow whitelisted fields
    const updates: Record<string, unknown> = {};

    for (const field of ALLOWED_PROFILE_FIELDS) {
      if (field in req.body) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No valid fields to update' });

      return;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ profile: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file provided' });

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });

      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      res.status(400).json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' });

      return;
    }

    const fileExt = file.originalname.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar.${fileExt}`;

    // Delete old avatar files for this user (clean up)
    const { data: existingFiles } = await supabaseAdmin.storage.from(AVATAR_BUCKET).list(user.id);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map((f) => `${user.id}/${f.name}`);

      await supabaseAdmin.storage.from(AVATAR_BUCKET).remove(filesToDelete);
    }

    // Upload new avatar
    const { error: uploadError } = await supabaseAdmin.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

    // Add cache-busting timestamp
    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    // Update profile with new avatar URL
    const { data: profile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ profile, avatar_url: avatarUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    // Delete all avatar files for this user
    const { data: existingFiles } = await supabaseAdmin.storage.from(AVATAR_BUCKET).list(user.id);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map((f) => `${user.id}/${f.name}`);

      await supabaseAdmin.storage.from(AVATAR_BUCKET).remove(filesToDelete);
    }

    // Clear avatar URL in profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
