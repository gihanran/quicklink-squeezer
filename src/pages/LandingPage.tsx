
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, LandingPageLink, SocialMediaLink } from '@/types/landingPage';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { incrementLinkClicks } from '@/services/landingPageLinkService';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const LandingPageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [links, setLinks] = useState<LandingPageLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
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

        // Add default values for new fields if they don't exist in the database
        const fullPageData: LandingPage = {
          ...pageData,
          background_image_url: pageData.background_image_url || null,
          button_style: pageData.button_style || 'default',
          social_links: pageData.social_links || []
        };
        
        setPage(fullPageData);
        setSocialLinks(fullPageData.social_links || []);
        
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

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      default:
        return <ExternalLink size={20} />;
    }
  };

  const getButtonClasses = (buttonStyle: string = 'default') => {
    const baseClasses = "w-full py-6 flex items-center justify-between hover:bg-gray-50 border-2 transition-all";
    
    switch (buttonStyle) {
      case 'rounded':
        return `${baseClasses} rounded-lg`;
      case 'pill':
        return `${baseClasses} rounded-full`;
      case 'outline':
        return `${baseClasses} bg-transparent`;
      case 'subtle':
        return `${baseClasses} bg-transparent border-opacity-30`;
      default:
        return `${baseClasses}`;
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
  const backgroundStyle = page.background_image_url 
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
      {/* Apply overlay if background image exists */}
      {page.background_image_url && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
      )}
      
      <div className="max-w-md w-full mx-auto space-y-8 relative z-10">
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
            className={`text-4xl font-bold ${page.background_image_url ? 'text-white' : 'bg-clip-text text-transparent'}`}
            style={!page.background_image_url ? { 
              backgroundImage: `linear-gradient(to right, ${themeColor}, ${themeColor}CC)` 
            } : {}}
          >
            {page.title}
          </h1>
          {page.description && (
            <p className={`mt-4 max-w-sm mx-auto ${page.background_image_url ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
              {page.description}
            </p>
          )}
        </div>

        {/* Social Media Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 my-4">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${page.background_image_url ? 'bg-white text-gray-800' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                style={{ color: themeColor }}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        )}

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
                variant={page.button_style === 'outline' ? 'outline' : page.button_style === 'subtle' ? 'ghost' : 'outline'}
                className={getButtonClasses(page.button_style)}
                style={{ 
                  borderColor: `${themeColor}40`,
                  color: page.background_image_url ? 'white' : undefined,
                  backgroundColor: page.background_image_url ? 'rgba(0,0,0,0.3)' : undefined
                }}
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
          <p className={`text-sm ${page.background_image_url ? 'text-white text-opacity-70' : 'text-gray-400'}`}>
            Powered by <a 
              href="/" 
              className="hover:underline"
              style={{ color: page.background_image_url ? 'white' : themeColor }}
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
