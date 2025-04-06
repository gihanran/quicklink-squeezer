
// Generate a random short code for a URL
export const generateShortCode = (length: number = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
};

// Generate a short user ID (12 characters)
export const generateShortUserId = (): string => {
  return generateShortCode(12);
};
