
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MagicButtonTrack: React.FC = () => {
  const { buttonId } = useParams<{ buttonId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the main magic button page
    if (buttonId) {
      navigate(`/magic/${buttonId}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [buttonId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4 animate-pulse">
          <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xl">Redirecting...</p>
      </div>
    </div>
  );
};

export default MagicButtonTrack;
