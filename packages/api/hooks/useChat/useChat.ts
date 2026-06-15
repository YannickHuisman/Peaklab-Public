import { useCallback, useState } from 'react';

import { authenticatedFetch } from '../../utils/authenticatedFetch';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch('/api/chat/conversations');

      if (!res.ok) throw new Error('Failed to fetch conversations');

      const json = await res.json();

      setConversations(json.conversations ?? []);

      return json.conversations as Conversation[];
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (title?: string): Promise<Conversation | null> => {
    try {
      const res = await authenticatedFetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error('Failed to create conversation');

      const json = await res.json();
      const conv = json.conversation as Conversation;

      setConversations((prev) => [conv, ...prev]);

      return conv;
    } catch {
      return null;
    }
  }, []);

  const renameConversation = useCallback(async (id: string, title: string): Promise<boolean> => {
    try {
      const res = await authenticatedFetch(`/api/chat/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error('Failed to rename conversation');

      const json = await res.json();
      const updated = json.conversation as Conversation;

      setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));

      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await authenticatedFetch(`/api/chat/conversations/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete conversation');

      setConversations((prev) => prev.filter((c) => c.id !== id));

      return true;
    } catch {
      return false;
    }
  }, []);

  const fetchMessages = useCallback(
    async (conversationId: string): Promise<ConversationMessage[]> => {
      try {
        const res = await authenticatedFetch(`/api/chat/conversations/${conversationId}/messages`);

        if (!res.ok) throw new Error('Failed to fetch messages');

        const json = await res.json();

        return json.messages as ConversationMessage[];
      } catch {
        return [];
      }
    },
    []
  );

  const saveMessages = useCallback(
    async (
      conversationId: string,
      messages: Array<{ role: string; content: string }>
    ): Promise<boolean> => {
      try {
        const res = await authenticatedFetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        });

        return res.ok;
      } catch {
        return false;
      }
    },
    []
  );

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    fetchMessages,
    saveMessages,
  };
}
