
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAuthState } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LinksList from './LinksList';
import SocialLinksList from './SocialLinksList';
import type { BioCard } from '@/types/bioCardTypes';
import { BasicInfoSection } from './form/BasicInfoSection';
import { StyleSettings } from './form/StyleSettings';
import { useBioCardFormState } from '@/hooks/biocard/useBioCardFormState';

interface BioCardFormProps {
  onClose: () => void;
  onSave: () => void;
  initialData?: BioCard;
}

const BioCardForm: React.FC<BioCardFormProps> = ({ 
  onClose, 
  onSave,
  initialData
}) => {
  const { formState, setters } = useBioCardFormState(initialData);
  const { user } = useAuthState();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!formState.title) {
      toast({
        title: 'Missing title',
        description: 'Please enter a title for your bio card',
        variant: 'destructive'
      });
      return;
    }

    if (!formState.slug) {
      toast({
        title: 'Missing slug',
        description: 'Please enter a slug for your bio card',
        variant: 'destructive'
      });
      return;
    }

    try {
      setters.setSaving(true);

      // Check if slug is already taken (but not by this card)
      if (!initialData || initialData.slug !== formState.slug) {
        const { data: existingCard } = await (supabase as any)
          .from('bio_cards')
          .select('id')
          .eq('slug', formState.slug)
          .neq('id', initialData?.id || '')
          .maybeSingle();

        if (existingCard) {
          toast({
            title: 'Slug already taken',
            description: 'Please choose a different slug',
            variant: 'destructive'
          });
          setters.setSaving(false);
          return;
        }
      }

      // Create or update bio card
      const bioCardData = {
        title: formState.title,
        slug: formState.slug,
        description: formState.description,
        bg_color: formState.bgColor,
        button_color: formState.buttonColor,
        button_style: formState.buttonStyle,
        profile_image_url: formState.profileImageUrl,
        user_id: user!.id
      };

      let cardId;

      if (initialData) {
        const { error } = await (supabase as any)
          .from('bio_cards')
          .update(bioCardData)
          .eq('id', initialData.id);

        if (error) throw error;
        cardId = initialData.id;
      } else {
        const { data, error } = await (supabase as any)
          .from('bio_cards')
          .insert([bioCardData])
          .select();

        if (error) throw error;
        cardId = data[0].id;
      }

      // Handle links and social links updates
      await handleLinksUpdate(cardId, initialData);

      toast({
        title: initialData ? 'Bio card updated' : 'Bio card created',
        description: initialData 
          ? 'Your bio card has been updated successfully' 
          : 'Your new bio card has been created'
      });

      onSave();
    } catch (error: any) {
      console.error('Error saving bio card:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save bio card',
        variant: 'destructive'
      });
    } finally {
      setters.setSaving(false);
    }
  };

  const handleLinksUpdate = async (cardId: string, initialData?: BioCard) => {
    // Delete existing links and social links if editing
    if (initialData) {
      await (supabase as any)
        .from('bio_card_links')
        .delete()
        .eq('bio_card_id', initialData.id);
        
      await (supabase as any)
        .from('bio_card_social_links')
        .delete()
        .eq('bio_card_id', initialData.id);
    }

    // Add new links
    if (formState.links.length > 0) {
      const linksToInsert = formState.links.map((link: any) => ({
        bio_card_id: cardId,
        title: link.title,
        url: link.url,
        description: link.description,
        icon: link.icon
      }));

      const { error: linksError } = await (supabase as any)
        .from('bio_card_links')
        .insert(linksToInsert);

      if (linksError) throw linksError;
    }

    // Add social links
    if (formState.socialLinks.length > 0) {
      const socialLinksToInsert = formState.socialLinks.map((link: any) => ({
        bio_card_id: cardId,
        platform: link.platform,
        url: link.url,
        icon: link.icon
      }));

      const { error: socialLinksError } = await (supabase as any)
        .from('bio_card_social_links')
        .insert(socialLinksToInsert);

      if (socialLinksError) throw socialLinksError;
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{initialData ? 'Edit Bio Card' : 'Create New Bio Card'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BasicInfoSection 
              title={formState.title}
              setTitle={setters.setTitle}
              slug={formState.slug}
              setSlug={setters.setSlug}
              description={formState.description}
              setDescription={setters.setDescription}
              profileImageUrl={formState.profileImageUrl}
              setProfileImageUrl={setters.setProfileImageUrl}
            />
            
            <div className="mt-6">
              <StyleSettings 
                bgColor={formState.bgColor}
                setBgColor={setters.setBgColor}
                buttonColor={formState.buttonColor}
                setButtonColor={setters.setButtonColor}
                buttonStyle={formState.buttonStyle}
                setButtonStyle={setters.setButtonStyle}
                colorPickerOpen={formState.colorPickerOpen}
                setColorPickerOpen={setters.setColorPickerOpen}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Links (Maximum 7)</h3>
            <LinksList 
              links={formState.links} 
              setLinks={setters.setLinks} 
              maxLinks={7} 
            />
            
            <h3 className="text-lg font-medium mb-3 mt-6">Social Media (Maximum 5)</h3>
            <SocialLinksList 
              links={formState.socialLinks} 
              setLinks={setters.setSocialLinks}
              maxLinks={5}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={formState.saving}>
          {formState.saving ? 'Saving...' : initialData ? 'Update Bio Card' : 'Create Bio Card'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BioCardForm;
