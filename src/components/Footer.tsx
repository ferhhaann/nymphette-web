import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-4 md:py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-4 md:p-8 lg:p-16" style={{ backgroundColor: '#f5f5f5', margin: '0 1rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png" 
                alt="Nymphette Tours" 
                className="h-10 md:h-12 lg:h-16 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
            <p className="text-black/70 leading-relaxed text-sm md:text-base">
              Creating unforgettable travel experiences for over 25 years.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
               <div key={idx} className="bg-black/10 hover:bg-black text-black/70 hover:text-white transition-colors p-2 rounded-lg cursor-pointer">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-4 text-black">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-black/70 hover:text-black transition-colors">Home</Link></li>
              <li><Link to="/packages" className="text-black/70 hover:text-black transition-colors">Packages</Link></li>
              <li><Link to="/group-tours" className="text-black/70 hover:text-black transition-colors">Group Tours</Link></li>
              <li><Link to="/about" className="text-black/70 hover:text-black transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-black/70 hover:text-black transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-black/70 hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-4 text-black">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><Link to="/regions/asia/country/maldives" className="text-black/70 hover:text-black transition-colors">Maldives</Link></li>
              <li><Link to="/regions/europe" className="text-black/70 hover:text-black transition-colors">Europe</Link></li>
              <li><Link to="/regions/asia/country/indonesia" className="text-black/70 hover:text-black transition-colors">Bali</Link></li>
              <li><Link to="/regions/asia/country/thailand" className="text-black/70 hover:text-black transition-colors">Thailand</Link></li>
              <li><Link to="/regions/middle-east/country/uae" className="text-black/70 hover:text-black transition-colors">Dubai</Link></li>
              <li><Link to="/regions/asia/country/japan" className="text-black/70 hover:text-black transition-colors">Japan</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg font-semibold mb-3 md:mb-4 text-black">Stay Connected</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-2 text-black/70 text-sm md:text-base">
                <Phone className="h-4 w-4" />
                <span>044-49579403</span>
              </div>
              <div className="flex items-center space-x-2 text-black/70 text-sm md:text-base">
                <Mail className="h-4 w-4" />
                <span className="break-all">tours.maa@nymphetteindia.com</span>
              </div>
              
              <div className="mt-4 md:mt-6">
                <h4 className="font-medium mb-2 text-black text-sm md:text-base">Newsletter</h4>
                <div className="flex space-x-2">
                  <Input 
                    type="email" 
                    placeholder="Your email"
                    className="bg-white/60 border-black/20 text-black placeholder-black/50 text-sm"
                  />
                  <Button className="bg-black hover:bg-black/90 text-white text-sm px-3 md:px-4">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-black/20 mt-6 md:mt-12 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-black/70 text-sm md:text-base">© 2024 Nymphette Tours. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-4 md:space-x-6 mt-3 md:mt-0">
            <Link to="/privacy-policy" className="text-black/70 hover:text-black transition-colors text-sm md:text-base">Privacy</Link>
            <Link to="/terms-of-service" className="text-black/70 hover:text-black transition-colors text-sm md:text-base">Terms</Link>
            <Link to="/cookie-policy" className="text-black/70 hover:text-black transition-colors text-sm md:text-base">Cookies</Link>
          </div>
        </div>
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;