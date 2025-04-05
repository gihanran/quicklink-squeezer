
export const calculateExpiration = (createdAt: number, expiresAt?: number) => {
  if (!expiresAt) return { percentage: 0, daysLeft: 0 };
  
  const totalDuration = expiresAt - createdAt;
  const elapsed = Date.now() - createdAt;
  const percentage = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
  const daysLeft = Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
  
  return { percentage, daysLeft };
};
