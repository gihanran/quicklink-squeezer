
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { LandingPageLink } from "@/types/landingPage";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface LinksFormProps {
  links: LandingPageLink[];
  onAddLink: (link: { title: string, url: string }) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks?: (links: LandingPageLink[]) => void;
  error: string | null;
}

const LinksForm: React.FC<LinksFormProps> = ({
  links,
  onAddLink,
  onDeleteLink,
  onReorderLinks,
  error
}) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  const handleLinkTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 140) {
      setLinkTitle(value);
    }
  };
  
  const handleAddLinkClick = () => {
    if (!linkTitle || !linkUrl) return;
    
    onAddLink({
      title: linkTitle,
      url: linkUrl
    });
    
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination || !onReorderLinks) {
      return;
    }

    // Reorder the links
    const reorderedLinks = Array.from(links);
    const [movedItem] = reorderedLinks.splice(result.source.index, 1);
    reorderedLinks.splice(result.destination.index, 0, movedItem);
    
    // Update the display_order property
    const updatedLinks = reorderedLinks.map((link, index) => ({
      ...link,
      display_order: index
    }));
    
    onReorderLinks(updatedLinks);
  };

  // Updated to show maximum of 7 links
  const MAX_LINKS = 7;

  return (
    <div className="space-y-6">
      {links.length < MAX_LINKS && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <Label htmlFor="linkTitle">Link Title (Max 140 characters)</Label>
            <Input
              id="linkTitle"
              value={linkTitle}
              onChange={handleLinkTitleChange}
              placeholder="Instagram"
              maxLength={140}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {linkTitle.length}/140
            </p>
          </div>
          <div className="col-span-5">
            <Label htmlFor="linkUrl">URL</Label>
            <Input
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://instagram.com/username"
            />
          </div>
          <div className="col-span-2 flex items-end">
            <Button 
              onClick={handleAddLinkClick}
              disabled={!linkTitle || !linkUrl}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links.length === 0 ? (
          <div className="text-center py-4 border rounded-md bg-gray-50">
            <p className="text-gray-500">No links added yet.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="links-list">
              {(provided) => (
                <div 
                  className="space-y-2" 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                >
                  {links.map((link, index) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between p-3 border rounded-md ${
                            snapshot.isDragging ? 'bg-gray-100' : 'bg-background'
                          }`}
                        >
                          <div className="flex items-center">
                            <div 
                              {...provided.dragHandleProps} 
                              className="cursor-grab mr-2 text-gray-400 hover:text-gray-600 touch-none"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{link.title}</p>
                              <p className="text-sm text-gray-500 truncate">{link.url}</p>
                              {typeof link.clicks === 'number' && (
                                <p className="text-xs text-blue-500 mt-1">{link.clicks} clicks</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => onDeleteLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        {links.length >= MAX_LINKS && (
          <p className="text-sm text-amber-600 mt-2">
            Maximum limit of {MAX_LINKS} links reached.
          </p>
        )}
      </div>
    </div>
  );
};

export default LinksForm;
