import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useImageOptimization } from "@/hooks/useImageOptimization";
import { useSSROptimization } from "@/hooks/useSSROptimization";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Packages from "./pages/Packages";
import GroupTours from "./pages/GroupTours";
import GroupTourDetail from "./pages/GroupTourDetail";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Asia from "./pages/regions/Asia";
import Europe from "./pages/regions/Europe";
import Africa from "./pages/regions/Africa";
import Americas from "./pages/regions/Americas";
import PacificIslands from "./pages/regions/PacificIslands";
import MiddleEast from "./pages/regions/MiddleEast";
import CountryDetail from "./pages/country/CountryDetail";
import PackageDetail from "./pages/PackageDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";


const queryClient = new QueryClient();

declare global {
  interface Window {
    __STATIC_PROPS__: Record<string, any>;
  }
}

const App = () => {
  // Access static props if available (SSG mode)
  const staticProps = window.__STATIC_PROPS__ || {};
  useImageOptimization();
  useSSROptimization();
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/group-tours" element={<GroupTours />} />
              <Route path="/group-tours/:tourId" element={<GroupTourDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/package/:packageId" element={<PackageDetail />} />
              <Route path="/regions/:region/country/:country" element={<CountryDetail />} />
              <Route path="/regions/asia" element={<Asia />} />
              <Route path="/regions/europe" element={<Europe />} />
              <Route path="/regions/africa" element={<Africa />} />
              <Route path="/regions/americas" element={<Americas />} />
              <Route path="/regions/pacific-islands" element={<PacificIslands />} />
              <Route path="/regions/middle-east" element={<MiddleEast />} />
              <Route path="/packages/region/asia" element={<Asia />} />
              <Route path="/packages/region/europe" element={<Europe />} />
              <Route path="/packages/region/africa" element={<Africa />} />
              <Route path="/packages/region/americas" element={<Americas />} />
              <Route path="/packages/region/pacific-islands" element={<PacificIslands />} />
              <Route path="/packages/region/middle-east" element={<MiddleEast />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
