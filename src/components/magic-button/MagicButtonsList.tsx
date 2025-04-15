
import React from 'react';
import { MagicButton } from "@/types/magicButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, ExternalLink, Pencil, Trash2, Copy, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MagicButtonsListProps {
  magicButtons: MagicButton[];
  loading: boolean;
  onEdit: (button: MagicButton) => void;
  onDelete: (button: MagicButton) => void;
  handleCreateNewButton: () => void;
}

const MagicButtonsList: React.FC<MagicButtonsListProps> = ({ 
  magicButtons, 
  loading,
  onEdit,
  onDelete,
  handleCreateNewButton
}) => {
  
  const getMagicButtonUrl = (buttonId: string) => {
    return `${window.location.origin}/magic/${buttonId}`;
  };
  
  const handleCopyLink = (buttonId: string) => {
    const url = getMagicButtonUrl(buttonId);
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
    });
  };
  
  const handleShare = async (button: MagicButton) => {
    const url = getMagicButtonUrl(button.id);
    const title = `Magic Button for ${new URL(button.original_url).hostname}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: button.description,
          url
        });
      } catch (err) {
        console.log('Error sharing:', err);
        handleCopyLink(button.id);
      }
    } else {
      handleCopyLink(button.id);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }
  
  if (magicButtons.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <Wand2 className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Magic Buttons Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Create your first Magic Button to display a custom button on any webpage and track clicks.
          </p>
          <Button 
            onClick={handleCreateNewButton}
            className="bg-gradient-to-r from-brand-purple to-brand-blue"
          >
            Create Your First Magic Button
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {magicButtons.map((button) => (
        <Card key={button.id} className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium truncate" title={button.original_url}>
                  {new URL(button.original_url).hostname}
                </h3>
                <a 
                  href={button.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 flex items-center hover:underline"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View original page
                </a>
              </div>
              <div className="flex space-x-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onEdit(button)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onDelete(button)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Description:</div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {button.description || "No description provided"}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium">Button:</div>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                    {button.button_title}
                  </span>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="text-sm text-gray-600 truncate max-w-[150px]" title={button.button_url}>
                    {new URL(button.button_url).hostname}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm flex items-center">
                  <span className="font-medium">{button.clicks}</span>
                  <span className="text-gray-500 ml-1">clicks</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopyLink(button.id)}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleShare(button)}
                    className="text-xs bg-gradient-to-r from-brand-purple to-brand-blue"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MagicButtonsList;
