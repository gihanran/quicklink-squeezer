
// Generate a random short code
export const generateShortCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Get the complete shortened URL
export const getFullShortenedUrl = (shortCode: string): string => {
  return `${window.location.origin}/s/${shortCode}`;
};
