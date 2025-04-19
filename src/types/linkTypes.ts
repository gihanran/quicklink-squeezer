
export interface BaseLink {
  id: string;
  url: string;
}

export interface CustomLink extends BaseLink {
  title: string;
  description?: string;
}

export interface SocialLink extends BaseLink {
  platform: string;
  icon?: string;
}

export interface BaseLinkListProps<T> {
  links: T[];
  setLinks: (links: T[]) => void;
  maxLinks: number;
}
