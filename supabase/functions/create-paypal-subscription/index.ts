
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

    const authResponseText = await authResponse.text();
    console.log('PayPal auth response:', authResponseText);

    if (!authResponse.ok) {
      console.error('PayPal auth error status:', authResponse.status);
      console.error('PayPal auth error text:', authResponseText);
      throw new Error(`Failed to authenticate with PayPal: Status ${authResponse.status}`);
    }

    let authData;
    try {
      authData = JSON.parse(authResponseText);
    } catch (e) {
      console.error('Error parsing PayPal auth response:', e);
      throw new Error('Invalid auth response from PayPal');
    }

    const accessToken = authData.access_token;
    if (!accessToken) {
      console.error('No access token in PayPal response');
      throw new Error('No access token in PayPal response');
    }

    console.log('Successfully authenticated with PayPal');
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid request body');
    }
    
    const { planId } = requestBody || {};
    const defaultPlanId = 'P-5ML4271244454362WXNWU5NQ'; // Default plan ID as fallback
    
    console.log(`Creating subscription with plan ID: ${planId || defaultPlanId}`);
    
    const origin = req.headers.get('origin') || 'https://localhost:3000';
    console.log('Origin for return URLs:', origin);
    
    // Create a subscription
    const subscriptionData = {
      plan_id: planId || defaultPlanId,
      application_context: {
        return_url: `${origin}/dashboard?success=true`,
        cancel_url: `${origin}/dashboard?success=false`,
        brand_name: "QuickLink Squeezer",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW"
      }
    };

    const requestId = crypto.randomUUID();
    console.log('PayPal subscription request ID:', requestId);
    console.log('PayPal subscription request payload:', JSON.stringify(subscriptionData));

    // Use sandbox URL for testing, switch to api-m.paypal.com for production
    const subscriptionResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': requestId
      },
      body: JSON.stringify(subscriptionData)
    });

    const responseText = await subscriptionResponse.text();
    console.log('PayPal subscription API status code:', subscriptionResponse.status);
    console.log('PayPal API response:', responseText);
    
    if (!subscriptionResponse.ok) {
      console.error('PayPal subscription error:', responseText);
      throw new Error(`Failed to create PayPal subscription: Status ${subscriptionResponse.status}`);
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
        status: 200  // Return 200 status with error in response body instead of 500
      }
    );
  }
});
