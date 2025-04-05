
import { User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/auth";
import { Badge } from "@/components/ui/badge";

interface UserIdentityProps {
  user: User | null;
}

export const UserIdentity: React.FC<UserIdentityProps> = ({ user }) => {
  const { isAdmin } = useAuthState();
  
  return (
    <div className="text-center mb-4">
      <div className="flex items-center justify-center gap-2 mb-1">
        <p className="text-sm text-gray-500">User ID</p>
        {isAdmin && (
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
            Admin
          </Badge>
        )}
      </div>
      <p className="font-mono text-xs">{user?.id}</p>
      <p className="text-xs text-gray-500 mt-1">
        Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
      </p>
    </div>
  );
};
