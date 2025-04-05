
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Globe, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinksListProps {
  links: any[];
  loading: boolean;
  calculateExpiration: (createdAt: number, expiresAt?: number) => { percentage: number, daysLeft: number };
  handleCreateNewLink: () => void;
  handleDeleteLink: (link: any) => void;
  handleRenameLink: (link: any) => void;
}

const LinksList: React.FC<LinksListProps> = ({ 
  links, 
  loading, 
  calculateExpiration, 
  handleCreateNewLink,
  handleDeleteLink,
  handleRenameLink
}) => {
  const { toast } = useToast();
  
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
      {links.map(link => {
        const { percentage, daysLeft } = calculateExpiration(link.createdAt, link.expiresAt);
        
        return (
          <Card key={link.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 truncate max-w-md">
                      {link.originalUrl}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-brand-purple font-medium mr-2">
                        {window.location.origin}/s/{link.shortCode}
                      </span>
                      <button 
                        className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 mr-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/s/${link.shortCode}`);
                          toast({ description: "Link copied to clipboard" });
                        }}
                      >
                        Copy
                      </button>
                      <button
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        onClick={() => handleRenameLink(link)}
                      >
                        Rename
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0">
                    <span className="text-lg font-medium mr-3">{link.visits} clicks</span>
                    <Button variant="secondary" size="sm" className="mr-2">
                      View Details
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteLink(link)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                {link.expiresAt && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Link expiration</span>
                      <span>{daysLeft} days left</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-brand-purple mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Devices</p>
                      <p className="text-sm">
                        {link.devices ? (
                          `Desktop: ${link.devices.desktop || 0}, Mobile: ${link.devices.mobile || 0}`
                        ) : "No data yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-brand-blue mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Top Locations</p>
                      <p className="text-sm truncate">
                        {link.locations ? (
                          Object.entries(link.locations)
                            .slice(0, 2)
                            .map(([country, count]) => `${country}: ${count}`)
                            .join(', ')
                        ) : "No data yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LinksList;
