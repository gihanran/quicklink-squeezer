
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ: React.FC = () => {
  return (
    <div className="w-full py-16 bg-white">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <HelpCircle className="h-6 w-6 text-brand-purple mr-2" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="mt-2 text-lg text-gray-600">
            Everything you need to know about our URL shortening service
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">What is a URL shortener?</AccordionTrigger>
            <AccordionContent>
              A URL shortener is a tool that creates a short, unique URL that will redirect to the specific website of your choosing. 
              Our service makes long links shorter, more manageable, and provides analytics on link performance.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">Are the shortened links permanent?</AccordionTrigger>
            <AccordionContent>
              By default, links expire after 3 months. However, registered users can create links that last longer.
              You'll always be able to see the expiration status on your dashboard.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">What analytics do you track?</AccordionTrigger>
            <AccordionContent>
              Our service tracks the number of clicks, geographic locations, devices, browsers, and other 
              important metrics to help you understand your audience better. All this data is available in your dashboard.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">What are landing pages?</AccordionTrigger>
            <AccordionContent>
              Landing pages allow you to create a customized page with multiple links organized in one place. 
              They're perfect for social media profiles, sharing multiple resources, or creating a simple online presence.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">Do I need to create an account?</AccordionTrigger>
            <AccordionContent>
              No, you can shorten URLs without creating an account. However, creating a free account gives you 
              benefits like link management, detailed analytics, customized short URLs, and the ability to create landing pages.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">Are there any usage limits?</AccordionTrigger>
            <AccordionContent>
              Free users can create unlimited links. All links include our robust analytics to help you track 
              performance and understand your audience better.
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
