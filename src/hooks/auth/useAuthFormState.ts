
import { useState } from 'react';
import { AuthMode, AuthFormState } from './types';

export const useAuthFormState = (): AuthFormState & {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setWhatsAppNumber: (whatsAppNumber: string) => void;
  setCountry: (country: string) => void;
  setMode: (mode: AuthMode) => void;
  setLoading: (loading: boolean) => void;
  setShowPassword: (showPassword: boolean) => void;
} => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [country, setCountry] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setMode,
    loading,
    setLoading,
    showPassword,
    setShowPassword
  };
};
