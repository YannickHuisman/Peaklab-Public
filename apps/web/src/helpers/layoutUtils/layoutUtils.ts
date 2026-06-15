import { css } from 'styled-components';

import { borderRadius, type BorderRadiusKey, spacing, type SpacingKey } from '@package/ui';

export interface LayoutProps {
  $gap?: SpacingKey;
  $margin?: SpacingKey;
  $padding?: SpacingKey;
  $mt?: SpacingKey;
  $mb?: SpacingKey;
  $ml?: SpacingKey;
  $mr?: SpacingKey;
  $pt?: SpacingKey;
  $pb?: SpacingKey;
  $pl?: SpacingKey;
  $pr?: SpacingKey;
  $align?: string;
  $justify?: string;
  $width?: string;
  $height?: string;
  $minWidth?: string;
  $maxWidth?: string;
  $minHeight?: string;
  $maxHeight?: string;
  $flex?: number;
  $flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  $flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  $flexShrink?: number;
  $whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
  $borderRadius?: BorderRadiusKey;
  $equalChildren?: boolean;
  $weight?: number;
  $cursor?: 'pointer' | 'default' | 'not-allowed' | 'text';
  $display?: 'flex' | 'block' | 'inline' | 'inline-block' | 'grid' | 'none';
  $overflow?: 'visible' | 'hidden' | 'auto' | 'scroll';
  $textOverflow?: 'ellipsis' | 'clip';
  $fontSize?: string;
  $opacity?: number;
}

export const layoutStyles = css<LayoutProps>`
  ${({ $gap }) => $gap && `gap: ${spacing[$gap]};`}
  ${({ $margin }) => $margin && `margin: ${spacing[$margin]};`}
  ${({ $padding }) => $padding && `padding: ${spacing[$padding]};`}
  ${({ $mt }) => $mt && `margin-top: ${spacing[$mt]};`}
  ${({ $mb }) => $mb && `margin-bottom: ${spacing[$mb]};`}
  ${({ $ml }) => $ml && `margin-left: ${spacing[$ml]};`}
  ${({ $mr }) => $mr && `margin-right: ${spacing[$mr]};`}
  ${({ $pt }) => $pt && `padding-top: ${spacing[$pt]};`}
  ${({ $pb }) => $pb && `padding-bottom: ${spacing[$pb]};`}
  ${({ $pl }) => $pl && `padding-left: ${spacing[$pl]};`}
  ${({ $pr }) => $pr && `padding-right: ${spacing[$pr]};`}
  ${({ $align }) => $align && `align-items: ${$align};`}
  ${({ $justify }) => $justify && `justify-content: ${$justify};`}
  ${({ $width }) => $width && `width: ${typeof $width === 'number' ? `${$width}px` : $width};`}
  ${({ $height }) =>
    $height && `height: ${typeof $height === 'number' ? `${$height}px` : $height};`}
  ${({ $minWidth }) => $minWidth && `min-width: ${$minWidth};`}
  ${({ $maxWidth }) => $maxWidth && `max-width: ${$maxWidth};`}
  ${({ $minHeight }) => $minHeight && `min-height: ${$minHeight};`}
  ${({ $maxHeight }) => $maxHeight && `max-height: ${$maxHeight};`}
  ${({ $flex }) => $flex !== undefined && `flex: ${$flex};`}
  ${({ $flexDirection }) => $flexDirection && `flex-direction: ${$flexDirection};`}
  ${({ $flexWrap }) => $flexWrap && `flex-wrap: ${$flexWrap};`}
  ${({ $flexShrink }) => $flexShrink !== undefined && `flex-shrink: ${$flexShrink};`}
  ${({ $whiteSpace }) => $whiteSpace && `white-space: ${$whiteSpace};`}
  ${({ $borderRadius }) => $borderRadius && `border-radius: ${borderRadius[$borderRadius]};`}
  ${({ $equalChildren }) => $equalChildren && `& > * { flex: 1; }`}
  ${({ $weight }) => $weight && `font-weight: ${$weight};`}
  ${({ $cursor }) => $cursor && `cursor: ${$cursor};`}
  ${({ $display }) => $display && `display: ${$display};`}
  ${({ $overflow }) => $overflow && `overflow: ${$overflow};`}
  ${({ $textOverflow }) => $textOverflow && `text-overflow: ${$textOverflow};`}
  ${({ $fontSize }) => $fontSize && `font-size: ${$fontSize};`}
  ${({ $opacity }) => $opacity !== undefined && `opacity: ${$opacity};`}
`;
