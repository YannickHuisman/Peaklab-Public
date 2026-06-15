import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { EnforcedPageWidth, FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { useAuth } from '@package/api';

import { StyledAuthContainer, StyledAuthLogo } from '../styles';
import { CredentialsStep } from './components';

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

  const handleRegister = useCallback(async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(email, password);

      setSuccess('Registration successful! Check your email to verify your account.');
      setTimeout(() => {
        navigate('/login', { state: { email } });
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate, register]);

  return (
    <EnforcedPageWidth>
      <StyledAuthContainer>
        <FlexColumn $gap="md" $maxWidth="500px" $flex={1}>
          <StyledCard $fullWidth>
            <FlexColumn $align="center" $padding={isMobile ? 'xs' : 'md'} $gap="sm">
              <StyledAuthLogo>
                <img src="/icoon-logo-zwart-transparant.svg" alt="PeakLab" />
              </StyledAuthLogo>

              <Heading $align="center">Welcome to PeakLab</Heading>
              <Paragraph $align="center" $weight={300} $size="small">
                Create your account to start exploring your health data and gain personalized
                insights.
              </Paragraph>

              <Spacer size="md" />

              <CredentialsStep
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                error={error}
                success={success}
                loading={loading}
                setError={setError}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onNext={handleRegister}
              />

              <FlexRow $ml="auto" $width="auto" $align="center" $gap="xs">
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
