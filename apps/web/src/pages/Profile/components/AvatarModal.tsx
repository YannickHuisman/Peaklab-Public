import { Button } from '@components/Button/Button';
import { Icons } from '@components/Icons';
import { Modal } from '@components/Modal';
import { OptimizedImage } from '@components/OptimizedImage';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import type { Profile } from '@package/api';
import { theme } from '@package/ui';

import { StyledAvatarModalPreview } from '../styles';

interface AvatarModalProps {
  isOpen: boolean;
  profile: Profile | null;
  uploading: boolean;
  onClose: () => void;
  onUploadClick: () => void;
  onDelete: () => void;
}

export function AvatarModal({
  isOpen,
  profile,
  uploading,
  onClose,
  onUploadClick,
  onDelete,
}: AvatarModalProps) {
  const { t } = useTranslation();
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Profielfoto')} maxWidth="420px">
      <FlexColumn $gap="lg" $align="center">
        <StyledAvatarModalPreview>
          {avatarUrl && (
            <OptimizedImage
              src={avatarUrl}
              alt="Avatar"
              width="100%"
              height="100%"
              borderRadius={theme.borderRadius.full}
              fallbackIcon={<Icons.User size={64} color={theme.colors.text.muted} />}
            />
          )}
          {!avatarUrl && <Icons.User size={64} color={theme.colors.text.muted} />}
        </StyledAvatarModalPreview>

        <FlexColumn $gap="sm" $align="center" $width="100%">
          <Button $variant="primary" $fullWidth onClick={onUploadClick} disabled={uploading}>
            {uploading && t('Uploaden...')}
            {!uploading && (
              <>
                <Icons.Edit size="sm" />
                {avatarUrl ? t('Foto wijzigen') : t('Foto uploaden')}
              </>
            )}
          </Button>

          {avatarUrl && (
            <Button $variant="secondary" $fullWidth onClick={onDelete} disabled={uploading}>
              <Icons.Trash size="sm" />
              {t('Foto verwijderen')}
            </Button>
          )}

          <Paragraph $size="xsmall" $variant="tertiary" $align="center">
            {t('Max 5MB, JPG, PNG, WebP of GIF')}
          </Paragraph>
        </FlexColumn>
      </FlexColumn>
    </Modal>
  );
}
