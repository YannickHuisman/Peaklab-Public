import { useCallback, useEffect, useRef, useState } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';
import { streamChatMessage } from '@helpers/llmClient';

import type { Conversation } from '@package/api';
import { useChat } from '@package/api';

import { ChatSidebar } from './components/ChatSidebar';
import { SaveDialog } from './components/SaveDialog';
import {
  StyledActionButton,
  StyledAvatarIcon,
  StyledChatContainer,
  StyledChatInput,
  StyledChatWrapper,
  StyledEmptyState,
  StyledEmptyStateIcon,
  StyledErrorMessage,
  StyledIconWrapper,
  StyledInputArea,
  StyledMessageBubble,
  StyledMessageRow,
  StyledMessagesArea,
  StyledSendButton,
  StyledTypingIndicator,
} from './styles';
import type { ChatBotProps, ChatMessage, ChatTab } from './types';

let messageCounter = 0;
const createMessageId = () => `msg-${++messageCounter}`;
const NEW_TAB_PREFIX = '__new__';

function createNewTab(): ChatTab {
  return {
    id: NEW_TAB_PREFIX + Date.now(),
    title: 'Nieuw gesprek',
    messages: [],
    isDirty: false,
  };
}

export function ChatBot({ userContext }: ChatBotProps) {
  const { t } = useTranslation();
  const {
    conversations,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    fetchMessages,
    saveMessages,
  } = useChat();

  const [tabs, setTabs] = useState<ChatTab[]>(() => [createNewTab()]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingTabSwitch, setPendingTabSwitch] = useState<string | null>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  useEffect(() => {
    const el = messagesAreaRef.current;

    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [activeTab?.messages]);

  const hasUnsavedMessages = tabs.some((tab) => tab.isDirty && !tab.conversation);

  useEffect(() => {
    if (!hasUnsavedMessages) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedMessages]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchConversations();
    }
  }, [fetchConversations]);

  const switchToTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    setInput('');
    setError(null);
  }, []);

  const openConversation = useCallback(
    async (conv: Conversation) => {
      const existing = tabs.find((tab) => tab.conversation?.id === conv.id);

      if (existing) {
        switchToTab(existing.id);

        return;
      }

      if (activeTab.isDirty && !activeTab.conversation) {
        setPendingTabSwitch(conv.id);
        setShowSaveDialog(true);

        return;
      }

      const tabId = conv.id;
      const placeholderTab: ChatTab = {
        id: tabId,
        title: conv.title,
        messages: [],
        conversation: conv,
        isDirty: false,
        isLoading: true,
      };

      setTabs((prev) => {
        const hasEmptyNew = prev.some((t) => !t.conversation && t.messages.length === 0);

        if (hasEmptyNew) {
          return [...prev.filter((t) => t.conversation || t.messages.length > 0), placeholderTab];
        }

        return [...prev, placeholderTab];
      });
      switchToTab(tabId);

      const msgs = await fetchMessages(conv.id);

      setTabs((prev) =>
        prev.map((t) =>
          t.id === tabId
            ? {
                ...t,
                messages: msgs.map((m) => ({ id: m.id, role: m.role, content: m.content })),
                isLoading: false,
              }
            : t
        )
      );
    },
    [tabs, activeTab, fetchMessages, switchToTab]
  );

  const handleNewChat = useCallback(() => {
    if (activeTab.isDirty && !activeTab.conversation) {
      setPendingTabSwitch(NEW_TAB_PREFIX);
      setShowSaveDialog(true);

      return;
    }

    const newTab = createNewTab();

    setTabs((prev) => [...prev, newTab]);
    switchToTab(newTab.id);
  }, [activeTab, switchToTab]);

  const doSaveCurrentChat = useCallback(async () => {
    if (!activeTab || activeTab.messages.length === 0) return;

    const firstUserMsg = activeTab.messages.find((m) => m.role === 'user');
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
      : 'Nieuw gesprek';

    const conv = await createConversation(title);

    if (conv) {
      await saveMessages(
        conv.id,
        activeTab.messages.map((m) => ({ role: m.role, content: m.content }))
      );

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTab.id
            ? { ...tab, id: conv.id, conversation: conv, title: conv.title, isDirty: false }
            : tab
        )
      );
      setActiveTabId(conv.id);
    }
  }, [activeTab, createConversation, saveMessages]);

  const finishPendingSwitch = useCallback(
    async (shouldRemoveCurrent: boolean) => {
      if (shouldRemoveCurrent) {
        setTabs((prev) => prev.filter((tab) => tab.id !== activeTab.id));
      }

      if (pendingTabSwitch) {
        if (pendingTabSwitch === NEW_TAB_PREFIX) {
          const newTab = createNewTab();

          setTabs((prev) => [...prev, newTab]);
          switchToTab(newTab.id);
        } else {
          const conv = conversations.find((c) => c.id === pendingTabSwitch);

          if (conv) {
            const msgs = await fetchMessages(conv.id);
            const tab: ChatTab = {
              id: conv.id,
              title: conv.title,
              messages: msgs.map((m) => ({ id: m.id, role: m.role, content: m.content })),
              conversation: conv,
              isDirty: false,
            };

            setTabs((prev) => [...prev, tab]);
            switchToTab(tab.id);
          }
        }
        setPendingTabSwitch(null);
      }
    },
    [activeTab, pendingTabSwitch, conversations, fetchMessages, switchToTab]
  );

  const handleSaveAndSwitch = useCallback(async () => {
    await doSaveCurrentChat();
    setShowSaveDialog(false);
    await finishPendingSwitch(false);
  }, [doSaveCurrentChat, finishPendingSwitch]);

  const handleDiscardAndSwitch = useCallback(async () => {
    setShowSaveDialog(false);
    await finishPendingSwitch(true);
  }, [finishPendingSwitch]);

  const handleCancelDialog = useCallback(() => {
    setShowSaveDialog(false);
    setPendingTabSwitch(null);
  }, []);

  const startRename = useCallback((conv: Conversation) => {
    setRenamingId(conv.id);
    setRenameValue(conv.title);
  }, []);

  const commitRename = useCallback(async () => {
    if (!renamingId || !renameValue.trim()) {
      setRenamingId(null);

      return;
    }

    await renameConversation(renamingId, renameValue.trim());

    setTabs((prev) =>
      prev.map((tab) =>
        tab.conversation?.id === renamingId
          ? {
              ...tab,
              title: renameValue.trim(),
              conversation: tab.conversation
                ? { ...tab.conversation, title: renameValue.trim() }
                : undefined,
            }
          : tab
      )
    );
    setRenamingId(null);
  }, [renamingId, renameValue, renameConversation]);

  const handleDelete = useCallback(
    async (convId: string) => {
      await deleteConversation(convId);

      setTabs((prev) => {
        const filtered = prev.filter((tab) => tab.conversation?.id !== convId);

        return filtered.length === 0 ? [createNewTab()] : filtered;
      });

      if (activeTab.conversation?.id === convId) {
        setTabs((prev) => {
          setActiveTabId(prev[0]?.id ?? '');

          return prev;
        });
      }
    },
    [activeTab, deleteConversation]
  );

  const handleSend = async () => {
    const trimmed = input.trim();

    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { id: createMessageId(), role: 'user', content: trimmed };
    const assistantMessage: ChatMessage = {
      id: createMessageId(),
      role: 'assistant',
      content: '',
    };

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, messages: [...tab.messages, userMessage, assistantMessage], isDirty: true }
          : tab
      )
    );
    setInput('');
    setIsStreaming(true);
    setError(null);

    try {
      let fullResponse = '';

      const history = activeTab.messages.map((m) => ({ role: m.role, content: m.content }));

      for await (const chunk of streamChatMessage(trimmed, userContext, history)) {
        fullResponse += chunk;
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? {
                  ...tab,
                  messages: tab.messages.map((msg) =>
                    msg.id === assistantMessage.id ? { ...msg, content: fullResponse } : msg
                  ),
                }
              : tab
          )
        );
      }

      const currentTab = tabs.find((tab) => tab.id === activeTabId);

      if (currentTab?.conversation) {
        await saveMessages(currentTab.conversation.id, [
          { role: 'user', content: trimmed },
          { role: 'assistant', content: fullResponse },
        ]);
        setTabs((prev) =>
          prev.map((tab) => (tab.id === activeTabId ? { ...tab, isDirty: false } : tab))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Er ging iets mis'));
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, messages: tab.messages.filter((msg) => msg.id !== assistantMessage.id) }
            : tab
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasContent = !!input.trim();

  return (
    <StyledChatWrapper>
      <ChatSidebar
        conversations={conversations}
        activeTab={activeTab}
        renamingId={renamingId}
        renameValue={renameValue}
        onConversationClick={openConversation}
        onNewChat={handleNewChat}
        onStartRename={startRename}
        onRenameChange={setRenameValue}
        onRenameCommit={commitRename}
        onRenameCancel={() => setRenamingId(null)}
        onDelete={handleDelete}
      />

      <StyledChatContainer>
        <FlexColumn $gap="sm">
          <FlexRow $gap="sm" $align="center">
            <Heading $size="medium">{activeTab.title}</Heading>
          </FlexRow>
          <Paragraph $variant="secondary" $weight={400}>
            {t('Stel een vraag over je gezondheid')}
          </Paragraph>
          <Spacer size="xs" />
        </FlexColumn>

        <StyledMessagesArea ref={messagesAreaRef}>
          {activeTab.isLoading ? (
            <StyledEmptyState>
              <StyledTypingIndicator>
                <span />
                <span />
                <span />
              </StyledTypingIndicator>
            </StyledEmptyState>
          ) : activeTab.messages.length === 0 ? (
            <StyledEmptyState>
              <StyledEmptyStateIcon>
                <img src="/icoon-logo-zwart-transparant.svg" alt="No messages" />
              </StyledEmptyStateIcon>
              <Paragraph $variant="tertiary">{t('Nog geen berichten')}</Paragraph>
            </StyledEmptyState>
          ) : null}

          {activeTab.messages.map((msg) => (
            <StyledMessageRow key={msg.id} $isUser={msg.role === 'user'}>
              {msg.role === 'assistant' && (
                <StyledAvatarIcon>
                  <img src="/icoon-logo-zwart-transparant.svg" alt="Assistant" />
                </StyledAvatarIcon>
              )}
              <StyledMessageBubble $isUser={msg.role === 'user'}>
                {msg.content}
                {msg.role === 'assistant' && !msg.content && isStreaming && (
                  <StyledTypingIndicator>
                    <span />
                    <span />
                    <span />
                  </StyledTypingIndicator>
                )}
              </StyledMessageBubble>
            </StyledMessageRow>
          ))}
        </StyledMessagesArea>

        {error && <StyledErrorMessage>{error}</StyledErrorMessage>}

        <StyledInputArea>
          <StyledChatInput
            type="text"
            placeholder={t('Typ je vraag...')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />

          {!activeTab.conversation && activeTab.messages.length > 0 && (
            <StyledActionButton
              onClick={doSaveCurrentChat}
              title={t('Gesprek opslaan')}
              style={{ width: 40, height: 40 }}
            >
              <Icons.Save size="sm" />
            </StyledActionButton>
          )}

          <StyledSendButton
            onClick={handleSend}
            disabled={isStreaming || !hasContent}
            $hasContent={hasContent}
          >
            <StyledIconWrapper>
              <Icons.Send size="sm" />
            </StyledIconWrapper>
          </StyledSendButton>
        </StyledInputArea>

        {showSaveDialog && (
          <SaveDialog
            onCancel={handleCancelDialog}
            onDiscard={handleDiscardAndSwitch}
            onSave={handleSaveAndSwitch}
          />
        )}
      </StyledChatContainer>
    </StyledChatWrapper>
  );
}
