
import { User } from "@supabase/supabase-js";
import { UserAvatar } from "../UserAvatar";

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  user: User | null;
  onAvatarChange: (value: string) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  firstName,
  lastName,
  avatarUrl,
  user,
  onAvatarChange
}) => {
  return (
    <div className="flex justify-center mb-4">
      <UserAvatar 
        firstName={firstName} 
        lastName={lastName} 
        imageUrl={avatarUrl}
        user={user}
        editable={true}
        onAvatarChange={onAvatarChange}
      />
    </div>
  );
};
