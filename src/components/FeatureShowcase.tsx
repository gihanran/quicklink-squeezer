
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Link2, Smartphone } from 'lucide-react';
import BioCardSection from './home/LandingPagesSection';
import { useAuthState } from '@/hooks/auth';
import { Button } from './ui/button';

const FeatureShowcase: React.FC = () => {
  const { user } = useAuthState();
  
  return (
    <div className="py-16 bg-white border-t border-gray-100">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need For Effective Link Management</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Shortit provides all the tools you need to create, manage, and track your links in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {/* Feature 1: Link Management */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-12 w-12 rounded-lg flex items-center justify-center text-white mb-5">
              <Link2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Link Management</h3>
            <p className="text-gray-600 mb-4">
              Create short, branded links that are easy to share and remember. Customize your links with descriptive titles.
            </p>
            <Link to="/auth" className="text-blue-600 hover:text-blue-800 inline-flex items-center group">
              Start creating links
              <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 2: Analytics */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 h-12 w-12 rounded-lg flex items-center justify-center text-white mb-5">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Link Analytics</h3>
            <p className="text-gray-600 mb-4">
              Track link performance with detailed analytics. Monitor clicks, referrers, and geographical data to optimize your campaigns.
            </p>
            <Link to="/auth" className="text-green-600 hover:text-green-800 inline-flex items-center group">
              Explore analytics
              <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 3: Mobile Friendly */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 h-12 w-12 rounded-lg flex items-center justify-center text-white mb-5">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Mobile Ready</h3>
            <p className="text-gray-600 mb-4">
              Fully responsive design ensures your links work perfectly on all devices. Create and manage links on the go.
            </p>
            <Link to="/auth" className="text-pink-600 hover:text-pink-800 inline-flex items-center group">
              Try on any device
              <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bio Card Section */}
        <BioCardSection />

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Ready to take control of your links?</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of users who use Shortit to create, track, and manage their links.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
          >
            <Link to={user ? "/dashboard" : "/auth"}>
              {user ? "Go to Dashboard" : "Get Started for Free"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
