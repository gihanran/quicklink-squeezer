
export interface LandingPage {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
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
}

export interface CreateLandingPageData {
  title: string;
  description?: string | null;
  slug: string;
  published?: boolean;
  user_id: string;
}

export interface CreateLandingPageLinkData {
  landing_page_id: string;
  title: string;
  url: string;
  icon?: string | null;
  display_order: number;
}
