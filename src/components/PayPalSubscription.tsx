
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
        description: "Preparing your payment...",
      });
      
      console.log('Invoking create-paypal-subscription function');
      
      const { data, error } = await supabase.functions.invoke('create-paypal-subscription', {
        body: { planId },
      });

      console.log('Function response data:', data);
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Error invoking payment service: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response from payment service');
      }

      console.log('Payment response:', data);

      if (data.success && data.approvalUrl) {
        // Redirect to PayPal approval URL
        toast({
          title: "Redirecting to PayPal",
          description: "You'll be redirected to complete your payment.",
        });
        
        // Small delay to show the toast before redirecting
        setTimeout(() => {
          window.location.href = data.approvalUrl;
        }, 2000);
      } else if (data.error) {
        // Handle error from the function that was returned with 200 status
        throw new Error(data.error);
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "There was a problem processing your payment. Please try again.",
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
