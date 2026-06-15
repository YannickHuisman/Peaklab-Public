import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { useTranslation } from '@helpers/i18n';

import type { Conversation } from '@package/api';

import {
  StyledActionButton,
  StyledConversationActions,
  StyledConversationItem,
  StyledConversationTitle,
  StyledIconWrapper,
  StyledNewChatButton,
  StyledRenameInput,
  StyledSidebar,
  StyledSidebarHeader,
} from '../../styles';
import type { ChatTab } from '../../types';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeTab: ChatTab;
  renamingId: string | null;
  renameValue: string;
  onConversationClick: (conv: Conversation) => void;
  onNewChat: () => void;
  onStartRename: (conv: Conversation) => void;
  onRenameChange: (value: string) => void;
  onRenameCommit: () => void;
  onRenameCancel: () => void;
  onDelete: (convId: string) => void;
}

export function ChatSidebar({
  conversations,
  activeTab,
  renamingId,
  renameValue,
  onConversationClick,
  onNewChat,
  onStartRename,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
  onDelete,
}: ChatSidebarProps) {
  const { t } = useTranslation();

  return (
    <StyledSidebar>
      <StyledSidebarHeader>
        <Paragraph $size="small" $weight={600}>
          {t('Gesprekken')}
        </Paragraph>
        <StyledNewChatButton
          type="button"
          onClick={onNewChat}
          title={t('Nieuw gesprek')}
          aria-label={t('Nieuw gesprek')}
        >
          <StyledIconWrapper aria-hidden="true">
            <Icons.Plus size="sm" />
          </StyledIconWrapper>
        </StyledNewChatButton>
      </StyledSidebarHeader>

      {conversations.map((conv) => (
        <StyledConversationItem
          key={conv.id}
          $active={activeTab.conversation?.id === conv.id}
          onClick={() => onConversationClick(conv)}
          role="button"
          tabIndex={0}
          aria-label={conv.title}
          onKeyDown={(e) => {
            // Only activate on keys aimed at the row itself, not those bubbling up
            // from the nested rename input (otherwise Space can't be typed there).
            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onConversationClick(conv);
            }
          }}
        >
          {renamingId === conv.id && (
            <StyledRenameInput
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onBlur={onRenameCommit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRenameCommit();
                if (e.key === 'Escape') onRenameCancel();
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          )}
          {renamingId !== conv.id && (
            <>
              <StyledConversationTitle>{conv.title}</StyledConversationTitle>
              <StyledConversationActions>
                <StyledActionButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRename(conv);
                  }}
                  title={t('Hernoemen')}
                  aria-label={`${t('Hernoemen')}: ${conv.title}`}
                >
                  <Icons.Edit size="xs" aria-hidden="true" />
                </StyledActionButton>
                <StyledActionButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title={t('Verwijderen')}
                  aria-label={`${t('Verwijderen')}: ${conv.title}`}
                >
                  <Icons.Trash size="xs" aria-hidden="true" />
                </StyledActionButton>
              </StyledConversationActions>
            </>
          )}
        </StyledConversationItem>
      ))}
    </StyledSidebar>
  );
}
