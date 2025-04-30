
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { BaseLink } from '@/types/linkTypes';

export const useLinkManager = <T extends BaseLink>(
  links: T[],
  setLinks: (links: T[]) => void,
  maxLinks: number,
  onReorder?: (reorderedLinks: T[]) => Promise<void>
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
  
  const reorderLinks = async (startIndex: number, endIndex: number) => {
    // Create a new array from the current links
    const result = Array.from(links);
    
    // Remove the item from the start position
    const [removed] = result.splice(startIndex, 1);
    
    // Insert the item at the end position
    result.splice(endIndex, 0, removed);
    
    // Update the state with the new order
    setLinks(result);
    
    // If there's a callback for persisting the reorder, call it
    if (onReorder) {
      try {
        await onReorder(result);
        toast({
          title: "Link reordered",
          description: "The link order has been updated and saved",
        });
      } catch (error) {
        toast({
          title: "Error saving order",
          description: "There was a problem saving the new order",
          variant: "destructive"
        });
        // Revert the order if save fails
        setLinks(links);
      }
    } else {
      toast({
        title: "Link reordered",
        description: "The link order has been updated",
      });
    }
  };

  return {
    addLink,
    removeLink,
    updateLink,
    reorderLinks
  };
};
