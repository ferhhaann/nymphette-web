import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            <p className="text-muted-foreground leading-relaxed">
              Creating unforgettable travel experiences for over 25 years. 
              Your journey to extraordinary destinations starts here.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                <div key={idx} className="bg-muted hover:bg-foreground text-foreground hover:text-background transition-colors p-2 rounded-lg cursor-pointer">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/packages" className="text-muted-foreground hover:text-foreground transition-colors">Packages</Link></li>
              <li><Link to="/group-tours" className="text-muted-foreground hover:text-foreground transition-colors">Group Tours</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><Link to="/regions/asia/country/maldives" className="text-muted-foreground hover:text-foreground transition-colors">Maldives</Link></li>
              <li><Link to="/regions/europe" className="text-muted-foreground hover:text-foreground transition-colors">Europe</Link></li>
              <li><Link to="/regions/asia/country/indonesia" className="text-muted-foreground hover:text-foreground transition-colors">Bali</Link></li>
              <li><Link to="/regions/asia/country/thailand" className="text-muted-foreground hover:text-foreground transition-colors">Thailand</Link></li>
              <li><Link to="/regions/middle-east/country/uae" className="text-muted-foreground hover:text-foreground transition-colors">Dubai</Link></li>
              <li><Link to="/regions/asia/country/japan" className="text-muted-foreground hover:text-foreground transition-colors">Japan</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>044-49579403, 9840109014</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>tours.maa@nymphetteindia.com</span>
              </div>
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1" />
                <span>No 81, Y Block, 6th Street, 1st Floor, Anna Nagar West, Chennai 600040</span>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Subscribe to Newsletter</h4>
                <div className="flex space-x-2">
                  <Input 
                    type="email" 
                    placeholder="Your email"
                    className="bg-muted border-border text-foreground placeholder-muted-foreground"
                  />
                  <Button className="bg-foreground hover:bg-foreground/90 text-background">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">© 2024 Nymphette Tours. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;