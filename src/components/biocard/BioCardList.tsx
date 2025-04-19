
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BioCardListProps {
  bioCards: any[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const BioCardList: React.FC<BioCardListProps> = ({ 
  bioCards, 
  loading,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (bioCards.length === 0) {
    return (
      <Card className="my-12">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <LinkIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-medium mb-2">No Bio Cards Yet</h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Create your first bio card to showcase your important links in one place
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xl font-bold">Your Bio Cards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bioCards.map((card) => (
          <Card key={card.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 relative">
              <div 
                className="absolute inset-0 opacity-10 -z-10" 
                style={{ backgroundColor: card.bg_color || '#f1f5f9' }}
              />
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <div className="text-sm text-gray-500">
                Created {formatDistanceToNow(new Date(card.created_at), { addSuffix: true })}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-2 text-sm mb-4">
                <div className="flex items-center text-gray-600">
                  <Eye className="h-4 w-4 mr-1" />
                  {card.views || 0} views
                </div>
                <div className="flex items-center text-gray-600">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  {card.clicks || 0} clicks
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/biocard/edit/${card.slug}`}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(card.id)}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/b/${card.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" /> View
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BioCardList;
