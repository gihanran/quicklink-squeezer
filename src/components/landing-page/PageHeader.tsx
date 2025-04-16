
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PageHeaderProps {
  title: string;
  description?: string | null;
  profileImageUrl: string | null;
  themeColor: string;
  hasBackgroundImage: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  profileImageUrl, 
  themeColor,
  hasBackgroundImage
}) => {
  return (
    <div className="text-center">
      {profileImageUrl && (
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24 ring-4 ring-white">
            <AvatarImage src={profileImageUrl} alt={title} />
            <AvatarFallback style={{ backgroundColor: themeColor, color: 'white' }}>
              {title.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <h1 
        className={`text-4xl font-bold ${hasBackgroundImage ? 'text-white' : 'bg-clip-text text-transparent'}`}
        style={!hasBackgroundImage ? { 
          backgroundImage: `linear-gradient(to right, ${themeColor}, ${themeColor}CC)` 
        } : {}}
      >
        {title}
      </h1>
      {description && (
        <p className={`mt-4 max-w-sm mx-auto ${hasBackgroundImage ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
