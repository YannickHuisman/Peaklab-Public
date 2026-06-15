import type { ChatUserContext } from '@helpers/llmClient';

import type { Conversation } from '@package/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatBotProps {
  userContext?: ChatUserContext;
}

export interface ChatTab {
  id: string;
  title: string;
  messages: ChatMessage[];
  conversation?: Conversation;
  isDirty: boolean;
  isLoading?: boolean;
}
