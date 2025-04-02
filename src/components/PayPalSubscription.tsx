
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
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    
    try {
      toast({
        description: "Preparing your subscription...",
      });
      
      console.log('Invoking create-paypal-subscription function with planId:', planId);
      
      const { data, error } = await supabase.functions.invoke('create-paypal-subscription', {
        body: { planId },
      });

      console.log('Function response data:', data);
      console.log('Function response error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Error invoking subscription service: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response from subscription service');
      }

      console.log('Subscription response:', data);

      if (data.success && data.approvalUrl) {
        // Redirect to PayPal approval URL
        toast({
          title: "Redirecting to PayPal",
          description: "You'll be redirected to complete your subscription.",
        });
        
        // Small delay to show the toast before redirecting
        setTimeout(() => {
          window.location.href = data.approvalUrl;
        }, 2000);
      } else if (data.error) {
        // Handle error from the function that was returned with 200 status
        throw new Error(data.error);
      } else {
        throw new Error('Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "There was a problem starting your subscription. Please try again.",
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
