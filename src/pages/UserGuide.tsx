
import React from 'react';
import Footer from '@/components/Footer';
import GuideSection from '@/components/guide/GuideSection';

const urlShortenerSteps = [
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
];

const bioCardSteps = [
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
];

const UserGuide = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">User Guide</h1>
        
        <GuideSection 
          title="How to Create Short URLs"
          steps={urlShortenerSteps}
          totalSteps={4}
        />
        
        <GuideSection 
          title="How to Create Bio Cards"
          steps={bioCardSteps}
          totalSteps={5}
        />
      </main>
      <Footer />
    </div>
  );
};

export default UserGuide;
