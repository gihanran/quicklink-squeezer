
export interface MagicButton {
  id: string;
  user_id: string;
  original_url: string;
  description?: string | null;
  button_title: string;
  button_url: string;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMagicButtonData {
  original_url: string;
  description?: string | null;
  button_title: string;
  button_url: string;
  user_id: string;
}
