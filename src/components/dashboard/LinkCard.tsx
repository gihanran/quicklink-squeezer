
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LinkCardHeader from "./card/LinkCardHeader";
import LinkCardExpiration from "./card/LinkCardExpiration";
import LinkCardMetrics from "./card/LinkCardMetrics";
import LinkCardSharingOptions from "./card/LinkCardSharingOptions";

interface LinkCardProps {
  link: any;
  calculateExpiration: (createdAt: number, expiresAt?: number) => { percentage: number, daysLeft: number };
  handleDeleteLink: (link: any) => void;
  handleEditTitle: (link: any) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ 
  link, 
  calculateExpiration,
  handleDeleteLink,
  handleEditTitle
}) => {
  const { toast } = useToast();
  const { percentage, daysLeft } = calculateExpiration(link.createdAt, link.expiresAt);
  
  const fullUrl = `${window.location.origin}/s/${link.shortCode}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    toast({ description: "Link copied to clipboard" });
  };
  
  // Add handleDeleteLink to the link object for access in child components
  const enhancedLink = {
    ...link,
    handleDeleteLink
  };
  
  return (
    <Card key={link.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <LinkCardHeader 
            link={enhancedLink}
            handleEditTitle={handleEditTitle}
            handleCopy={handleCopy}
            fullUrl={fullUrl}
          />
          
          <LinkCardExpiration 
            link={link}
            percentage={percentage}
            daysLeft={daysLeft}
          />
          
          <LinkCardMetrics link={link} />
          
          <LinkCardSharingOptions 
            fullUrl={fullUrl}
            link={link}
            handleCopy={handleCopy}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
