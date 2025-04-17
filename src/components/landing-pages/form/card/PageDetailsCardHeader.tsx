
import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const PageDetailsCardHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Page Details</CardTitle>
      <CardDescription>
        Configure how your landing page will appear to visitors.
      </CardDescription>
    </CardHeader>
  );
};

export default PageDetailsCardHeader;
