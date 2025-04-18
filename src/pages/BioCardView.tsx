
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import NotFound from './NotFound';

const BioCardView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bioCard, setBioCard] = useState<any | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBioCard = async () => {
      if (!slug) return;

      try {
        // Fetch the bio card
        const { data: bioCardData, error: bioCardError } = await supabase
          .from('bio_cards')
          .select('*')
          .eq('slug', slug)
          .single();

        if (bioCardError) throw bioCardError;
        if (!bioCardData) throw new Error('Bio card not found');

        setBioCard(bioCardData);

        // Increment view count
        await supabase.rpc('increment_bio_card_views', { card_slug: slug });

        // Fetch links
        const { data: linksData, error: linksError } = await supabase
          .from('bio_card_links')
          .select('*')
          .eq('bio_card_id', bioCardData.id)
          .order('id', { ascending: true });

        if (linksError) throw linksError;
        setLinks(linksData || []);

        // Fetch social links
        const { data: socialLinksData, error: socialLinksError } = await supabase
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
      await supabase.rpc('increment_bio_card_link_clicks', { link_id: linkId });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (error || !bioCard) {
    return <NotFound />;
  }

  const getSocialIcon = (platform: string) => {
    // This would be better with actual icons for each platform
    return <LinkIcon className="h-5 w-5" />;
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-10 px-4"
      style={{ backgroundColor: bioCard.bg_color || '#ffffff' }}
    >
      <div className="max-w-md w-full mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          {bioCard.profile_image_url ? (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white shadow-lg">
              <img 
                src={bioCard.profile_image_url} 
                alt={bioCard.title} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-gray-400">
                {bioCard.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-center">{bioCard.title}</h1>
          
          {bioCard.description && (
            <p className="text-center mt-2 max-w-sm">
              {bioCard.description}
            </p>
          )}
          
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-3 mt-4">
              {socialLinks.map((socialLink) => (
                <a 
                  key={socialLink.id}
                  href={socialLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow"
                  onClick={() => handleLinkClick(socialLink.id)}
                >
                  {getSocialIcon(socialLink.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* Links */}
        <div className="space-y-3 w-full">
          {links.map((link) => {
            const buttonStyles = {
              backgroundColor: bioCard.button_color || '#6366f1',
              borderRadius: 
                bioCard.button_style === 'rounded' ? '0.375rem' : 
                bioCard.button_style === 'pill' ? '9999px' : 
                '0px'
            };
            
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="block w-full text-center py-3 px-4 text-white shadow hover:opacity-90 transition-opacity"
                style={buttonStyles}
              >
                <div className="flex items-center justify-center">
                  <span>{link.title}</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
                {link.description && (
                  <div className="text-sm mt-1 opacity-90">{link.description}</div>
                )}
              </a>
            );
          })}
        </div>
        
        {/* Attribution */}
        <div className="mt-10 text-center text-sm opacity-70">
          <p>
            Powered by <a href="/" className="underline">Shortit</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BioCardView;
