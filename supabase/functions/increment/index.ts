
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { row_id, table_name, column_name } = await req.json();
    
    if (!row_id || !table_name || !column_name) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Sanitized table and column names to prevent SQL injection
    const safeTables = ["url_unlockers"];
    const safeColumns = ["clicks", "unlocks"];
    
    if (!safeTables.includes(table_name) || !safeColumns.includes(column_name)) {
      return new Response(
        JSON.stringify({ error: "Invalid table or column" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Update the counter
    const { data, error } = await supabaseClient
      .from(table_name)
      .select(column_name)
      .eq("id", row_id)
      .single();
    
    if (error) {
      throw error;
    }
    
    const currentValue = data[column_name] || 0;
    const newValue = currentValue + 1;
    
    const { error: updateError } = await supabaseClient
      .from(table_name)
      .update({ [column_name]: newValue })
      .eq("id", row_id);
      
    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, [column_name]: newValue }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
