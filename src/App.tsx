
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import React from "react";

import Index from "./pages/Index";
import Redirect from "./pages/Redirect";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Affiliate from "./pages/Affiliate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import BioCardDashboard from "./pages/BioCardDashboard";
import BioCardView from "./pages/BioCardView";
import BioCardEdit from "./pages/BioCardEdit";
import UrlUnlockers from "./pages/UrlUnlockers";
import Unlock from "./pages/Unlock";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import UserGuide from "./pages/UserGuide";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipPrimitive.Provider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/s/:shortCode" element={<Redirect />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/unlockers" element={<UrlUnlockers />} />
                <Route path="/unlock/:unlockerId" element={<Unlock />} />
                <Route path="/biocard" element={<BioCardDashboard />} />
                <Route path="/b/:slug" element={<BioCardView />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/guide" element={<UserGuide />} />
                <Route path="/biocard/edit/:slug" element={<BioCardEdit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipPrimitive.Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
