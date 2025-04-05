
// Re-export all functions from the utility files
export * from './types';
export * from './codeGenerator';
export * from './linkLimits';
export * from './urlStore';
export * from './urlRetrieval';
export * from './urlTracking';
export * from './urlAnalytics';
export * from './urlManagement';

// Helper function to get the full shortened URL with domain
export const getFullShortenedUrl = (shortCode: string): string => {
  return `${window.location.origin}/s/${shortCode}`;
};
