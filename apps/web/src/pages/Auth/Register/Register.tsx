import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useDeviceBreakpoints();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleRegister = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setError('');
      setSuccess('');

      if (password !== confirmPassword) {
        setError('Passwords do not match');

        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters');

        return;
      }

      setLoading(true);

      try {
        await register(email, password);
        setSuccess('Registration successful! Check your email to verify your account.');
        // Redirect to login after 2 seconds with email prefilled
        setTimeout(() => {
          navigate('/login', { state: { email } });
        }, 2000);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
    [email, password, confirmPassword, navigate, register]
  );

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

              <Heading>Create your account</Heading>

              <Spacer size="xl" />

              <StyledForm onSubmit={handleRegister}>
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
                  placeholder="Min. 8 characters"
                  icon={<Icons.Lock size="sm" />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  icon={<Icons.Lock size="sm" />}
                  required
                />

                {success && <StyledMessage $type="success">{success}</StyledMessage>}
                {error && <StyledMessage $type="error">{error}</StyledMessage>}

                <Button type="submit" disabled={loading} $fullWidth>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </StyledForm>

              <FlexRow $ml="auto" $width="auto" $align="center" $gap="xs">
                {isMobile && <Spacer size="xs" />}
                <Paragraph $size="small">Already have an account?</Paragraph>
                <Button
                  $variant="ghost"
                  $size="small"
                  $whiteSpace="nowrap"
                  $weight={600}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </FlexRow>
            </FlexColumn>
          </StyledCard>
        </FlexColumn>
      </StyledAuthContainer>
    </EnforcedPageWidth>
  );
}
