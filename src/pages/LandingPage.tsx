
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, LandingPageLink, SocialMediaLink } from '@/types/landingPage';

// Component imports
import LoadingState from '@/components/landing-page/LoadingState';
import ErrorState from '@/components/landing-page/ErrorState';
import PageHeader from '@/components/landing-page/PageHeader';
import SocialLinks from '@/components/landing-page/SocialLinks';
import PageLinks from '@/components/landing-page/PageLinks';
import AdContainer from '@/components/landing-page/AdContainer';
import PageFooter from '@/components/landing-page/PageFooter';

interface DatabaseLandingPage {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  slug: string;
  published: boolean;
  profile_image_url: string | null;
  theme_color: string;
  created_at: string;
  updated_at: string;
  views: number;
  background_image_url?: string | null;
  button_style?: 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';
  social_links?: SocialMediaLink[];
}

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

        const dbPage = pageData as DatabaseLandingPage;
        console.log("Fetched page data:", dbPage); // Debug log

        const fullPageData: LandingPage = {
          ...dbPage,
          background_image_url: dbPage.background_image_url || null,
          button_style: dbPage.button_style || 'default',
          social_links: dbPage.social_links || []
        };
        
        setPage(fullPageData);
        setSocialLinks(fullPageData.social_links || []);
        console.log("Button style set to:", fullPageData.button_style); // Debug log
        
        const { data: linksData, error: linksError } = await supabase
          .from('landing_page_links')
          .select('*')
          .eq('landing_page_id', dbPage.id)
          .order('display_order', { ascending: true });
          
        if (linksError) throw linksError;
        
        setLinks(linksData || []);

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

  const themeColor = page.theme_color || '#9b87f5';
  const hasBackgroundImage = !!page.background_image_url;
  const backgroundStyle = hasBackgroundImage
    ? { backgroundImage: `url(${page.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { 
        '--theme-color': themeColor,
        background: `linear-gradient(to bottom, white, ${themeColor}10)`
      };

  return (
    <div 
      className="min-h-screen flex flex-col py-12 px-4 relative"
      style={backgroundStyle as React.CSSProperties}
    >
      {hasBackgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
      )}
      
      <div className="max-w-md w-full mx-auto space-y-8 relative z-10">
        <PageHeader 
          title={page.title}
          description={page.description}
          profileImageUrl={page.profile_image_url}
          themeColor={themeColor}
          hasBackgroundImage={hasBackgroundImage}
        />

        <SocialLinks 
          socialLinks={socialLinks}
          themeColor={themeColor}
          hasBackgroundImage={hasBackgroundImage}
        />

        <PageLinks 
          links={links}
          buttonStyle={page.button_style}
          themeColor={themeColor}
          hasBackgroundImage={hasBackgroundImage}
        />

        <AdContainer />

        <PageFooter 
          hasBackgroundImage={hasBackgroundImage}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
};

export default LandingPageView;
