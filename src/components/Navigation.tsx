import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, MapPin } from "lucide-react";
import { BookingModal } from "./BookingModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
      const packageRelatedPaths = [
        "/asia", "/europe", "/africa", "/americas", "/pacific-islands", 
        "/middle-east", "/regions/", "/package/", "/country/"
      ];
      return location.pathname === href ||
             packageRelatedPaths.some(path => location.pathname.toLowerCase().includes(path.toLowerCase()));
    }
    return location.pathname === href;
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };


  return (
    <>
      {/* Main navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg' 
          : 'bg-background/70 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`font-medium transition-all duration-300 relative py-2 px-1 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <BookingModal />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-secondary">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96">
                  <SheetHeader>
                    <SheetTitle className="text-left">Navigation Menu</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">

                    {/* Main Navigation */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Main Pages
                      </h3>
                      {navItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Regions */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Explore Regions
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {regionItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className="px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors duration-200"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t pt-6 space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Contact Us
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>+1-800-NYMPHETTE</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>info@nymphettetours.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Serving 50+ Destinations</span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Booking Button */}
                    <div className="border-t pt-6">
                      <BookingModal 
                        trigger={
                          <Button className="w-full h-12 text-lg">
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
      </nav>

      {/* Spacer to account for fixed navigation */}
      <div className="h-12"></div>
    </>
  );
};

export default Navigation;