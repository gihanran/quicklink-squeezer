
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { BaseLink } from '@/types/linkTypes';

export const useLinkManager = <T extends BaseLink>(
  links: T[],
  setLinks: (links: T[]) => void,
  maxLinks: number
) => {
  const { toast } = useToast();

  const addLink = (newLink: T) => {
    if (links.length >= maxLinks) {
      toast({
        title: "Maximum links reached",
        description: `You can only add up to ${maxLinks} links`,
        variant: "destructive"
      });
      return;
    }
    setLinks([...links, { ...newLink, id: Date.now().toString() }]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const updateLink = (id: string, updatedLink: Partial<T>) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, ...updatedLink } : link
    ));
  };
  
  const reorderLinks = (startIndex: number, endIndex: number) => {
    const result = Array.from(links);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setLinks(result);
  };

  return {
    addLink,
    removeLink,
    updateLink,
    reorderLinks
  };
};
