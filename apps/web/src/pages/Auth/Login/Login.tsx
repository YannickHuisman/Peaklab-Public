import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@components/Button';
import { Divider } from '@components/Divider';
import { Input } from '@components/form/Input';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { EnforcedPageWidth, FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { useAuth } from '@package/api';

import {
  StyledAuthContainer,
  StyledAuthLogo,
  StyledForm,
  StyledGoogleIcon,
  StyledMessage,
} from '../styles';

export function Login() {
  const location = useLocation();
  const prefilledEmail = (location.state as { email?: string })?.email || '';

  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useDeviceBreakpoints();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setError('');
      setLoading(true);

      try {
        await signIn(email, password);
        navigate('/');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Login failed');
      } finally {
        setLoading(false);
      }
    },
    [email, password, navigate, signIn]
  );

  const handleGoogleSignIn = useCallback(() => {
    // TODO: Implement Google OAuth
  }, []);

  return (
    <EnforcedPageWidth>
      <StyledAuthContainer>
        <FlexColumn $gap="md" $maxWidth="500px" $flex={1}>
          <StyledCard $fullWidth>
            <FlexColumn
              $align="center"
              $padding={isMobile ? 'xs' : 'xl'}
              $gap={isMobile ? 'xs' : 'sm'}
            >
              <StyledAuthLogo>
                <img src="/icoon-logo-zwart-transparant.svg" alt="PeakLab" />
              </StyledAuthLogo>

              <Heading>Welcome to PeakLab</Heading>
              <Paragraph $weight={300} $size="small">
                Sign in to continue
              </Paragraph>

              <Spacer size="xl" />

              <Button $variant="secondary" $fullWidth onClick={handleGoogleSignIn}>
                <StyledGoogleIcon viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  />
                </StyledGoogleIcon>
                Continue with Google
              </Button>

              <Spacer size="md" />
              <Divider>or</Divider>
              <Spacer size="md" />

              <StyledForm onSubmit={handleLogin}>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  icon={<Icons.Mail size="sm" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Icons.Lock size="sm" />}
                  required
                />

                {error && <StyledMessage $type="error">{error}</StyledMessage>}

                <Button type="submit" $fullWidth disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </StyledForm>

              <FlexRow $justify="space-between" $align="center" $gap="sm" $flexWrap="wrap">
                {isMobile && <Spacer size="xs" />}
                <Button
                  $variant="ghost"
                  $size="small"
                  $whiteSpace="nowrap"
                  $weight={600}
                  onClick={() => {
                    // TODO: Implement forgot password
                  }}
                >
                  Forgot password?
                </Button>
                <FlexRow $align="center" $width="auto" $gap="xs">
                  <Paragraph $size="small" $whiteSpace="nowrap">
                    Need an account?
                  </Paragraph>
                  <Button
                    $variant="ghost"
                    $size="small"
                    $whiteSpace="nowrap"
                    $weight={600}
                    onClick={() => navigate('/register')}
                  >
                    Sign up
                  </Button>
                </FlexRow>
              </FlexRow>
            </FlexColumn>
          </StyledCard>
        </FlexColumn>
      </StyledAuthContainer>
    </EnforcedPageWidth>
  );
}
