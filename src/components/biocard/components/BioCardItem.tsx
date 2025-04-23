
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, MousePointerClick, ChartBar } from 'lucide-react';
import type { BioCard } from '@/types/bioCardTypes';
import BioCardAnalytics from './BioCardAnalytics';
import BioCardActions from './BioCardActions';
import BioCardLinksSummary from './BioCardLinksSummary';

interface BioCardItemProps {
  card: BioCard;
  onDelete: (id: string) => void;
  onShare: (slug: string) => void;
}

const BioCardItem: React.FC<BioCardItemProps> = ({ 
  card, 
  onDelete,
  onShare
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 relative">
        <div 
          className="absolute inset-0 opacity-10 -z-10" 
          style={{ backgroundColor: card.bg_color || '#f1f5f9' }}
        />
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{card.title}</CardTitle>
        </div>
        <div className="text-sm text-gray-500">
          Created {formatDistanceToNow(new Date(card.created_at || ''), { addSuffix: true })}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 text-sm mb-4">
          <div className="flex items-center text-gray-600">
            <Eye className="h-4 w-4 mr-1" />
            {card.views || 0} views
          </div>
          <div className="flex items-center text-gray-600">
            <MousePointerClick className="h-4 w-4 mr-1" />
            {card.clicks || 0} clicks
          </div>
        </div>

        <BioCardLinksSummary links={card.links || []} />
        
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className={`
              w-full 
              text-xs 
              ${isExpanded 
                ? 'bg-brand-purple text-white hover:bg-brand-purple/90' 
                : 'hover:bg-brand-purple/10 hover:text-brand-purple'}
              flex items-center justify-center gap-2 
              transition-all duration-300 ease-in-out
              animate-pulse-slow
            `}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChartBar className="h-4 w-4" />
            {isExpanded ? "Hide Analytics" : "Show Analytics"}
          </Button>
          
          {isExpanded && card.links && card.links.length > 0 && (
            <BioCardAnalytics links={card.links} />
          )}
        </div>
        
        <BioCardActions
          slug={card.slug}
          id={card.id}
          onDelete={onDelete}
          onShare={onShare}
        />
      </CardContent>
    </Card>
  );
};

export default BioCardItem;
