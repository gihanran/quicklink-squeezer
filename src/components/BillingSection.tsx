
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BillingSection = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>Manage your subscription</CardDescription>
          </div>
          <Badge className="bg-green-600">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Premium Plan</h3>
            <Badge variant="outline" className="border-brand-purple text-brand-purple">
              Current
            </Badge>
          </div>
          <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>Unlimited shortened links</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>Advanced analytics</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>Custom domains</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>Priority support</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="font-medium">Next billing date: May 15, 2023</p>
            <p className="text-sm text-gray-500">You will be charged $9.99</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="w-1/2">Cancel Plan</Button>
        <Button className="w-1/2 ml-2">Upgrade Plan</Button>
      </CardFooter>
    </Card>
  );
};

export default BillingSection;
