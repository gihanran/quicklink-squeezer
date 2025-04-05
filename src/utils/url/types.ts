
import { User } from '@supabase/supabase-js';

// Interface for our URL data
export interface UrlData {
  id?: string;
  originalUrl: string;
  shortCode: string;
  createdAt: number;
  expiresAt?: number;
  visits: number;
  userId?: string | null;
  title?: string;
}

export interface UrlStats {
  totalLinks: number;
  totalClicks: number;
  remainingLinks?: number;
  linkLimit?: number;
}
