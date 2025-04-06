
import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { useAuthState } from '@/hooks/auth';

const Footer: React.FC = () => {
  const { user } = useAuthState();
  
  return (
    <footer className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and description */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                <a href="/">QuickLink</a>
              </h2>
            </div>
            <p className="text-gray-300 text-sm">
              Simple, fast, and reliable URL shortening service for all your linking needs.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition duration-200">
                  Home
                </Link>
              </li>
              {user ? (
                <li>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition duration-200">
                    Dashboard
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/auth" className="text-gray-300 hover:text-white transition duration-200">
                    Sign In
                  </Link>
                </li>
              )}
              <li>
                <Link to="/affiliate" className="text-gray-300 hover:text-white transition duration-200">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white transition duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-300 hover:text-white transition duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white transition duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white transition duration-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Github" className="text-gray-300 hover:text-white transition duration-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-white transition duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:info@quicklinksqueezer.com" aria-label="Email" className="text-gray-300 hover:text-white transition duration-200">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} QuickLink Squeezer. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0 flex items-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for shorter links
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
