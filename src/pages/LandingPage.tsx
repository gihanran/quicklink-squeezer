
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, LandingPageLink } from '@/types/landingPage';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { incrementLinkClicks } from '@/services/landingPageLinkService';

const LandingPageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [links, setLinks] = useState<LandingPageLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch landing page by slug
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

        setPage(pageData);
        
        // Fetch links for this landing page
        const { data: linksData, error: linksError } = await supabase
          .from('landing_page_links')
          .select('*')
          .eq('landing_page_id', pageData.id)
          .order('display_order', { ascending: true });
          
        if (linksError) throw linksError;
        
        setLinks(linksData || []);

        // Increment the view count for this page
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

  // Load advertisement scripts
  useEffect(() => {
    if (!loading && adContainerRef.current) {
      // Create the first script element with atOptions
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.text = `
        atOptions = {
          'key' : '8f16a4e70ba2c3e74ea50c0eef897f95',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      // Create the second script element that loads the ad
      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = '//www.highperformanceformat.com/8f16a4e70ba2c3e74ea50c0eef897f95/invoke.js';
      
      // Clear any existing content
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
        adContainerRef.current.appendChild(atOptionsScript);
        adContainerRef.current.appendChild(adScript);
      }
    }
  }, [loading]);

  const handleLinkClick = async (link: LandingPageLink) => {
    try {
      // Track the click
      await incrementLinkClicks(link.id);
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The landing page you're looking for doesn't exist or isn't published.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const themeColor = page.theme_color || '#9b87f5';

  return (
    <div 
      className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 py-12 px-4"
      style={{ 
        '--theme-color': themeColor,
        background: `linear-gradient(to bottom, white, ${themeColor}10)`
      } as React.CSSProperties}
    >
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          {page.profile_image_url && (
            <div className="flex justify-center mb-6">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src={page.profile_image_url} alt={page.title} />
                <AvatarFallback style={{ backgroundColor: themeColor, color: 'white' }}>
                  {page.title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <h1 
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{ 
              backgroundImage: `linear-gradient(to right, ${themeColor}, ${themeColor}CC)` 
            }}
          >
            {page.title}
          </h1>
          {page.description && (
            <p className="mt-4 text-gray-600 max-w-sm mx-auto">{page.description}</p>
          )}
        </div>

        <div className="space-y-3">
          {links.map((link) => (
            <a 
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              onClick={() => handleLinkClick(link)}
            >
              <Button
                variant="outline"
                className="w-full py-6 flex items-center justify-between hover:bg-gray-50 border-2 transition-all"
                style={{ borderColor: `${themeColor}40` }}
              >
                <span className="text-lg font-medium">{link.title}</span>
                <ExternalLink className="h-4 w-4 opacity-50" />
              </Button>
            </a>
          ))}
        </div>

        {/* Advertisement section */}
        <div className="w-full flex justify-center my-6">
          <div ref={adContainerRef} className="ad-container" />
        </div>

        <div className="pt-8 text-center">
          <p className="text-sm text-gray-400">
            Powered by <a 
              href="/" 
              className="hover:underline"
              style={{ color: themeColor }}
            >
              Shortit
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPageView;
