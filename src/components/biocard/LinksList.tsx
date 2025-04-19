
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash, Link } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface LinksListProps {
  links: any[];
  setLinks: (links: any[]) => void;
  maxLinks: number;
}

const LinksList: React.FC<LinksListProps> = ({ links, setLinks, maxLinks }) => {
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  });

  const addLink = () => {
    if (links.length >= maxLinks) {
      return;
    }
    
    if (!newLink.title || !newLink.url) {
      return;
    }
    
    setLinks([...links, { ...newLink, id: Date.now() }]);
    setNewLink({ title: '', url: '', description: '' });
  };

  const removeLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 140) {
      setNewLink({ ...newLink, description: text });
    }
  };

  const updateLinkDescription = (id: number, description: string) => {
    if (description.length <= 140) {
      setLinks(
        links.map(link => 
          link.id === id ? { ...link, description } : link
        )
      );
    }
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
            onChange={handleDescriptionChange}
            className="mt-1"
            rows={2}
          />
        </div>
        
        <Button
          type="button"
          onClick={addLink}
          disabled={!newLink.title || !newLink.url || links.length >= maxLinks}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>
      
      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={link.id} className="flex items-start gap-2 border rounded-md p-3 bg-gray-50">
              <div className="mt-1">
                <Link className="h-4 w-4 text-gray-500" />
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
                  onChange={(e) => updateLinkDescription(link.id, e.target.value)}
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
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
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
