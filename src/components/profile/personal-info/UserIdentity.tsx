
import { User } from "@supabase/supabase-js";

interface UserIdentityProps {
  user: User | null;
}

export const UserIdentity: React.FC<UserIdentityProps> = ({ user }) => {
  return (
    <div className="text-center mb-4">
      <p className="text-sm text-gray-500">User ID</p>
      <p className="font-mono text-xs">{user?.id}</p>
      <p className="text-xs text-gray-500 mt-1">
        Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
      </p>
    </div>
  );
};
