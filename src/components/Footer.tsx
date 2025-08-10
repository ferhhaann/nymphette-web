import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-foreground p-2 rounded-lg">
                <Plane className="h-6 w-6 text-background" />
              </div>
              <span className="text-xl font-bold">Nymphette Tours</span>
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
              {["Home", "Packages", "Group Tours", "About Us", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              {["Maldives", "Europe", "Bali", "Thailand", "Dubai", "Japan"].map((destination) => (
                <li key={destination}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {destination}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@nymphettetours.com</span>
              </div>
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1" />
                <span>123 Travel Street, Tourism District, Mumbai, India</span>
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
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;