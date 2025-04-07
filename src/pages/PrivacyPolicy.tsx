
import React from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Shortit. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. The Data We Collect</h2>
            <p className="mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Identity Data: includes first name, last name, username or similar identifier.</li>
              <li>Contact Data: includes email address and telephone numbers.</li>
              <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
              <li>Usage Data: includes information about how you use our website and services.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Data</h2>
            <p className="mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your service.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
            <p className="mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Legal Rights</h2>
            <p className="mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
              <br />
              <a href="mailto:privacy@shortit.com" className="text-brand-purple hover:underline">privacy@shortit.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
