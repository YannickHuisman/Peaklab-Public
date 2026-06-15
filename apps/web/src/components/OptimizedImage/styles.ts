import styled, { keyframes } from 'styled-components';

import { theme } from '@package/ui';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const StyledSkeleton = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '100%'};
  border-radius: ${({ $borderRadius }) => $borderRadius || theme.borderRadius.md};
  background-color: ${theme.colors.neutral[200]};
  background-image: linear-gradient(
    90deg,
    ${theme.colors.neutral[200]} 0px,
    ${theme.colors.neutral[100]} 40px,
    ${theme.colors.neutral[200]} 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const StyledImageContainer = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}>`
  position: relative;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || 'auto'};
  overflow: hidden;
  border-radius: ${({ $borderRadius }) => $borderRadius || theme.borderRadius.md};
  background-color: ${theme.colors.neutral[200]};
`;

export const StyledImage = styled.img<{ $isLoaded: boolean; $objectFit?: string }>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: ${({ $objectFit }) => $objectFit || 'cover'};
  transition: opacity 0.3s ease;
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
`;

export const StyledFallbackContainer = styled.div<{ $width?: string; $height?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '100%'};
  background-color: ${theme.colors.neutral[300]};
  color: ${theme.colors.text.secondary};
`;

export const StyledSkeletonOverlay = styled(StyledSkeleton)`
  position: absolute;
  top: 0;
  left: 0;
`;
