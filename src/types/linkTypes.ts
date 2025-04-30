
export interface BaseLink {
  id: string;
  [key: string]: any;
}

export interface SocialLink extends BaseLink {
  platform: string;
  url: string;
  icon?: string;
  clicks?: number;
}

export interface CustomLink extends BaseLink {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  clicks?: number;
}

export interface BaseLinkListProps<T extends BaseLink> {
  links: T[];
  setLinks: (links: T[]) => void;
  maxLinks: number;
  bioCardId?: string; // Add this to support persisting link orders
}
