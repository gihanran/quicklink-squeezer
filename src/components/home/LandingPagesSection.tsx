
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from '@/hooks/auth';
import { ChartBar, Smartphone, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BioCardSection: React.FC = () => {
  const { user } = useAuthState();

  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Create Your Bio Card</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Showcase all your important links in one beautiful, customizable page. Connect your audience to all your content with a single link.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-12 w-12 rounded-lg flex items-center justify-center text-white mb-5">
            <Layout size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Custom Design</h3>
          <p className="text-gray-600">
            Personalize your bio card with custom colors, button styles, and profile images to match your brand.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-12 w-12 rounded-lg flex items-center justify-center text-white mb-5">
            <Smartphone size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Mobile Optimized</h3>
          <p className="text-gray-600">
            Bio cards look great on all devices. Perfect for sharing on social media profiles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-12 w-12 rounded-lg flex items-center justify-center text-white mb-5">
            <ChartBar size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Analytics</h3>
          <p className="text-gray-600">
            Track views and clicks on your bio card to understand which links perform best.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white font-medium py-3 px-8 rounded-lg transition-all"
        >
          <Link to={user ? "/biocard" : "/auth"}>
            {user ? "Create Your Bio Card" : "Sign Up to Create Bio Cards"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BioCardSection;
