
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string | null;
  profileImageUrl: string | null;
  hasBackground?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  profileImageUrl,
  hasBackground = false
}) => {
  return (
    <div className="text-center">
      {profileImageUrl && (
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24 ring-4 ring-white">
            <AvatarImage src={profileImageUrl} alt={title} />
            <AvatarFallback>
              {title.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <h1 className={cn(
        "text-4xl font-bold",
        hasBackground ? "text-white" : "text-gray-900"
      )}>
        {title}
      </h1>
      {description && (
        <p className={cn(
          "mt-4 max-w-sm mx-auto",
          hasBackground ? "text-gray-200" : "text-gray-600"
        )}>
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;

