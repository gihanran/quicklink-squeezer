import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Globe, Users, ChartBar, Infinity, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getUrlStats } from '@/utils/urlUtils';
import { Skeleton } from "@/components/ui/skeleton";
import PayPalSubscription from './PayPalSubscription';

const FeatureShowcase: React.FC = () => {
  const [stats, setStats] = useState({
    linksCreated: 0,
    totalClicks: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { totalLinks, totalClicks } = await getUrlStats();
        setStats({
          linksCreated: totalLinks,
          totalClicks,
        });
      } catch (error) {
        console.error('Error fetching URL stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
            Powerful Features For Everyone
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Create short links, track clicks, and analyze your audience - all in one place
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-brand-purple" />}
            title="Link Expiration"
            description="Links expire after 3 months with visual progress tracking"
          >
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>2 months left</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </FeatureCard>
          
          <FeatureCard
            icon={<ChartBar className="h-6 w-6 text-brand-blue" />}
            title="Click Analytics"
            description="Track clicks, geography, devices, and more"
          />
          
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-brand-purple" />}
            title="Secure Links"
            description="All links are secure and protected from spam"
          />
          
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-brand-blue" />}
            title="Geographic Data"
            description="See where your clicks are coming from around the world"
          />
          
          <FeatureCard
            icon={<Users className="h-6 w-6 text-brand-purple" />}
            title="Social Login"
            description="Easy registration with Google and other social media accounts"
          />
          
          <FeatureCard
            icon={<Infinity className="h-6 w-6 text-brand-blue" />}
            title="Unlimited Links"
            description="Premium members can create unlimited short links"
          />
        </div>
        
        {/* Stats Section */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-md text-center flex-1">
            <h3 className="text-lg font-medium text-gray-700">Total Links Created</h3>
            {loading ? (
              <Skeleton className="h-10 w-20 mx-auto mt-2" />
            ) : (
              <p className="text-4xl font-bold text-brand-purple mt-2">{stats.linksCreated.toLocaleString()}</p>
            )}
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center flex-1">
            <h3 className="text-lg font-medium text-gray-700">Total Link Clicks</h3>
            {loading ? (
              <Skeleton className="h-10 w-20 mx-auto mt-2" />
            ) : (
              <p className="text-4xl font-bold text-brand-blue mt-2">{stats.totalClicks.toLocaleString()}</p>
            )}
          </div>
        </div>
        
        {/* Subscription Card */}
        <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-1 rounded-xl">
          <Card className="rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Premium Subscription</h3>
                  <ul className="space-y-3">
                    <FeatureItem>Unlimited link creation</FeatureItem>
                    <FeatureItem>Advanced analytics dashboard</FeatureItem>
                    <FeatureItem>Geographic click tracking</FeatureItem>
                    <FeatureItem>Device & OS statistics</FeatureItem>
                    <FeatureItem>Priority support</FeatureItem>
                  </ul>
                  <div className="mt-6">
                    <span className="text-3xl font-bold">$2.99</span>
                    <span className="text-gray-500 ml-1">/ month</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-8 flex flex-col justify-center items-center">
                  <h4 className="text-xl font-semibold mb-4">Ready to get started?</h4>
                  <p className="text-gray-600 mb-6 text-center">
                    Sign up for our premium plan and unlock all features
                  </p>
                  <PayPalSubscription 
                    className="px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90 transition-all"
                  />
                  <p className="mt-4 text-sm text-gray-500">
                    Secure payment with PayPal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper component for feature cards
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}> = ({ icon, title, description, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-2">{description}</p>
      {children}
    </div>
  );
};

// Helper component for feature list items
const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <li className="flex items-start">
      <CheckCircle className="h-5 w-5 text-brand-purple mr-2 shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
};

export default FeatureShowcase;
