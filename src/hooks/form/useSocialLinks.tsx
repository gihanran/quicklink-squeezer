
import { useState, useEffect } from 'react';
import { SocialMediaLink } from "@/types/landingPage";

export const useSocialLinks = (initialSocialLinks: SocialMediaLink[] = []) => {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(initialSocialLinks);

  useEffect(() => {
    setSocialLinks(initialSocialLinks);
  }, [initialSocialLinks]);

  return {
    socialLinks,
    setSocialLinks
  };
};
