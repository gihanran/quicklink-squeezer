
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useLinkOperations = () => {
  const [localLinks, setLocalLinks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddLink = async (link: any) => {
    toast({
      title: "Feature unavailable",
      description: "This feature is currently unavailable"
    });
  };

  const handleReorderLinks = async (reorderedLinks: any[]) => {
    toast({
      title: "Feature unavailable",
      description: "This feature is currently unavailable"
    });
  };

  return {
    localLinks,
    error,
    setError,
    handleAddLink,
    handleReorderLinks
  };
};
