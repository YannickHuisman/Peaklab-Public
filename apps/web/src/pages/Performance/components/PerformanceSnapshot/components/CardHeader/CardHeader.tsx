import { memo } from 'react';

import { Button } from '@components/Button/Button';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';

import { StyledDot } from '../../styles';

interface CardHeaderProps {
  title: string;
  accentColor?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const CardHeader = memo(function CardHeader({
  title,
  accentColor,
  onEdit,
  showEditButton,
}: CardHeaderProps) {
  return (
    <FlexRow $align="center" $justify="space-between">
      <FlexRow $align="center" $gap="sm" $width="auto">
        {accentColor && <StyledDot $color={accentColor} />}
        <Paragraph $size="small" $weight={700}>
          {title}
        </Paragraph>
      </FlexRow>
      {showEditButton && (
        <Button $variant="ghost" onClick={onEdit}>
          <Icons.Settings size="sm" />
        </Button>
      )}
    </FlexRow>
  );
});
