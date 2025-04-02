
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error('PayPal credentials not configured');
    }

    // Get access token from PayPal
    const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.text();
      console.error('PayPal auth error:', errorData);
      throw new Error('Failed to authenticate with PayPal');
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    const { planId } = await req.json();
    
    // Create a subscription
    // Note: In a real-world app, you'd create a proper subscription plan in the PayPal dashboard
    // and use its ID here. For simplicity, we'll create a basic subscription.
    const subscriptionData = {
      plan_id: planId || 'P-5ML4271244454362WXNWU5NQ',
      application_context: {
        return_url: `${req.headers.get('origin')}/dashboard?success=true`,
        cancel_url: `${req.headers.get('origin')}/dashboard?success=false`
      }
    };

    const subscriptionResponse = await fetch('https://api-m.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(subscriptionData)
    });

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.text();
      console.error('PayPal subscription error:', errorData);
      throw new Error('Failed to create PayPal subscription');
    }

    const subscription = await subscriptionResponse.json();
    
    console.log('Subscription created:', subscription);
    
    return new Response(
      JSON.stringify({
        success: true,
        subscription: subscription,
        approvalUrl: subscription.links.find(link => link.rel === 'approve').href
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in PayPal function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
