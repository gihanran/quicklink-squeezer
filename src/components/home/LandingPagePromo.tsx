
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link2, LayoutGrid, BarChart2 } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

interface BioCardPromoProps {
  user: User | null;
}

const BioCardPromo: React.FC<BioCardPromoProps> = ({ user }) => {
  const [bioCardsCount, setBioCardsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBioCardsCount = async () => {
      try {
        const { count, error } = await supabase
          .from('landing_pages')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        setBioCardsCount(count || 0);
      } catch (error) {
        console.error('Error fetching bio cards count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBioCardsCount();
  }, []);

  return (
    <div className="mt-12 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
            Create Beautiful Bio Cards
          </h2>
          <p className="text-gray-700 mt-2">
            Design and publish customized bio cards to showcase all your important links in one place
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <span className="text-3xl font-bold text-brand-purple">{loading ? '...' : bioCardsCount}</span>
            <p className="text-sm text-gray-600">Bio Cards Created</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-md shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-brand-purple/10 rounded-full flex items-center justify-center mb-3">
            <LayoutGrid className="h-6 w-6 text-brand-purple" />
          </div>
          <h3 className="font-medium mb-2">Customized Design</h3>
          <p className="text-sm text-gray-600">Personalize your landing page with custom themes and profile images.</p>
        </div>
        
        <div className="bg-white p-5 rounded-md shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-3">
            <Link2 className="h-6 w-6 text-brand-blue" />
          </div>
          <h3 className="font-medium mb-2">Multiple Links</h3>
          <p className="text-sm text-gray-600">Add all your important links in one page and organize them easily.</p>
        </div>
        
        <div className="bg-white p-5 rounded-md shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 rounded-full flex items-center justify-center mb-3">
            <BarChart2 className="h-6 w-6 text-brand-purple" />
          </div>
          <h3 className="font-medium mb-2">Detailed Analytics</h3>
          <p className="text-sm text-gray-600">Track views and clicks to understand your audience better.</p>
        </div>
      </div>
      
      {user ? (
        <div className="mt-6 text-center">
          <Link 
            to="/dashboard" 
            className="px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90 inline-block"
          >
            Create Landing Page
          </Link>
        </div>
      ) : (
        <div className="mt-6 text-center">
          <Link 
            to="/auth" 
            className="px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90 inline-block"
          >
            Sign Up to Create Landing Pages
          </Link>
        </div>
      )}
    </div>
  );
};

export default BioCardPromo;
