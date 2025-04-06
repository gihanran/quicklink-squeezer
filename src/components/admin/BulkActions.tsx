
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BulkActions = () => {
  const [linkLimit, setLinkLimit] = useState<number>(100);
  const [processing, setProcessing] = useState(false);
  const [preservedUserId, setPreservedUserId] = useState<string>("cf29b4c7-7a38-4bdf-8cf2-f5df5bfd6314");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const updateAllUsersLinkLimit = async () => {
    try {
      setProcessing(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ link_limit: linkLimit })
        .not('is_admin', 'is', true);  // Don't change admin limits
      
      if (error) throw error;
      
      toast({
        title: "Link limits updated",
        description: `All users' link limits have been set to ${linkLimit}`
      });
    } catch (error) {
      console.error('Error updating link limits:', error);
      toast({
        title: "Error updating link limits",
        description: "Could not update users' link limits",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const removeAllUsersExcept = async () => {
    try {
      setProcessing(true);
      
      // Delete all users except the specified one
      const { error } = await supabase
        .from('profiles')
        .delete()
        .neq('id', preservedUserId);

      if (error) throw error;
      
      // Also delete all short_urls for those users
      const { error: urlError } = await supabase
        .from('short_urls')
        .delete()
        .neq('user_id', preservedUserId);

      if (urlError) throw urlError;
      
      toast({
        title: "Users removed",
        description: `All users except ID ${preservedUserId.slice(0,8)}... have been removed`,
      });
      
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error removing users:', error);
      toast({
        title: "Error removing users",
        description: "Could not remove users from the database",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bulk Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Update All Users' Link Limits</CardTitle>
            <CardDescription>
              Set the same link generation limit for all regular users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkLimit">Link Limit</Label>
              <Input
                id="linkLimit"
                type="number"
                value={linkLimit}
                onChange={(e) => setLinkLimit(parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
            <Button 
              onClick={updateAllUsersLinkLimit} 
              disabled={processing}
              className="w-full"
            >
              {processing ? 'Processing...' : 'Update All Users'}
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        {/* New card for removing all users except the specified one */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle size={20} />
              Remove All Users
            </CardTitle>
            <CardDescription>
              Remove all users except the specified one (DANGER: This action cannot be undone)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showDeleteConfirm ? (
              <>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning: Destructive Action</AlertTitle>
                  <AlertDescription>
                    This will permanently remove all users except the one with ID: {preservedUserId}. 
                    All links belonging to removed users will also be deleted.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-4 mt-4">
                  <Button 
                    variant="destructive" 
                    onClick={removeAllUsersExcept} 
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? 'Processing...' : 'Confirm Deletion'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={processing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="preservedUserId">Preserve Only User ID</Label>
                  <Input
                    id="preservedUserId"
                    value={preservedUserId}
                    onChange={(e) => setPreservedUserId(e.target.value)}
                    readOnly={true}
                    className="font-mono"
                  />
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="w-full"
                >
                  Remove All Other Users
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkActions;
