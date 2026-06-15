import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { useTranslation } from '@helpers/i18n';

import {
  StyledDialogActions,
  StyledDialogButton,
  StyledSaveDialog,
  StyledSaveOverlay,
} from '../../styles';

interface SaveDialogProps {
  onCancel: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export function SaveDialog({ onCancel, onDiscard, onSave }: SaveDialogProps) {
  const { t } = useTranslation();

  return (
    <StyledSaveOverlay>
      <StyledSaveDialog>
        <Heading $size="small">{t('Gesprek opslaan?')}</Heading>
        <Paragraph $size="small" $variant="secondary">
          {t(
            'Je hebt een lopend gesprek dat nog niet is opgeslagen. Wil je dit opslaan voordat je verdergaat?'
          )}
        </Paragraph>
        <StyledDialogActions>
          <StyledDialogButton onClick={onCancel}>{t('Annuleren')}</StyledDialogButton>
          <StyledDialogButton onClick={onDiscard}>{t('Niet opslaan')}</StyledDialogButton>
          <StyledDialogButton $variant="primary" onClick={onSave}>
            {t('Opslaan')}
          </StyledDialogButton>
        </StyledDialogActions>
      </StyledSaveDialog>
    </StyledSaveOverlay>
  );
}
