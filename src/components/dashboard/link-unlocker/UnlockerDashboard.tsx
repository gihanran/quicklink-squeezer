
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreateUnlockerForm from "./CreateUnlockerForm";
import UnlockerList from "./UnlockerList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const UnlockerDashboard = () => {
  const [unlockers, setUnlockers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const fetchUnlockers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('link_unlockers')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Error fetching unlockers:', supabaseError);
        setError('Unable to load Link Unlockers. Please try again later.');
        return;
      }

      setUnlockers(data || []);
    } catch (err) {
      console.error('Error fetching unlockers:', err);
      setError('Unable to load Link Unlockers. Please try again later.');
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

  const handleRetry = () => {
    fetchUnlockers();
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>{error}</span>
            <Button onClick={handleRetry} variant="outline" size="sm" className="w-fit">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading && !error ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>
      ) : !error ? (
        <UnlockerList unlockers={unlockers} onDelete={handleDelete} />
      ) : null}

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Link Unlocker</DialogTitle>
            <DialogDescription>
              Create a link that requires users to complete actions before accessing your destination link.
            </DialogDescription>
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
