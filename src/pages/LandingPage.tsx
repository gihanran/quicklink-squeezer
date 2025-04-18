import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, LandingPageLink, SocialMediaLink } from '@/types/landingPage';

import LoadingState from '@/components/landing-page/LoadingState';
import ErrorState from '@/components/landing-page/ErrorState';
import PageHeader from '@/components/landing-page/PageHeader';
import PageLinks from '@/components/landing-page/PageLinks';
import AdContainer from '@/components/landing-page/AdContainer';
import PageFooter from '@/components/landing-page/PageFooter';
import SocialLinks from '@/components/landing-page/SocialLinks';

const LandingPageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [links, setLinks] = useState<LandingPageLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();
          
        if (pageError) {
          if (pageError.code === 'PGRST116') {
            throw new Error('Landing page not found');
          }
          throw pageError;
        }

        setPage(pageData as LandingPage);
        
        const { data: linksData, error: linksError } = await supabase
          .from('landing_page_links')
          .select('*')
          .eq('landing_page_id', pageData.id)
          .order('display_order', { ascending: true });
          
        if (linksError) throw linksError;
        
        setLinks(linksData || []);

        // Properly handle the social media links table with type assertions
        const { data: socialLinksData, error: socialLinksError } = await (supabase
          .from('social_media_links' as any)
          .select('*')
          .eq('landing_page_id', pageData.id)
          .order('display_order', { ascending: true }));

        if (socialLinksError) throw socialLinksError;
        
        // Cast the result to the appropriate type
        setSocialLinks((socialLinksData || []) as unknown as SocialMediaLink[]);

        if (slug) {
          try {
            await supabase.rpc('increment_landing_page_views', { page_slug: slug });
          } catch (viewError) {
            console.error('Error incrementing page views:', viewError);
          }
        }

      } catch (err: any) {
        console.error('Error fetching landing page:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchLandingPage();
    }
  }, [slug]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !page) {
    return <ErrorState />;
  }

  const containerStyle = page.background_image_url ? {
    backgroundImage: `url(${page.background_image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  const overlayOpacity = page.background_overlay ?? 0.5;

  return (
    <div 
      className="min-h-screen flex flex-col py-12 px-4 relative"
      style={containerStyle}
    >
      {page.background_image_url && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      <div className="max-w-md w-full mx-auto space-y-8 relative z-10">
        <PageHeader 
          title={page.title}
          description={page.description}
          profileImageUrl={page.profile_image_url}
          hasBackground={!!page.background_image_url}
        />

        <PageLinks links={links} />
        
        <SocialLinks links={socialLinks} />

        <AdContainer />

        <PageFooter />
      </div>
    </div>
  );
};

export default LandingPageView;
