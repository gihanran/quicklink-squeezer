
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SecurityCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>Manage your password and security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" disabled>
          Change Password
        </Button>
      </CardFooter>
    </Card>
  );
};
