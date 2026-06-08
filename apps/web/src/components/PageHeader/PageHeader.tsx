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
}

export function PageHeader({ title, subtitle, backHref, onBack }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    if (backHref) navigate(backHref);
  }, [onBack, backHref, navigate]);

  return (
    <FlexRow $align="center" $gap="md">
      {(onBack || backHref) && (
        <Button $variant="ghost" onClick={handleBack}>
          <Icons.ArrowLeft size="sm" color={theme.colors.text.secondary} />
        </Button>
      )}

      <FlexColumn $gap="xs">
        <Heading>{title}</Heading>
        {subtitle && (
          <Paragraph $variant="secondary" $size="small">
            {subtitle}
          </Paragraph>
        )}
      </FlexColumn>
    </FlexRow>
  );
}
