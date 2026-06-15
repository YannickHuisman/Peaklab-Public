import { type FormEvent, useCallback } from 'react';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Icons } from '@components/Icons';

import { StyledForm, StyledMessage } from '../../../styles';

interface CredentialsStepProps {
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  success?: string;
  loading?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onNext: () => void;
  setError: (value: string) => void;
}

export function CredentialsStep({
  email,
  password,
  confirmPassword,
  error,
  success,
  loading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onNext,
  setError,
}: CredentialsStepProps) {
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setError('');

      if (password !== confirmPassword) {
        setError('Passwords do not match');

        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters');

        return;
      }

      onNext();
    },
    [password, confirmPassword, onNext, setError]
  );

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="you@example.com"
        icon={<Icons.Mail size="sm" />}
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="Min. 8 characters"
        icon={<Icons.Lock size="sm" />}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        placeholder="Re-enter password"
        icon={<Icons.Lock size="sm" />}
        required
      />

      {error && <StyledMessage $type="error">{error}</StyledMessage>}
      {success && <StyledMessage $type="success">{success}</StyledMessage>}

      <Button type="submit" $fullWidth disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </StyledForm>
  );
}
