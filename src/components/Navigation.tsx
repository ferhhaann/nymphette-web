import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane } from "lucide-react";

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
    return location.pathname === href;
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-sm z-50 border-b border-soft-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-accent p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span 
              className="text-white text-xl font-bold cursor-pointer hover:text-soft-blue transition-colors"
              onClick={() => handleNavigation("/")}
            >
              Nymphette Tours
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`font-medium transition-all duration-300 relative ${
                  isActive(item.href)
                    ? "text-soft-blue"
                    : "text-white hover:text-soft-blue"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-soft-blue rounded-full"></div>
                )}
              </button>
            ))}
            <Button variant="secondary" className="bg-accent hover:bg-bright-blue text-white">
              Book Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-soft-blue transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-primary-dark/95 backdrop-blur-sm border-t border-soft-blue/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`block w-full text-left px-3 py-2 transition-colors duration-300 ${
                    isActive(item.href)
                      ? "text-soft-blue bg-white/10 rounded-lg"
                      : "text-white hover:text-soft-blue"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 pt-2">
                <Button variant="secondary" className="w-full bg-accent hover:bg-bright-blue text-white">
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