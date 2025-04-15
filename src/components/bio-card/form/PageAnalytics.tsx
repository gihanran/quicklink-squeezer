
import React from 'react';
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import OriginalPageAnalytics from "@/components/landing-pages/form/PageAnalytics";

interface PageAnalyticsProps {
  page: LandingPage;
  links: LandingPageLink[];
}

const PageAnalytics: React.FC<PageAnalyticsProps> = ({ page, links }) => {
  return <OriginalPageAnalytics page={page} links={links} />;
};

export default PageAnalytics;
