
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { useLandingPageForm } from "./useLandingPageForm";

interface UseBioCardFormProps {
  page: Partial<LandingPage> | null;
  links: LandingPageLink[];
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
}

export const useBioCardForm = (props: UseBioCardFormProps) => {
  return useLandingPageForm(props);
};
