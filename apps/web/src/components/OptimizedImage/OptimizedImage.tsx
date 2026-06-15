import { useCallback, useState } from 'react';

import {
  StyledFallbackContainer,
  StyledImage,
  StyledImageContainer,
  StyledSkeletonOverlay,
} from './styles';

export interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  showSkeleton?: boolean;
  fallbackIcon?: React.ReactNode;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  width,
  height,
  borderRadius,
  objectFit = 'cover',
  showSkeleton = true,
  fallbackIcon,
  className,
}: OptimizedImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoaded(false);
    } else {
      setHasError(true);
    }
  }, [fallbackSrc, currentSrc]);

  if (!src && !fallbackSrc) {
    return (
      <StyledFallbackContainer $width={width} $height={height} className={className}>
        {fallbackIcon || <span>No image</span>}
      </StyledFallbackContainer>
    );
  }

  if (hasError) {
    return (
      <StyledFallbackContainer $width={width} $height={height} className={className}>
        {fallbackIcon || <span>Failed to load</span>}
      </StyledFallbackContainer>
    );
  }

  return (
    <StyledImageContainer
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      className={className}
    >
      <StyledImage
        src={currentSrc || undefined}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        $isLoaded={isLoaded}
        $objectFit={objectFit}
      />
      {showSkeleton && !isLoaded && <StyledSkeletonOverlay $borderRadius={borderRadius} />}
    </StyledImageContainer>
  );
}
