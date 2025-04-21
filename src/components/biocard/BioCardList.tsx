
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash, Link as LinkIcon, ExternalLink, MousePointerClick, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { BioCard } from '@/types/bioCardTypes';

interface BioCardListProps {
  bioCards: BioCard[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const BioCardList: React.FC<BioCardListProps> = ({ 
  bioCards, 
  loading,
  onDelete
}) => {
  const { toast } = useToast();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/b/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ description: "Link copied to clipboard!" });
  };

  const togglePublishStatus = async (card: BioCard) => {
    try {
      const { error } = await supabase
        .from('bio_cards')
        .update({ published: !card.published })
        .eq('id', card.id);
      
      if (error) throw error;
      
      toast({ 
        description: card.published ? 
          "Bio card unpublished successfully" : 
          "Bio card published successfully" 
      });
      
      // This would usually trigger a refetch, but we're letting the parent handle that
      // through its state management
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({ 
        variant: 'destructive',
        description: "Failed to update publish status" 
      });
    }
  };

  const toggleExpandCard = (cardId: string) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

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
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {card.published ? 'Published' : 'Draft'}
                  </span>
                  <Switch 
                    checked={card.published || false}
                    onCheckedChange={() => togglePublishStatus(card)}
                  />
                </div>
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

              {/* Links Summary */}
              {card.links && card.links.length > 0 && (
                <div className="mt-2 space-y-1 border-t pt-2">
                  <div className="text-sm font-medium mb-1">Link Performance:</div>
                  {card.links.map((link) => (
                    <div key={link.id} className="text-sm text-gray-600 flex items-center justify-between">
                      <span className="truncate flex-1">{link.title}</span>
                      <span className="ml-2 flex items-center">
                        <MousePointerClick className="h-3 w-3 mr-1" />
                        {link.clicks || 0}
                      </span>
                    </div>
                  ))}
                  
                  <div className="mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => toggleExpandCard(card.id)}
                    >
                      {expandedCardId === card.id ? "Hide Analytics" : "Show Analytics"}
                    </Button>
                    
                    {expandedCardId === card.id && card.links && card.links.length > 0 && (
                      <div className="mt-3 border rounded-md p-3 bg-white">
                        <h4 className="text-sm font-medium mb-2">Click Analytics</h4>
                        <div className="h-64">
                          <ChartContainer
                            config={{
                              views: { color: "#8B5CF6" },
                              clicks: { color: "#F97316" }
                            }}
                          >
                            <BarChart
                              data={card.links.map(link => ({
                                name: link.title,
                                clicks: link.clicks || 0
                              }))}
                              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                              <YAxis tick={{ fontSize: 10 }} />
                              <ChartTooltip 
                                content={<ChartTooltipContent />} 
                              />
                              <Bar dataKey="clicks" fill="var(--color-clicks, #F97316)" name="Clicks" />
                            </BarChart>
                          </ChartContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(card.slug)}
                >
                  <Share2 className="h-4 w-4 mr-1" /> Share
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
