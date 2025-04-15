
import React from 'react';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Globe, Trash2, ExternalLink, Eye, BarChart2 } from "lucide-react";
import { LandingPage } from "@/types/landingPage";
import { Badge } from "@/components/ui/badge";

interface BioCardListProps {
  pages: LandingPage[];
  loading: boolean;
  onCreateNew: () => void;
  onEdit: (page: LandingPage) => void;
  onPreview: (page: LandingPage) => void;
  onDelete: (page: LandingPage) => void;
  onShowTrackingDetails: (page: LandingPage) => void;
}

const BioCardList: React.FC<BioCardListProps> = ({
  pages,
  loading,
  onCreateNew,
  onEdit,
  onPreview,
  onDelete,
  onShowTrackingDetails
}) => {
  const MAX_LANDING_PAGES = 25;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Bio Cards</h2>
          <p className="text-sm text-gray-500">
            {pages.length} of {MAX_LANDING_PAGES} cards used
          </p>
        </div>
        <Button 
          onClick={onCreateNew}
          disabled={pages.length >= MAX_LANDING_PAGES}
          className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Bio Card
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Globe className="h-12 w-12 mx-auto text-gray-400" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No bio cards yet</h3>
                <p className="text-sm text-gray-500">
                  Create your first bio card to share multiple links at once.
                </p>
                <Button
                  onClick={onCreateNew}
                  variant="outline"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bio Card
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card key={page.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{page.title}</CardTitle>
                    {page.description && (
                      <CardDescription className="mt-1 line-clamp-2">
                        {page.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant={page.published ? "default" : "outline"}>
                    {page.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    /{page.slug}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onShowTrackingDetails(page)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Show tracking details"
                    >
                      <BarChart2 className="h-4 w-4" />
                      <span className="sr-only">Tracking</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onPreview(page)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Preview</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(page)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => onDelete(page)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                {page.published && (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-500 mt-2" 
                    onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Live Card
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pages.length >= MAX_LANDING_PAGES && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mt-4">
          <p className="text-yellow-800 text-sm">
            You have reached the maximum limit of {MAX_LANDING_PAGES} bio cards. 
            To create a new bio card, please delete an existing one.
          </p>
        </div>
      )}
    </div>
  );
};

export default BioCardList;
