
import { useProfileImageUpload } from '../useProfileImageUpload';

interface UseImageUploadHandlersResult {
  uploading: boolean;
  error: string | null;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const useImageUploadHandlers = (
  setProfileImageUrl: (url: string) => void,
  setBackgroundImageUrl: (url: string | null) => void
): UseImageUploadHandlersResult => {
  const { uploading, error: uploadError, uploadProfileImage } = useProfileImageUpload();

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadProfileImage(e);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadProfileImage(e);
    if (imageUrl) {
      setBackgroundImageUrl(imageUrl);
    }
  };

  return {
    uploading,
    error: uploadError,
    handleProfileImageUpload,
    handleBackgroundImageUpload
  };
};
