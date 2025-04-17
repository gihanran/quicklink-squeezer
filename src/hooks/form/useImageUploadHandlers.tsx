
import { useProfileImageUpload } from '../useProfileImageUpload';

interface UseImageUploadHandlersResult {
  uploading: boolean;
  error: string | null;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const useImageUploadHandlers = (
  setProfileImageUrl: (url: string) => void
): UseImageUploadHandlersResult => {
  const { uploading, error: uploadError, uploadProfileImage } = useProfileImageUpload();

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadProfileImage(e);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  return {
    uploading,
    error: uploadError,
    handleProfileImageUpload
  };
};
