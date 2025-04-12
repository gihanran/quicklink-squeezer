
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { LandingPageLink } from "@/types/landingPage";

interface LinksFormProps {
  links: LandingPageLink[];
  onAddLink: (link: { title: string, url: string }) => void;
  onDeleteLink: (id: string) => void;
  error: string | null;
}

const LinksForm: React.FC<LinksFormProps> = ({
  links,
  onAddLink,
  onDeleteLink,
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

  return (
    <div className="space-y-6">
      {links.length < 5 && (
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
          <div className="space-y-2">
            {links.map((link) => (
              <div 
                key={link.id} 
                className="flex items-center justify-between p-3 border rounded-md bg-background"
              >
                <div className="flex items-center">
                  <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-gray-500 truncate">{link.url}</p>
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
            ))}
          </div>
        )}
        {links.length >= 5 && (
          <p className="text-sm text-amber-600 mt-2">
            Maximum limit of 5 links reached.
          </p>
        )}
      </div>
    </div>
  );
};

export default LinksForm;
