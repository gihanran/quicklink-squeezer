
import { useImageUpload } from '../useImageUpload';

interface UseImageUploadHandlersResult {
  uploading: boolean;
  error: string | null;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const useImageUploadHandlers = (
  setProfileImageUrl: (url: string) => void,
  setBackgroundImageUrl: (url: string) => void
): UseImageUploadHandlersResult => {
  const { uploading, error: uploadError, uploadImage } = useImageUpload();

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImage(e, 'profiles');
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImage(e, 'backgrounds');
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
