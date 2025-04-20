import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import NotFound from './NotFound';
import type { BioCard, BioCardLink, BioCardSocialLink } from '@/types/bioCardTypes';
import { BioCardLoadingState } from '@/components/biocard/view/BioCardLoadingState';
import { BioCardProfileHeader } from '@/components/biocard/view/BioCardProfileHeader';
import { BioCardSocialLinks } from '@/components/biocard/view/BioCardSocialLinks';
import { BioCardLinks } from '@/components/biocard/view/BioCardLinks';
import BioCardAd from '@/components/biocard/BioCardAd';

const BioCardView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bioCard, setBioCard] = useState<BioCard | null>(null);
  const [links, setLinks] = useState<BioCardLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<BioCardSocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBioCard = async () => {
      if (!slug) return;

      try {
        const { data: bioCardData, error: bioCardError } = await (supabase as any)
          .from('bio_cards')
          .select('*')
          .eq('slug', slug)
          .single();

        if (bioCardError) throw bioCardError;
        if (!bioCardData) throw new Error('Bio card not found');

        setBioCard(bioCardData);

        await (supabase as any).rpc('increment_bio_card_views', { card_slug: slug });

        const { data: linksData, error: linksError } = await (supabase as any)
          .from('bio_card_links')
          .select('*')
          .eq('bio_card_id', bioCardData.id)
          .order('id', { ascending: true });

        if (linksError) throw linksError;
        setLinks(linksData || []);

        const { data: socialLinksData, error: socialLinksError } = await (supabase as any)
          .from('bio_card_social_links')
          .select('*')
          .eq('bio_card_id', bioCardData.id)
          .order('id', { ascending: true });

        if (socialLinksError) throw socialLinksError;
        setSocialLinks(socialLinksData || []);
      } catch (err: any) {
        console.error('Error fetching bio card:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBioCard();
  }, [slug]);

  const handleLinkClick = async (linkId: string) => {
    try {
      await (supabase as any).rpc('increment_bio_card_link_clicks', { link_id: linkId });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: bioCard?.title || 'My Bio Card',
          text: bioCard?.description || 'Check out my bio card!',
          url: currentUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(currentUrl);
      toast({ description: "Link copied to clipboard!" });
    }
  };

  if (loading) {
    return <BioCardLoadingState />;
  }

  if (error || !bioCard) {
    return <NotFound />;
  }

  const containerStyle = {
    backgroundColor: bioCard.bg_color || '#ffffff',
    backgroundImage: bioCard.background_image_url ? `url(${bioCard.background_image_url})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-10 px-4"
      style={containerStyle}
    >
      <div className="max-w-md w-full mx-auto">
        <BioCardProfileHeader bioCard={bioCard} />
        <BioCardSocialLinks 
          socialLinks={socialLinks} 
          onLinkClick={handleLinkClick}
          onShare={handleShare}
        />
        <BioCardLinks 
          bioCard={bioCard} 
          links={links} 
          onLinkClick={handleLinkClick} 
        />
        
        <div className="mt-10 text-center text-sm opacity-70">
          <p>
            Powered by <a href="/" className="underline">Shortit</a>
          </p>
        </div>

        <BioCardAd />
      </div>
    </div>
  );
};

export default BioCardView;
