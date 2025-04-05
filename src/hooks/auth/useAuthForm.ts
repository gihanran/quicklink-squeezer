
import { useAuthFormState } from './useAuthFormState';
import { useAuthActions } from './useAuthActions';
export type { AuthMode } from './types';

export const useAuthForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    whatsAppNumber,
    setWhatsAppNumber,
    mode,
    setMode,
    loading,
    setLoading,
    showPassword,
    setShowPassword
  } = useAuthFormState();

  const {
    toggleShowPassword,
    toggleMode,
    switchToResetMode,
    handleAuth
  } = useAuthActions(
    { email, password, firstName, lastName, whatsAppNumber, mode, loading, showPassword },
    setLoading,
    setMode
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    whatsAppNumber,
    setWhatsAppNumber,
    mode,
    loading,
    showPassword,
    toggleShowPassword,
    handleAuth,
    toggleMode,
    switchToResetMode
  };
};
