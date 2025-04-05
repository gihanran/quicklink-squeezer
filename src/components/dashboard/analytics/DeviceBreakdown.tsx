
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Laptop, Tablet } from "lucide-react";

interface DeviceBreakdownProps {
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
    [key: string]: number; // Allow additional device types while requiring the main ones
  };
}

const DeviceBreakdown: React.FC<DeviceBreakdownProps> = ({ devices }) => {
  const totalDevices = Object.values(devices).reduce((a, b) => a + b, 0) || 1;
  
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Device Breakdown</CardTitle>
        <CardDescription>Detailed statistics by device type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 border rounded-lg bg-purple-50">
            <Laptop className="h-10 w-10 text-brand-purple mb-2" />
            <h3 className="text-xl font-bold text-brand-purple">Desktop</h3>
            <p className="text-2xl font-bold mt-2">{devices.desktop || 0}</p>
            <p className="text-sm text-gray-500">
              {Math.round(((devices.desktop || 0) / totalDevices) * 100)}% of total
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg bg-pink-50">
            <Smartphone className="h-10 w-10 text-pink-500 mb-2" />
            <h3 className="text-xl font-bold text-pink-500">Mobile</h3>
            <p className="text-2xl font-bold mt-2">{devices.mobile || 0}</p>
            <p className="text-sm text-gray-500">
              {Math.round(((devices.mobile || 0) / totalDevices) * 100)}% of total
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg bg-orange-50">
            <Tablet className="h-10 w-10 text-orange-500 mb-2" />
            <h3 className="text-xl font-bold text-orange-500">Tablet</h3>
            <p className="text-2xl font-bold mt-2">{devices.tablet || 0}</p>
            <p className="text-sm text-gray-500">
              {Math.round(((devices.tablet || 0) / totalDevices) * 100)}% of total
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceBreakdown;
