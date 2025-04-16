
import { useState } from 'react';

export const useUIState = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    saving,
    error,
    setSaving,
    setError
  };
};
