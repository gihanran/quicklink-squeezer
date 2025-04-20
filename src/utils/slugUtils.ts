
/**
 * Generates a URL-friendly slug from a given title
 */
export const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Add slugify as an alias for consistency with imports
export const slugify = generateSlugFromTitle;
