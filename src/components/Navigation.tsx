import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: "Group Tours", href: "/group-tours" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/packages") {
      const packageRelatedPaths = [
        "/asia",
        "/europe",
        "/africa",
        "/americas",
        "/pacific-islands",
        "/middle-east",
        "/regions/",
        "/package/",
        "/country/"
      ];
      // Return true for packages page and all related sub-pages
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
    <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-md z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png" 
              alt="Nymphette International" 
              className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleNavigation("/")}
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`font-medium transition-all duration-300 relative ${
                  isActive(item.href)
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-foreground rounded-full"></div>
                )}
              </button>
            ))}
            <Button variant="secondary" className="bg-foreground hover:bg-foreground/90 text-background">
              Book Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-accent transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                    className={`block w-full text-left px-3 py-2 transition-colors duration-300 ${
                      isActive(item.href)
                        ? "text-foreground bg-secondary rounded-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <div className="px-3 pt-2">
                  <Button variant="secondary" className="w-full bg-foreground hover:bg-foreground/90 text-background">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;