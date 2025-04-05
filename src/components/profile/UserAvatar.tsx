
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

export const UserAvatar = ({ firstName, lastName, imageUrl }: UserAvatarProps) => {
  const getInitials = (first: string, last: string) => {
    const firstInitial = first ? first.charAt(0).toUpperCase() : '';
    const lastInitial = last ? last.charAt(0).toUpperCase() : '';
    return (firstInitial + lastInitial) || 'U';
  };

  return (
    <Avatar className="h-24 w-24">
      <AvatarImage src={imageUrl || ""} alt={`${firstName} ${lastName}`} />
      <AvatarFallback className="bg-brand-purple text-white text-xl">
        {getInitials(firstName, lastName)}
      </AvatarFallback>
    </Avatar>
  );
};
