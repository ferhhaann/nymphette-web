import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Packages from "./pages/Packages";
import GroupTours from "./pages/GroupTours";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Asia from "./pages/regions/Asia";
import Europe from "./pages/regions/Europe";
import Africa from "./pages/regions/Africa";
import Americas from "./pages/regions/Americas";
import PacificIslands from "./pages/regions/PacificIslands";
import MiddleEast from "./pages/regions/MiddleEast";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/group-tours" element={<GroupTours />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/regions/asia" element={<Asia />} />
          <Route path="/regions/europe" element={<Europe />} />
          <Route path="/regions/africa" element={<Africa />} />
          <Route path="/regions/americas" element={<Americas />} />
          <Route path="/regions/pacific-islands" element={<PacificIslands />} />
          <Route path="/regions/middle-east" element={<MiddleEast />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
