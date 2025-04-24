
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

const UserGuide = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">User Guide</h1>
        
        {/* URL Shortener Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">How to Create Short URLs</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Enter Your Long URL",
                description: "Paste your long URL into the input field on the homepage."
              },
              {
                step: 2,
                title: "Customize Your Link (Optional)",
                description: "Add a custom alias or leave it blank for an auto-generated short code."
              },
              {
                step: 3,
                title: "Create Short Link",
                description: "Click the 'Shorten URL' button to generate your shortened link."
              },
              {
                step: 4,
                title: "Copy and Share",
                description: "Copy your new short URL and share it anywhere you want!"
              }
            ].map((item) => (
              <Card key={item.step} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-brand-purple to-brand-blue w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Bio Cards Guide */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">How to Create Bio Cards</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Go to Bio Cards Dashboard",
                description: "Navigate to the Bio Cards section from your dashboard."
              },
              {
                step: 2,
                title: "Create New Bio Card",
                description: "Click the 'Create New Bio Card' button to start."
              },
              {
                step: 3,
                title: "Add Your Information",
                description: "Fill in your profile details, add links, and customize the appearance."
              },
              {
                step: 4,
                title: "Add Social Links",
                description: "Add your social media links to connect with your audience."
              },
              {
                step: 5,
                title: "Save and Share",
                description: "Save your bio card and share your unique bio link with others!"
              }
            ].map((item) => (
              <Card key={item.step} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-brand-purple to-brand-blue w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {item.title}
                      {item.step < 5 && <ArrowRight className="inline-block ml-2 h-4 w-4" />}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserGuide;
