import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { StyledLayoutContainer } from '@components/styled/layout';

import { StyledAuthWrapper, StyledVideoBackground, StyledVideoOverlay } from './styles';

const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL ?? 'https://your-project.supabase.co'
).replace(/\/$/, '');
const VIDEO_URL = `${SUPABASE_URL}/storage/v1/object/public/public-assets/hero-video.mp4`;

export function AuthLayout() {
  const [videoError, setVideoError] = useState(false);

  if (videoError) {
    return (
      <StyledLayoutContainer>
        <Outlet />
      </StyledLayoutContainer>
    );
  }

  return (
    <StyledAuthWrapper>
      <StyledVideoBackground autoPlay loop muted playsInline onError={() => setVideoError(true)}>
        <source src={VIDEO_URL} type="video/mp4" />
      </StyledVideoBackground>
      <StyledVideoOverlay />
      <Outlet />
    </StyledAuthWrapper>
  );
}
