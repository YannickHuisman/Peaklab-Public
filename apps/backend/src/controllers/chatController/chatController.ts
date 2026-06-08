import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

/**
 * List all conversations for the authenticated user
 */
export const getConversations = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .select('id, title, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({ conversations: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { title } = req.body;

    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .insert({
        user_id: user.id,
        title: typeof title === 'string' && title.trim() ? title.trim() : 'Nieuw gesprek',
      })
      .select('id, title, created_at, updated_at')
      .single();

    if (error) throw error;

    res.status(201).json({ conversation: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Rename a conversation
 */
export const renameConversation = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .update({ title: title.trim(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, title, created_at, updated_at')
      .single();

    if (error) throw error;

    res.json({ conversation: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Delete a conversation (and all its messages via CASCADE)
 */
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('chat_conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;

    // Verify ownership
    const { data: conv, error: convError } = await supabaseAdmin
      .from('chat_conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (convError || !conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ messages: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Save messages to a conversation (batch insert)
 */
export const saveMessages = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Verify ownership
    const { data: conv, error: convError } = await supabaseAdmin
      .from('chat_conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (convError || !conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const rows = messages.map((m: { role: string; content: string }) => ({
      conversation_id: id,
      role: m.role,
      content: m.content,
    }));

    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .insert(rows)
      .select('id, role, content, created_at');

    if (error) throw error;

    // Touch conversation updated_at
    await supabaseAdmin
      .from('chat_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    res.status(201).json({ messages: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
