
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SaveButtonProps {
  loading: boolean;
  onClick: () => Promise<void>;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ loading, onClick }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading}
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : "Save Changes"}
    </Button>
  );
};
