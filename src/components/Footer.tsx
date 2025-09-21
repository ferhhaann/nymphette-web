import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 md:p-12 lg:p-16" style={{ backgroundColor: '#f5f5f5', margin: '0 1rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png" 
                alt="Nymphette Tours" 
                className="h-12 lg:h-16 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
            <p className="text-black/70 leading-relaxed">
              Creating unforgettable travel experiences for over 25 years. 
              Your journey to extraordinary destinations starts here.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
               <div key={idx} className="bg-black/10 hover:bg-black text-black/70 hover:text-white transition-colors p-2 rounded-lg cursor-pointer">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
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
          <div>
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
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Stay Connected</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-black/70">
                <Phone className="h-4 w-4" />
                <span>044-49579403, 9840109014</span>
              </div>
              <div className="flex items-center space-x-2 text-black/70">
                <Mail className="h-4 w-4" />
                <span>tours.maa@nymphetteindia.com</span>
              </div>
              <div className="flex items-start space-x-2 text-black/70">
                <MapPin className="h-4 w-4 mt-1" />
                <span>No 81, Y Block, 6th Street, 1st Floor, Anna Nagar West, Chennai 600040</span>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2 text-black">Subscribe to Newsletter</h4>
                <div className="flex space-x-2">
                  <Input 
                    type="email" 
                    placeholder="Your email"
                    className="bg-white/60 border-black/20 text-black placeholder-black/50"
                  />
                  <Button className="bg-black hover:bg-black/90 text-white">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-black/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-black/70">© 2024 Nymphette Tours. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-black/70 hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-black/70 hover:text-black transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-black/70 hover:text-black transition-colors">Cookie Policy</Link>
          </div>
        </div>
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;