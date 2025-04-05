
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [profileCompletionRequired, setProfileCompletionRequired] = useState(true);
  const { toast } = useToast();

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Admin settings have been updated"
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Control system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">User Requirements</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profileCompletion">Require Profile Completion</Label>
                <p className="text-sm text-gray-500">
                  Users must complete their profile before creating links
                </p>
              </div>
              <Switch 
                id="profileCompletion" 
                checked={profileCompletionRequired}
                onCheckedChange={setProfileCompletionRequired}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={saveSettings} className="w-full">Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
