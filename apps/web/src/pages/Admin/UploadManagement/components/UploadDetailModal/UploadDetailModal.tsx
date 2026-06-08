import { Button } from '@components/Button';
import { TextArea } from '@components/form/TextArea';
import { Heading } from '@components/Heading';
import { Modal } from '@components/Modal';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { BloodResultUploadWithUser, UploadStatus } from '@package/types';

import { StyledStatusBadge } from '../../../../BloodResultUploads/styles';
import { STATUS_LABELS } from '../../constants';

interface UploadDetailModalProps {
  upload: BloodResultUploadWithUser;
  adminNotes: string;
  updating: boolean;
  onClose: () => void;
  onAdminNotesChange: (value: string) => void;
  onStatusUpdate: (uploadId: string, status: UploadStatus) => void;
  onOpenFile: (uploadId: string, fileName: string) => void;
}

export function UploadDetailModal({
  upload,
  adminNotes,
  updating,
  onClose,
  onAdminNotesChange,
  onStatusUpdate,
  onOpenFile,
}: UploadDetailModalProps) {
  const { t } = useTranslation();

  return (
    <Modal isOpen onClose={onClose} title={`Upload: ${upload.file_name}`}>
      <FlexColumn $gap="lg">
        <StyledCard $padding="lg">
          <FlexColumn $gap="sm">
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                {t('Gebruiker:')}
              </Paragraph>
              <Paragraph $size="small">
                {upload.user?.full_name || upload.user?.username || t('Onbekend')}
              </Paragraph>
            </FlexRow>
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                {t('Bestand:')}
              </Paragraph>
              <Paragraph $size="small">{upload.file_name}</Paragraph>
            </FlexRow>
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                {t('Geüpload:')}
              </Paragraph>
              <Paragraph $size="small">
                {new Date(upload.created_at).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Paragraph>
            </FlexRow>
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                {t('Status:')}
              </Paragraph>
              <StyledStatusBadge $tone={STATUS_LABELS[upload.status].tone}>
                {t(STATUS_LABELS[upload.status].label)}
              </StyledStatusBadge>
            </FlexRow>
          </FlexColumn>
        </StyledCard>

        <Button
          $variant="secondary"
          label={t('PDF openen')}
          onClick={() => onOpenFile(upload.id, upload.file_name)}
        />

        <TextArea
          label={t('Admin notities')}
          value={adminNotes}
          onChange={(e) => onAdminNotesChange(e.target.value)}
          placeholder={t('Voeg notities toe...')}
        />

        <Heading $size="xsmall">{t('Status bijwerken')}</Heading>

        <FlexRow $gap="sm" $justify="flex-end">
          {upload.status === 'pending' && (
            <Button
              label={t('In beoordeling')}
              $variant="secondary"
              disabled={updating}
              onClick={() => onStatusUpdate(upload.id, 'in_review')}
            />
          )}
          {upload.status !== 'processed' && (
            <Button
              label={t('Verwerkt')}
              disabled={updating}
              onClick={() => onStatusUpdate(upload.id, 'processed')}
            />
          )}
          {upload.status !== 'rejected' && (
            <Button
              label={t('Afgewezen')}
              $variant="secondary"
              disabled={updating}
              onClick={() => onStatusUpdate(upload.id, 'rejected')}
            />
          )}
        </FlexRow>
      </FlexColumn>
    </Modal>
  );
}
