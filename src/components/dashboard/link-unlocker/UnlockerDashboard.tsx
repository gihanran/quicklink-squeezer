
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreateUnlockerForm from "./CreateUnlockerForm";
import UnlockerList from "./UnlockerList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UnlockerDashboard = () => {
  const [unlockers, setUnlockers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const fetchUnlockers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('link_unlockers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching unlockers:', error);
        throw error;
      }

      setUnlockers(data || []);
    } catch (error) {
      console.error('Error fetching unlockers:', error);
      toast({
        title: "Error loading Link Unlockers",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnlockers();
  }, []);

  const handleDelete = (id: string) => {
    setUnlockers(unlockers.filter(u => u.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Link Unlockers</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>
      ) : (
        <UnlockerList unlockers={unlockers} onDelete={handleDelete} />
      )}

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Link Unlocker</DialogTitle>
          </DialogHeader>
          <CreateUnlockerForm
            onSuccess={() => {
              setShowCreateForm(false);
              fetchUnlockers();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnlockerDashboard;
