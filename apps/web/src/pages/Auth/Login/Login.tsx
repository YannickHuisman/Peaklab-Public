import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { EnforcedPageWidth, FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { useAuth } from '@package/api';

import { StyledAuthContainer, StyledAuthLogo, StyledForm, StyledMessage } from '../styles';

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

  return (
    <EnforcedPageWidth>
      <StyledAuthContainer>
        <FlexColumn $gap="md" $maxWidth="500px" $flex={1}>
          <StyledCard $fullWidth>
            <FlexColumn $align="center" $padding={isMobile ? 'xs' : 'md'} $gap="sm">
              <StyledAuthLogo>
                <img src="/icoon-logo-zwart-transparant.svg" alt="PeakLab" />
              </StyledAuthLogo>

              <Heading>Welcome to PeakLab</Heading>
              <Paragraph $weight={300} $size="small">
                Sign in to continue
              </Paragraph>

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
