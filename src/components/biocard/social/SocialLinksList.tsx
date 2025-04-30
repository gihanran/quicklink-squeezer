
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLinkManager } from '@/hooks/biocard/useLinkManager';
import AddSocialLinkForm from './AddSocialLinkForm';
import SocialLinkItem from './SocialLinkItem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SocialLink, BaseLinkListProps } from '@/types/linkTypes';

interface SocialLinksListProps extends BaseLinkListProps<SocialLink> {
  getSocialIcon?: (platform: string) => React.ReactNode;
  bioCardId?: string; // Add this to know which bio card to update
}

const SocialLinksList: React.FC<SocialLinksListProps> = ({ 
  links, 
  setLinks, 
  maxLinks,
  getSocialIcon,
  bioCardId 
}) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const { toast } = useToast();
  
  // Function to persist ordered links to the database
  const persistLinkOrder = async (reorderedLinks: SocialLink[]) => {
    if (!bioCardId) return; // Don't try to persist if we don't have a bio card ID

    try {
      // First delete all existing social links for this bio card
      await (supabase as any)
        .from('bio_card_social_links')
        .delete()
        .eq('bio_card_id', bioCardId);
      
      // Then insert all links in their new order
      const linksToInsert = reorderedLinks.map((link, index) => ({
        bio_card_id: bioCardId,
        platform: link.platform,
        url: link.url,
        icon: link.icon,
        id: link.id, // Preserve the original ID
        // Add sort order explicitly if your schema supports it
        sort_order: index
      }));
      
      await (supabase as any)
        .from('bio_card_social_links')
        .insert(linksToInsert);
    } catch (error) {
      console.error('Error persisting link order:', error);
      throw error; // Re-throw to trigger error handling in useLinkManager
    }
  };

  const { addLink, removeLink, updateLink, reorderLinks } = useLinkManager(
    links, 
    setLinks, 
    maxLinks, 
    bioCardId ? persistLinkOrder : undefined
  );

  const handleAddLink = () => {
    if (!newPlatform || !newUrl) return;
    
    const iconMap: Record<string, string> = {
      'facebook': 'facebook',
      'instagram': 'instagram',
      'twitter': 'twitter',
      'linkedin': 'linkedin',
      'youtube': 'youtube',
      'discord': 'message-square',
    };
    
    addLink({ 
      platform: newPlatform, 
      url: newUrl, 
      icon: iconMap[newPlatform.toLowerCase()] || '',
      id: Date.now().toString()
    });
    
    setNewPlatform('');
    setNewUrl('');
  };
  
  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // Ensure source and destination are different
    if (result.source.index === result.destination.index) {
      return;
    }
    
    // Call the reorderLinks function from useLinkManager
    reorderLinks(result.source.index, result.destination.index);
  };
  
  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="socialLinks">
          {(provided) => (
            <div 
              className="border rounded-md p-4 space-y-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided) => (
                    <SocialLinkItem 
                      link={link}
                      index={index}
                      onUpdateLink={updateLink}
                      onRemoveLink={removeLink}
                      dragHandleProps={provided.dragHandleProps}
                      draggableProps={provided.draggableProps}
                      innerRef={provided.innerRef}
                      getSocialIcon={getSocialIcon}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {links.length === 0 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  No social links added yet
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {links.length < maxLinks && (
        <AddSocialLinkForm
          newPlatform={newPlatform}
          setNewPlatform={setNewPlatform}
          newUrl={newUrl}
          setNewUrl={setNewUrl}
          onAddLink={handleAddLink}
          disabled={links.length >= maxLinks}
        />
      )}
    </div>
  );
};

export default SocialLinksList;
