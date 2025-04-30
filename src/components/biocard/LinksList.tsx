
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, MoveVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { BaseLink } from './base/BaseLink';
import { useLinkManager } from '@/hooks/biocard/useLinkManager';
import type { CustomLink, BaseLinkListProps } from '@/types/linkTypes';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface LinksListProps extends BaseLinkListProps<CustomLink> {}

const LinksList: React.FC<LinksListProps> = ({ links, setLinks, maxLinks }) => {
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  });

  const { addLink, removeLink, updateLink, reorderLinks } = useLinkManager(links, setLinks, maxLinks);

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) return;
    
    addLink({
      ...newLink,
      id: Date.now().toString()
    });

    setNewLink({ title: '', url: '', description: '' });
  };

  const handleDescriptionChange = (text: string) => {
    if (text.length <= 140) {
      setNewLink({ ...newLink, description: text });
    }
  };

  const handleLinkDescriptionChange = (id: string, description: string) => {
    if (description.length <= 140) {
      updateLink(id, { description });
    }
  };
  
  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // Reorder the links array
    reorderLinks(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 space-y-4">
        <div>
          <Label htmlFor="linkTitle">Link Title</Label>
          <Input
            id="linkTitle"
            placeholder="Link Title"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="linkUrl">URL</Label>
          <Input
            id="linkUrl"
            placeholder="https://example.com"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="linkDescription">
            Description <span className="text-xs text-gray-500">({newLink.description.length}/140)</span>
          </Label>
          <Textarea
            id="linkDescription"
            placeholder="Brief description (optional)"
            value={newLink.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>
        
        <Button
          type="button"
          onClick={handleAddLink}
          disabled={!newLink.title || !newLink.url || links.length >= maxLinks}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>
      
      {links.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div 
                className="space-y-3"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-start gap-2 border rounded-md p-3 bg-gray-50"
                      >
                        <div 
                          className="mt-1 cursor-move flex items-center justify-center p-1 hover:bg-gray-200 rounded"
                          {...provided.dragHandleProps}
                        >
                          <MoveVertical className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{link.title}</div>
                          <div className="text-xs text-gray-500 truncate">{link.url}</div>
                          {link.description && (
                            <div className="text-sm mt-1 text-gray-600">{link.description}</div>
                          )}
                          <Textarea
                            placeholder="Edit description (optional)"
                            value={link.description || ''}
                            onChange={(e) => handleLinkDescriptionChange(link.id, e.target.value)}
                            className="mt-2 text-xs"
                            rows={2}
                          />
                          <div className="text-xs text-gray-400 mt-1">
                            {link.description ? link.description.length : 0}/140
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(link.id)}
                          className="text-destructive hover:text-destructive"
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
      ) : (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-gray-500">No links added yet</p>
        </div>
      )}
      
      {links.length >= maxLinks && (
        <p className="text-amber-600 text-sm">
          Maximum number of links reached ({maxLinks})
        </p>
      )}
    </div>
  );
};

export default LinksList;
