
export interface Member {
  id: string;
  email: string;
  full_name: string;
}

export interface NotificationFormData {
  title: string;
  message: string;
  recipient: string | null;
  isGlobal: boolean;
}
