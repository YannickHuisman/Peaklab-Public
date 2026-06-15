import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';

import { theme } from '@package/ui';

interface PageHeaderProps {
  title: string;
  subtitle?: string | null;
  backHref?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backHref, onBack, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    if (backHref) navigate(backHref);
  }, [onBack, backHref, navigate]);

  return (
    <FlexRow $align="flex-end" $gap="md" $justify="space-between" $stackOnMobile={!!actions}>
      <FlexRow $align="center" $gap="md" style={{ flex: 1 }} $minWidth="0">
        {(onBack || backHref) && (
          <Button $variant="ghost" onClick={handleBack} aria-label="Terug">
            <Icons.ArrowLeft size="sm" color={theme.colors.text.secondary} aria-hidden="true" />
          </Button>
        )}

        <FlexColumn $gap="xs" $minWidth="0">
          <Heading>{title}</Heading>
          {subtitle && (
            <Paragraph $variant="secondary" $size="small">
              {subtitle}
            </Paragraph>
          )}
        </FlexColumn>
      </FlexRow>
      {actions && (
        <FlexRow $gap="sm" $flexWrap="wrap" $width="auto">
          {actions}
        </FlexRow>
      )}
    </FlexRow>
  );
}
