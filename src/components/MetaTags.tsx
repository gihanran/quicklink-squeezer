
import React, { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  type?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  imageUrl,
  url,
  type = 'website'
}) => {
  useEffect(() => {
    // Save the original title to restore later
    const originalTitle = document.title;
    
    // Update document title
    if (title) {
      document.title = title;
    }
    
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.includes('og:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }
    
    if (title) {
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }
    
    if (imageUrl) {
      updateMetaTag('og:image', imageUrl);
      updateMetaTag('twitter:image', imageUrl);
    }
    
    if (url) {
      updateMetaTag('og:url', url);
    }
    
    updateMetaTag('og:type', type);
    updateMetaTag('twitter:card', 'summary_large_image');
    
    // Cleanup function
    return () => {
      document.title = originalTitle;
    };
  }, [title, description, imageUrl, url, type]);
  
  return null; // This component doesn't render anything
};

export default MetaTags;
