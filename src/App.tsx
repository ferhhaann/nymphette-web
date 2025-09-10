import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimpleIndex from "./pages/SimpleIndex";

const App = () => {
  console.log('App component rendering...');
  
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimpleIndex />} />
          <Route path="/packages" element={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Packages</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          } />
          <Route path="/about" element={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">About Us</h1>
                <p className="text-muted-foreground">Learn more about our company...</p>
              </div>
            </div>
          } />
          <Route path="/contact" element={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                <p className="text-muted-foreground">Get in touch with us...</p>
              </div>
            </div>
          } />
          <Route path="*" element={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
