
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LinkCard from "./LinkCard";

interface LinksListProps {
  links: any[];
  loading: boolean;
  calculateExpiration: (createdAt: number, expiresAt?: number) => { percentage: number, daysLeft: number };
  handleCreateNewLink: () => void;
  handleDeleteLink: (link: any) => void;
  handleEditTitle: (link: any) => void;
}

const LinksList: React.FC<LinksListProps> = ({ 
  links, 
  loading, 
  calculateExpiration, 
  handleCreateNewLink,
  handleDeleteLink,
  handleEditTitle
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }
  
  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't created any links yet.</p>
          <Button onClick={handleCreateNewLink}>Create Your First Link</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {links.map(link => (
        <LinkCard
          key={link.id}
          link={link}
          calculateExpiration={calculateExpiration}
          handleDeleteLink={handleDeleteLink}
          handleEditTitle={handleEditTitle}
        />
      ))}
    </div>
  );
};

export default LinksList;
