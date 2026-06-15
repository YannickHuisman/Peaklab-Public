import { useCallback, useEffect, useRef, useState } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useToast } from '@context/ToastProvider';
import { useTranslation } from '@helpers/i18n';
import { streamChatMessage } from '@helpers/llmClient';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

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
  StyledMobileBackButton,
  StyledMobilePanel,
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
  const { showToast } = useToast();
  const { isMobile } = useDeviceBreakpoints();
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('chat');
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

  // The conversations list is the single source of truth for saved titles, so
  // the header derives from it rather than from a copy stored on the tab. That
  // way a rename (which updates `conversations`) reflects here automatically
  // and the two can never diverge. New/unsaved tabs fall back to their own
  // provisional title.
  const activeSavedTitle = activeTab?.conversation
    ? conversations.find((c) => c.id === activeTab.conversation?.id)?.title
    : undefined;
  const activeTitle = activeSavedTitle ?? activeTab?.title ?? '';

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
        if (isMobile) setMobileView('chat');

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
      if (isMobile) setMobileView('chat');

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
    [tabs, activeTab, fetchMessages, switchToTab, isMobile]
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
    if (isMobile) setMobileView('chat');
  }, [activeTab, switchToTab, isMobile]);

  const doSaveCurrentChat = useCallback(async () => {
    if (!activeTab || activeTab.messages.length === 0) return;

    const firstUserMsg = activeTab.messages.find((m) => m.role === 'user');
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
      : 'Nieuw gesprek';

    const conv = await createConversation(title);

    if (!conv) {
      showToast(t('Opslaan van het gesprek is mislukt. Probeer het opnieuw.'));

      return;
    }

    const saved = await saveMessages(
      conv.id,
      activeTab.messages.map((m) => ({ role: m.role, content: m.content }))
    );

    // Only mark the tab as saved once the messages actually persisted —
    // otherwise we'd clear the dirty flag while the messages were lost.
    if (!saved) {
      showToast(t('Opslaan van het gesprek is mislukt. Probeer het opnieuw.'));

      return;
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab.id
          ? { ...tab, id: conv.id, conversation: conv, title: conv.title, isDirty: false }
          : tab
      )
    );
    setActiveTabId(conv.id);
  }, [activeTab, createConversation, saveMessages, showToast, t]);

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

    // `renameConversation` updates the conversations list (the single source of
    // truth); the sidebar and the derived header title both read from it, so no
    // tab state needs touching here — which is exactly why they can't diverge.
    const renamed = await renameConversation(renamingId, renameValue.trim());

    if (!renamed) {
      showToast(t('Hernoemen van het gesprek is mislukt. Probeer het opnieuw.'));
    }

    setRenamingId(null);
  }, [renamingId, renameValue, renameConversation, showToast, t]);

  const handleDelete = useCallback(
    async (convId: string) => {
      // Only drop the tab from the UI once the server confirmed the delete,
      // so a failed delete can't make a conversation vanish locally and
      // reappear on reload.
      const deleted = await deleteConversation(convId);

      if (!deleted) {
        showToast(t('Verwijderen van het gesprek is mislukt. Probeer het opnieuw.'));

        return;
      }

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
    [activeTab, deleteConversation, showToast, t]
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
        const saved = await saveMessages(currentTab.conversation.id, [
          { role: 'user', content: trimmed },
          { role: 'assistant', content: fullResponse },
        ]);

        // Only clear the dirty flag when the messages actually persisted, so a
        // failed save keeps the conversation marked unsaved instead of silently
        // dropping the exchange.
        if (saved) {
          setTabs((prev) =>
            prev.map((tab) => (tab.id === activeTabId ? { ...tab, isDirty: false } : tab))
          );
        } else {
          showToast(t('Opslaan van het bericht is mislukt. Probeer het opnieuw.'));
        }
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
      <StyledMobilePanel $side="left" $active={!isMobile || mobileView === 'sidebar'}>
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
      </StyledMobilePanel>

      <StyledMobilePanel $side="right" $active={!isMobile || mobileView === 'chat'}>
        <StyledChatContainer>
          <FlexColumn $gap="sm">
            <FlexRow $gap="sm" $align="center">
              {isMobile && (
                <StyledMobileBackButton
                  type="button"
                  onClick={() => setMobileView('sidebar')}
                  aria-label={t('Terug naar gesprekken')}
                >
                  <Icons.ArrowLeft size="sm" aria-hidden="true" />
                </StyledMobileBackButton>
              )}
              <FlexColumn>
                <Heading $size="medium">{activeTitle}</Heading>
                <Paragraph $variant="secondary" $weight={400}>
                  {t('Stel een vraag over je gezondheid')}
                </Paragraph>
              </FlexColumn>
            </FlexRow>

            <Spacer size="xs" />
          </FlexColumn>

          <StyledMessagesArea ref={messagesAreaRef}>
            {activeTab.isLoading && (
              <StyledEmptyState>
                <StyledTypingIndicator>
                  <span />
                  <span />
                  <span />
                </StyledTypingIndicator>
              </StyledEmptyState>
            )}
            {!activeTab.isLoading && activeTab.messages.length === 0 && (
              <StyledEmptyState>
                <StyledEmptyStateIcon>
                  <img src="/icoon-logo-zwart-transparant.svg" alt="No messages" />
                </StyledEmptyStateIcon>
                <Paragraph $variant="tertiary">{t('Nog geen berichten')}</Paragraph>
              </StyledEmptyState>
            )}

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
              aria-label={t('Typ je vraag')}
            />

            {!activeTab.conversation && activeTab.messages.length > 0 && (
              <StyledActionButton
                type="button"
                onClick={doSaveCurrentChat}
                title={t('Gesprek opslaan')}
                aria-label={t('Gesprek opslaan')}
                style={{ width: 40, height: 40 }}
              >
                <Icons.Save size="sm" aria-hidden="true" />
              </StyledActionButton>
            )}

            <StyledSendButton
              type="button"
              onClick={handleSend}
              disabled={isStreaming || !hasContent}
              $hasContent={hasContent}
              aria-label={t('Verstuur bericht')}
            >
              <StyledIconWrapper aria-hidden="true">
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
      </StyledMobilePanel>
    </StyledChatWrapper>
  );
}
