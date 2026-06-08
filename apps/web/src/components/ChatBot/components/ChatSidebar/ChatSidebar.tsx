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
        <StyledNewChatButton onClick={onNewChat} title={t('Nieuw gesprek')}>
          <StyledIconWrapper>
            <Icons.Plus size="sm" />
          </StyledIconWrapper>
        </StyledNewChatButton>
      </StyledSidebarHeader>

      {conversations.map((conv) => (
        <StyledConversationItem
          key={conv.id}
          $active={activeTab.conversation?.id === conv.id}
          onClick={() => onConversationClick(conv)}
        >
          {renamingId === conv.id ? (
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
          ) : (
            <>
              <StyledConversationTitle>{conv.title}</StyledConversationTitle>
              <StyledConversationActions>
                <StyledActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRename(conv);
                  }}
                  title={t('Hernoemen')}
                >
                  <Icons.Edit size="xs" />
                </StyledActionButton>
                <StyledActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title={t('Verwijderen')}
                >
                  <Icons.Trash size="xs" />
                </StyledActionButton>
              </StyledConversationActions>
            </>
          )}
        </StyledConversationItem>
      ))}
    </StyledSidebar>
  );
}
