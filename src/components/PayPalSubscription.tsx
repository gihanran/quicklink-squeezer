
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PayPalSubscriptionProps {
  planId?: string;
  buttonText?: string;
  className?: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ 
  planId, 
  buttonText = "Subscribe Now", 
  className 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-subscription', {
        body: { planId },
      });

      if (error) {
        throw error;
      }

      if (data.success && data.approvalUrl) {
        // Redirect to PayPal approval URL
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "There was a problem starting your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
};

export default PayPalSubscription;
