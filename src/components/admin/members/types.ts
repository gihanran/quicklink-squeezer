
export interface Member {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  link_limit: number;
  created_at: string;
  whatsapp_number: string | null;
  country: string | null;
  has_completed_profile: boolean;
}

export interface MemberStats {
  id: string;
  linkCount: number;
  clickCount: number;
  linksThisMonth: number;
}
