
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
    country,
    setCountry,
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
    { email, password, firstName, lastName, whatsAppNumber, country, mode, loading, showPassword },
    setLoading,
    setMode
  );

  // Fix: Create a proper toggleShowPassword handler that uses the return value
  // from the useAuthActions hook's toggleShowPassword function
  const handleToggleShowPassword = () => {
    setShowPassword(toggleShowPassword());
  };

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
    country,
    setCountry,
    mode,
    loading,
    showPassword,
    toggleShowPassword: handleToggleShowPassword, // Use the new handler
    handleAuth,
    toggleMode,
    switchToResetMode
  };
};
