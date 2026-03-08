import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, MapPin } from "lucide-react";
import { BookingModal } from "./BookingModal";
import { motion } from "framer-motion";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: "Group Tours", href: "/group-tours" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const regionItems = [
    { name: "Asia", href: "/regions/asia" },
    { name: "Europe", href: "/regions/europe" },
    { name: "Africa", href: "/regions/africa" },
    { name: "Americas", href: "/regions/americas" },
    { name: "Pacific Islands", href: "/regions/pacific-islands" },
    { name: "Middle East", href: "/regions/middle-east" },
  ];

  const isActive = (href: string) => {
    if (href === "/packages") {
      const packageRelatedPaths = ["/asia", "/europe", "/africa", "/americas", "/pacific-islands", "/middle-east", "/regions/", "/package/", "/country/"];
      return location.pathname === href || packageRelatedPaths.some(path => location.pathname.toLowerCase().includes(path.toLowerCase()));
    }
    return location.pathname === href;
  };

  const handleNavigation = (href: string) => { navigate(href); setIsOpen(false); };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-strong shadow-lg shadow-primary/5'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png" 
                alt="Nymphette Tours" 
                className="h-12 lg:h-16 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleNavigation("/")}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  onClick={() => handleNavigation(item.href)}
                  className={`relative font-medium transition-all duration-300 py-2 px-4 rounded-lg text-sm tracking-wide ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      style={{ boxShadow: 'var(--glow-primary)' }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <BookingModal />
            </div>

            {/* Mobile menu */}
            <div className="lg:hidden flex items-center space-x-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-secondary text-foreground">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96 bg-card border-border">
                  <SheetHeader>
                    <SheetTitle className="text-left text-foreground">Navigation</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">Pages</h3>
                      {navItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">Regions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {regionItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className="px-3 py-2 text-sm rounded-lg text-foreground/70 hover:bg-secondary hover:text-foreground transition-all duration-200"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 space-y-3">
                      <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">Contact</h3>
                      <div className="space-y-2 text-sm text-foreground/70">
                        <div className="flex items-center space-x-2"><Phone className="h-4 w-4 text-primary" /><span>+1-800-NYMPHETTE</span></div>
                        <div className="flex items-center space-x-2"><Mail className="h-4 w-4 text-primary" /><span>info@nymphettetours.com</span></div>
                        <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-primary" /><span>50+ Destinations</span></div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <BookingModal 
                        trigger={
                          <Button className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                            Book Your Dream Trip
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navigation;
