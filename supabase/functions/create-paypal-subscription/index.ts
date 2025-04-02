
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
      console.error('PayPal credentials not configured');
      throw new Error('PayPal credentials not configured');
    }

    console.log('Authenticating with PayPal...');
    
    // Get access token from PayPal
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
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
      throw new Error(`Failed to authenticate with PayPal: ${errorData}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    console.log('Successfully authenticated with PayPal');
    
    // Parse request body
    const { planId } = await req.json();
    const defaultPlanId = 'P-5ML4271244454362WXNWU5NQ'; // Default plan ID as fallback
    
    console.log(`Creating subscription with plan ID: ${planId || defaultPlanId}`);
    
    // Create a subscription
    const subscriptionData = {
      plan_id: planId || defaultPlanId,
      application_context: {
        return_url: `${req.headers.get('origin') || 'https://localhost:3000'}/dashboard?success=true`,
        cancel_url: `${req.headers.get('origin') || 'https://localhost:3000'}/dashboard?success=false`,
        brand_name: "QuickLink Squeezer",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW"
      }
    };

    // Use sandbox URL for testing, switch to api-m.paypal.com for production
    const subscriptionResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': crypto.randomUUID() // Prevent duplicate requests
      },
      body: JSON.stringify(subscriptionData)
    });

    const responseText = await subscriptionResponse.text();
    console.log('PayPal API response:', responseText);
    
    if (!subscriptionResponse.ok) {
      console.error('PayPal subscription error:', responseText);
      throw new Error(`Failed to create PayPal subscription: ${responseText}`);
    }

    let subscription;
    try {
      subscription = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing PayPal response:', e);
      throw new Error('Invalid response from PayPal');
    }
    
    console.log('Subscription created successfully');
    
    // Find the approval URL
    const approvalUrl = subscription.links?.find(link => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      console.error('No approval URL found in PayPal response');
      throw new Error('No approval URL found in PayPal response');
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        subscription: subscription,
        approvalUrl: approvalUrl
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
        error: error.message || 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
