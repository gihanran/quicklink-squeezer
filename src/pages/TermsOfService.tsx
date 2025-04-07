
import React from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import Footer from '@/components/Footer';

const TermsOfService: React.FC = () => {
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
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using the services of Shortit, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use the services.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
            <p className="mb-4">
              Shortit provides a URL shortening service that allows users to create shortened versions of web addresses. The specific features and functionality may change from time to time.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Conduct</h2>
            <p className="mb-4">
              You agree not to use the service for any unlawful purposes or to conduct any unlawful activity, including, but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fraud, phishing, or other deceptive practices</li>
              <li>Distribution of malware or other harmful code</li>
              <li>Violation of intellectual property rights</li>
              <li>Harassment or abuse of others</li>
              <li>Spamming or unauthorized advertising</li>
              <li>Any activity that could disable, overburden, or impair the functioning of the service</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Account Registration</h2>
            <p className="mb-4">
              Some features of the service may require you to register for an account. You agree to provide accurate information and to update it as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Intellectual Property</h2>
            <p className="mb-4">
              The service and its original content, features, and functionality are owned by Shortit and are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of the service without explicit permission.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="mb-4">
              Shortit shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Modifications to Terms</h2>
            <p className="mb-4">
              Shortit reserves the right to modify these Terms at any time. We will provide notice of significant changes. Your continued use of the service after such modifications constitutes your acceptance of the revised Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Termination</h2>
            <p className="mb-4">
              Shortit may terminate or suspend your access to the service immediately, without prior notice, for conduct that violates these Terms or for any other reason at our discretion.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:terms@shortit.com" className="text-brand-purple hover:underline">terms@shortit.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
