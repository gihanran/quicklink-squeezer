
export interface BioCard {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description?: string;
  profile_image_url?: string;
  background_image_url?: string;
  bg_color?: string;
  button_color?: string;
  button_style?: string;
  views?: number;
  clicks?: number;
  created_at?: string;
  updated_at?: string;
  links?: BioCardLink[];
  social_links?: BioCardSocialLink[];
  published?: boolean;
}

export interface BioCardLink {
  id: string;
  bio_card_id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  clicks?: number;
  created_at?: string;
}

export interface BioCardSocialLink {
  id: string;
  bio_card_id: string;
  platform: string;
  url: string;
  icon?: string;
  created_at?: string;
}

export interface ProfileWithBioCardLimit {
  id: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  has_completed_profile?: boolean;
  country?: string;
  whatsapp_number?: string;
  is_active?: boolean;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
  link_limit?: number;
  bio_card_limit?: number;
}
