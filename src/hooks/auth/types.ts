
export type AuthMode = 'signin' | 'signup' | 'reset';

export interface AuthFormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  whatsAppNumber: string;
  mode: AuthMode;
  loading: boolean;
  showPassword: boolean;
}
