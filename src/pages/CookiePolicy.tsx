
import React from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import Footer from '@/components/Footer';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              <Link to="/">Shortit</Link>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Essential cookies: These are necessary for the website to function properly.</li>
              <li>Functionality cookies: These remember your preferences and settings.</li>
              <li>Performance cookies: These help us understand how visitors interact with our website.</li>
              <li>Targeting cookies: These are used to deliver advertising relevant to you and your interests.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Types of Cookies We Use</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">3.1 First-Party Cookies</h3>
            <p className="mb-4">
              These are cookies that are set by our website directly.
            </p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">3.2 Third-Party Cookies</h3>
            <p className="mb-4">
              These are cookies set by third parties that we work with. They may include analytics providers, advertising networks, and social media platforms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Managing Cookies</h2>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can usually find these settings in the "options" or "preferences" menu of your browser. You can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Delete all cookies</li>
              <li>Block all cookies</li>
              <li>Allow all cookies</li>
              <li>Block third-party cookies</li>
              <li>Clear cookies when you close the browser</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Impact of Disabling Cookies</h2>
            <p className="mb-4">
              If you disable cookies, some features of our website may not work correctly, such as remembering your preferences or keeping you logged in.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Updates to This Policy</h2>
            <p className="mb-4">
              We may update our Cookie Policy from time to time. Any changes will be posted on this page with a revised "last updated" date.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our use of cookies, please contact us at:
              <br />
              <a href="mailto:cookies@shortit.com" className="text-brand-purple hover:underline">cookies@shortit.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
