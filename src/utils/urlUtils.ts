
// Simple URL shortener without a database
// This uses localStorage to store URLs and generates a random code

// Generate a random short code
export const generateShortCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Interface for our URL data
export interface UrlData {
  originalUrl: string;
  shortCode: string;
  createdAt: number;
  visits: number;
  // Added expiresAt property (3 months after creation)
  expiresAt?: number;
}

// Store a URL in localStorage
export const storeUrl = (originalUrl: string): UrlData => {
  try {
    // Get existing URLs from localStorage
    const storedUrls = localStorage.getItem('shortenedUrls');
    const urls: Record<string, UrlData> = storedUrls ? JSON.parse(storedUrls) : {};
    
    // Check if URL already exists
    for (const key in urls) {
      if (urls[key].originalUrl === originalUrl) {
        return urls[key];
      }
    }
    
    // If not, create a new short URL
    const shortCode = generateShortCode();
    const now = Date.now();
    const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    
    const newUrlData: UrlData = {
      originalUrl,
      shortCode,
      createdAt: now,
      expiresAt: now + threeMonthsInMs, // Set expiration to 3 months from now
      visits: 0
    };
    
    // Save to localStorage
    urls[shortCode] = newUrlData;
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));
    
    return newUrlData;
  } catch (error) {
    console.error('Error storing URL:', error);
    throw new Error('Failed to shorten URL');
  }
};

// Get a URL by its short code
export const getUrlByShortCode = (shortCode: string): UrlData | null => {
  try {
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (!storedUrls) return null;
    
    const urls: Record<string, UrlData> = JSON.parse(storedUrls);
    
    // Get the URL data
    const urlData = urls[shortCode];
    if (!urlData) return null;
    
    // Check if the URL has expired
    if (urlData.expiresAt && urlData.expiresAt < Date.now()) {
      // URL has expired, remove it and return null
      delete urls[shortCode];
      localStorage.setItem('shortenedUrls', JSON.stringify(urls));
      return null;
    }
    
    return urlData;
  } catch (error) {
    console.error('Error retrieving URL:', error);
    return null;
  }
};

// Track a visit to a short URL
export const trackVisit = (shortCode: string): void => {
  try {
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (!storedUrls) return;
    
    const urls: Record<string, UrlData> = JSON.parse(storedUrls);
    if (urls[shortCode]) {
      urls[shortCode].visits++;
      localStorage.setItem('shortenedUrls', JSON.stringify(urls));
    }
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
};

// Get the complete shortened URL
export const getFullShortenedUrl = (shortCode: string): string => {
  return `${window.location.origin}/s/${shortCode}`;
};

// Get stats about total links and clicks
export const getUrlStats = (): { totalLinks: number, totalClicks: number } => {
  try {
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (!storedUrls) return { totalLinks: 0, totalClicks: 0 };
    
    const urls: Record<string, UrlData> = JSON.parse(storedUrls);
    const validUrls = Object.values(urls).filter(
      url => !url.expiresAt || url.expiresAt > Date.now()
    );
    
    const totalClicks = validUrls.reduce((sum, url) => sum + url.visits, 0);
    
    return {
      totalLinks: validUrls.length,
      totalClicks
    };
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return { totalLinks: 0, totalClicks: 0 };
  }
};
