
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GrowthCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          More detailed analytics coming soon...
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthCard;
