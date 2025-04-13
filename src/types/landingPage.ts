
export interface LandingPage {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  slug: string;
  published: boolean;
  profile_image_url: string | null;
  theme_color: string;
  created_at: string;
  updated_at: string;
  views: number;
}

export interface LandingPageLink {
  id: string;
  landing_page_id: string;
  title: string;
  url: string;
  icon: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  clicks: number;
}

export interface CreateLandingPageData {
  title: string;
  description?: string | null;
  slug: string;
  published?: boolean;
  profile_image_url?: string | null;
  theme_color?: string;
  user_id: string;
}

export interface CreateLandingPageLinkData {
  landing_page_id: string;
  title: string;
  url: string;
  icon?: string | null;
  display_order: number;
}
