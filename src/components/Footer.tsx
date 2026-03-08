import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/animations/ScrollReveal";

const Footer = () => {
  return (
    <footer className="bg-background pt-16 sm:pt-20 pb-8 relative overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div className="space-y-5">
            <img 
              src="/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png" 
              alt="Nymphette Tours" 
              className="h-12 lg:h-14 hover:opacity-80 transition-opacity"
            />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Creating unforgettable travel experiences for over 25 years.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                <div key={idx} className="futuristic-card w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer group">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[{ to: "/", label: "Home" }, { to: "/packages", label: "Packages" }, { to: "/group-tours", label: "Group Tours" }, { to: "/about", label: "About Us" }, { to: "/blog", label: "Blog" }, { to: "/contact", label: "Contact" }].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Destinations</h3>
            <ul className="space-y-3">
              {[{ to: "/regions/asia/country/maldives", label: "Maldives" }, { to: "/regions/europe", label: "Europe" }, { to: "/regions/asia/country/indonesia", label: "Bali" }, { to: "/regions/asia/country/thailand", label: "Thailand" }, { to: "/regions/middle-east/country/uae", label: "Dubai" }, { to: "/regions/asia/country/japan", label: "Japan" }].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Stay Connected</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>044-49579403</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="break-all">tours.maa@nymphetteindia.com</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Newsletter</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email"
                  className="bg-secondary/50 border-border/50 text-foreground placeholder-muted-foreground text-sm rounded-lg"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 rounded-lg">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2024 Nymphette Tours. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</Link>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
