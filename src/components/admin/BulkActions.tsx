
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Link2 } from "lucide-react";

const BulkActions = () => {
  const [linkLimit, setLinkLimit] = useState<number>(10);
  const [processing, setProcessing] = useState(false);
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
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkActions;
