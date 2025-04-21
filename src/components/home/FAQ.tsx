
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
            Get quick answers to common questions about our URL shortening service
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">Is Shortit completely free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, Shortit is completely free to use for basic URL shortening. Create unlimited short links with basic 
              analytics and tracking. For advanced features like custom domains and enhanced analytics, check out our 
              premium plans.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">How long do shortened links remain active?</AccordionTrigger>
            <AccordionContent>
              All shortened links remain active indefinitely for registered users. For unregistered users, links expire 
              after 30 days of inactivity. To ensure your links never expire, we recommend creating a free account.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">Can I customize my shortened URLs?</AccordionTrigger>
            <AccordionContent>
              Yes! Registered users can create custom branded links with their own keywords instead of random characters. 
              This helps make your links more memorable and professional-looking. Premium users can also use their own 
              custom domains.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">What analytics do you provide?</AccordionTrigger>
            <AccordionContent>
              Our free analytics include click tracking, geographic location, referrer sources, and device types. 
              Premium users get access to advanced analytics including real-time tracking, detailed visitor insights, 
              and custom reporting options.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">Are shortened links secure?</AccordionTrigger>
            <AccordionContent>
              Yes, we take security seriously. All links are scanned for malware and phishing. We use HTTPS encryption 
              for all shortened URLs. Additionally, you can set password protection for sensitive links with a premium account.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">Can I manage multiple links at once?</AccordionTrigger>
            <AccordionContent>
              Yes, registered users get access to a dashboard where they can manage all their links in one place. 
              You can organize links into groups, track performance, enable/disable links, and update destinations 
              as needed.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
