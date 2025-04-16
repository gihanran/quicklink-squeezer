
import { useState } from 'react';

export const usePublishState = (initialPublished: boolean = false) => {
  const [published, setPublished] = useState(initialPublished);

  return {
    published,
    setPublished
  };
};
