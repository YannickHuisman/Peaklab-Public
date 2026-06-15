import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

const BLOOD_RESULTS_BUCKET = 'blood-results';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf'];

// User: Upload a blood result PDF
export const uploadBloodResult = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only PDF files are accepted.' });
    }

    // Sanitize original filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `${user.id}/${timestamp}-${safeName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BLOOD_RESULTS_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Store the file path (we'll generate signed URLs on demand for viewing)
    // Create upload record
    const { data: upload, error: insertError } = await supabaseAdmin
      .from('blood_result_uploads')
      .insert({
        user_id: user.id,
        file_url: filePath, // Store path, not public URL
        file_name: file.originalname,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Create admin notification
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, username')
      .eq('id', user.id)
      .single();

    const userName = profile?.full_name || profile?.username || 'Unknown user';

    await supabaseAdmin.from('admin_notifications').insert({
      type: 'blood_result_upload',
      title: 'Nieuw bloedresultaat geüpload',
      message: `${userName} heeft een bloedresultaat PDF geüpload: ${file.originalname}`,
      user_id: user.id,
      reference_id: upload.id,
    });

    // Send email notification to admins
    // await sendAdminEmailNotification(userName, file.originalname);

    res.status(201).json({ upload });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// User: Get own uploads
export const getUserUploads = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data, error } = await supabaseAdmin
      .from('blood_result_uploads')
      .select('id, file_name, status, admin_notes, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ uploads: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Get all uploads (with user info)
export const getAllUploads = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    let query = supabaseAdmin
      .from('blood_result_uploads')
      .select(
        `
        id, file_url, file_name, status, admin_notes, reviewed_at, created_at, updated_at,
        user:user_id (id, full_name, username, avatar_url),
        reviewer:reviewed_by (id, full_name)
      `
      )
      .order('created_at', { ascending: false });

    if (status && typeof status === 'string') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ uploads: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Update upload status (review/process/reject)
export const updateUploadStatus = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { uploadId } = req.params;
    const { status, admin_notes, blood_test_id } = req.body;

    const validStatuses = ['pending', 'in_review', 'processed', 'rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (blood_test_id !== undefined) updateData.blood_test_id = blood_test_id;

    // Set reviewer info when moving past pending
    if (status !== 'pending') {
      updateData.reviewed_by = user.id;
      updateData.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('blood_result_uploads')
      .update(updateData)
      .eq('id', uploadId)
      .select(
        `
        id, file_url, file_name, status, admin_notes, reviewed_at, created_at, updated_at,
        user:user_id (id, full_name, username, avatar_url),
        reviewer:reviewed_by (id, full_name)
      `
      )
      .single();

    if (error) throw error;

    res.json({ upload: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Get notifications
export const getAdminNotifications = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_notifications')
      .select(
        `
        id, type, title, message, reference_id, is_read, created_at,
        user:user_id (id, full_name, username, avatar_url)
      `
      )
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ notifications: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Mark notification as read
export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const { error } = await supabaseAdmin
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Mark all notifications as read
export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const { error } = await supabaseAdmin
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) throw error;

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// User: Get a signed URL for viewing their own uploaded file
export const getUserUploadSignedUrl = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { uploadId } = req.params;

    // Fetch the upload — enforce ownership
    const { data: upload, error: fetchError } = await supabaseAdmin
      .from('blood_result_uploads')
      .select('file_url')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    let filePath = upload.file_url;

    const storagePrefix = '/storage/v1/object/';

    if (filePath.includes(storagePrefix)) {
      const afterBucket = filePath.split(`${BLOOD_RESULTS_BUCKET}/`)[1];

      filePath = afterBucket || filePath;
    }

    const { data, error: signError } = await supabaseAdmin.storage
      .from(BLOOD_RESULTS_BUCKET)
      .createSignedUrl(filePath, 3600);

    if (signError || !data?.signedUrl) {
      return res.status(500).json({ error: signError?.message || 'Failed to generate signed URL' });
    }

    res.json({ signedUrl: data.signedUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Get a signed URL for viewing an uploaded file
export const getUploadSignedUrl = async (req: Request, res: Response) => {
  try {
    const { uploadId } = req.params;

    // Get the upload record to get the file path
    const { data: upload, error: fetchError } = await supabaseAdmin
      .from('blood_result_uploads')
      .select('file_url')
      .eq('id', uploadId)
      .single();

    if (fetchError || !upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    // Normalise: strip any full URL prefix and keep only the storage path
    let filePath = upload.file_url;

    const storagePrefix = '/storage/v1/object/';

    if (filePath.includes(storagePrefix)) {
      // Old uploads stored a full public URL — extract the path after the bucket name
      const afterPublic = filePath.split(`${BLOOD_RESULTS_BUCKET}/`)[1];

      filePath = afterPublic || filePath;
    }

    // Generate a signed URL valid for 1 hour
    const { data, error: signError } = await supabaseAdmin.storage
      .from(BLOOD_RESULTS_BUCKET)
      .createSignedUrl(filePath, 3600);

    if (signError || !data?.signedUrl) {
      return res.status(500).json({ error: signError?.message || 'Failed to generate signed URL' });
    }

    res.json({ signedUrl: data.signedUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Helper: Send email notification to admins
// async function sendAdminEmailNotification(userName: string, fileName: string) {
//   const resendApiKey = process.env.RESEND_API_KEY;
//   const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

//   if (!resendApiKey || !adminEmail) {
//     // Email not configured, skip silently
//     return;
//   }

//   try {
//     await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${resendApiKey}`,
//       },
//       body: JSON.stringify({
//         from: 'Peaklab <notifications@peaklab.nl>',
//         to: adminEmail,
//         subject: `Nieuw bloedresultaat: ${userName}`,
//         html: `
//           <h2>Nieuw bloedresultaat geüpload</h2>
//           <p><strong>${userName}</strong> heeft een bloedresultaat PDF geüpload.</p>
//           <p><strong>Bestand:</strong> ${fileName}</p>
//           <p>Log in op het admin dashboard om het resultaat te bekijken en te verwerken.</p>
//         `,
//       }),
//     });
//   } catch {
//     // Don't fail the upload if email fails
//     console.error('Failed to send admin email notification');
//   }
// }
