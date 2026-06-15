import { Button } from '@components/Button';
import { TextArea } from '@components/form/TextArea';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Modal } from '@components/Modal';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import type { PartnerApplicationWithReviewer } from '@package/types';

import { StyledStatusBadge } from '../../../../BloodResultUploads/styles';
import {
  getRegionLabel,
  getSpecializationLabels,
  STATUS_LABELS,
  TYPE_LABELS,
} from '../../constants';

interface ApplicationDetailModalProps {
  application: PartnerApplicationWithReviewer;
  adminNotes: string;
  updating: boolean;
  onClose: () => void;
  onAdminNotesChange: (value: string) => void;
  onApprove: () => void;
  onDeny: () => void;
}

export function ApplicationDetailModal({
  application,
  adminNotes,
  updating,
  onClose,
  onAdminNotesChange,
  onApprove,
  onDeny,
}: ApplicationDetailModalProps) {
  return (
    <Modal isOpen onClose={onClose} title={`Aanvraag: ${application.company_name}`}>
      <FlexColumn $gap="lg">
        <StyledCard $padding="lg">
          <FlexColumn $gap="sm">
            <Heading $size="xsmall">Contactgegevens</Heading>
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                Naam:
              </Paragraph>
              <Paragraph $size="small">{application.contact_name}</Paragraph>
            </FlexRow>
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                E-mail:
              </Paragraph>
              <Paragraph $size="small">{application.contact_email}</Paragraph>
            </FlexRow>
            {application.phone && (
              <FlexRow $gap="sm" $align="center">
                <Paragraph $weight={600} $size="small">
                  Telefoon:
                </Paragraph>
                <Paragraph $size="small">{application.phone}</Paragraph>
              </FlexRow>
            )}
          </FlexColumn>
        </StyledCard>

        <StyledCard $padding="lg">
          <FlexColumn $gap="sm">
            <Heading $size="xsmall">Bedrijfsgegevens</Heading>
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                Bedrijf:
              </Paragraph>
              <Paragraph $size="small">{application.company_name}</Paragraph>
            </FlexRow>
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                Type:
              </Paragraph>
              <Paragraph $size="small">
                {TYPE_LABELS[application.type] || application.type}
              </Paragraph>
            </FlexRow>
            {application.website_url && (
              <FlexRow $gap="sm" $align="center">
                <Paragraph $weight={600} $size="small">
                  Website:
                </Paragraph>
                <Paragraph $size="small">{application.website_url}</Paragraph>
              </FlexRow>
            )}
            {application.description && (
              <FlexColumn $gap="xs">
                <Paragraph $weight={600} $size="small">
                  Omschrijving:
                </Paragraph>
                <Paragraph $size="small" $variant="secondary">
                  {application.description}
                </Paragraph>
              </FlexColumn>
            )}
          </FlexColumn>
        </StyledCard>

        {application.type === 'trainer' && (
          <StyledCard $padding="lg">
            <FlexColumn $gap="sm">
              <Heading $size="xsmall">Trainer details</Heading>
              <FlexRow $gap="sm" $align="center">
                <Paragraph $weight={600} $size="small">
                  Regio:
                </Paragraph>
                <Paragraph $size="small">{getRegionLabel(application.region)}</Paragraph>
              </FlexRow>
              <FlexColumn $gap="xs">
                <Paragraph $weight={600} $size="small">
                  Specialisaties:
                </Paragraph>
                <Paragraph $size="small" $variant="secondary">
                  {getSpecializationLabels(application.specializations)}
                </Paragraph>
              </FlexColumn>
            </FlexColumn>
          </StyledCard>
        )}

        {application.motivation && (
          <StyledCard $padding="lg">
            <FlexColumn $gap="sm">
              <Heading $size="xsmall">Motivatie</Heading>
              <Paragraph $size="small" $variant="secondary">
                {application.motivation}
              </Paragraph>
            </FlexColumn>
          </StyledCard>
        )}

        <StyledCard $padding="lg">
          <FlexColumn $gap="sm">
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="small">
                Ingediend:
              </Paragraph>
              <Paragraph $size="small">
                {new Date(application.created_at).toLocaleDateString('nl-NL', {
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
                Status:
              </Paragraph>
              <StyledStatusBadge $tone={STATUS_LABELS[application.status].tone}>
                {STATUS_LABELS[application.status].label}
              </StyledStatusBadge>
            </FlexRow>
            {application.reviewer && (
              <FlexRow $gap="sm" $align="center">
                <Paragraph $weight={600} $size="small">
                  Beoordeeld door:
                </Paragraph>
                <Paragraph $size="small">{application.reviewer.full_name || 'Admin'}</Paragraph>
              </FlexRow>
            )}
            {application.admin_notes && application.status !== 'pending' && (
              <FlexColumn $gap="xs">
                <Paragraph $weight={600} $size="small">
                  Admin notities:
                </Paragraph>
                <Paragraph $size="small" $variant="secondary">
                  {application.admin_notes}
                </Paragraph>
              </FlexColumn>
            )}
          </FlexColumn>
        </StyledCard>

        {application.status === 'pending' && (
          <>
            <TextArea
              label="Admin notities"
              value={adminNotes}
              onChange={(e) => onAdminNotesChange(e.target.value)}
              placeholder="Voeg eventueel notities toe..."
            />

            <FlexRow $gap="sm" $justify="flex-end">
              <Button $variant="secondary" disabled={updating} onClick={onDeny}>
                <Icons.X size="sm" />
                Afwijzen
              </Button>
              <Button disabled={updating} onClick={onApprove}>
                <Icons.Check size="sm" />
                Goedkeuren
              </Button>
            </FlexRow>
          </>
        )}
      </FlexColumn>
    </Modal>
  );
}
