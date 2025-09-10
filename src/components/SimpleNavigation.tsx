import { Link } from "react-router-dom";

const SimpleNavigation = () => {
  console.log('SimpleNavigation rendering...');
  
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-foreground">
              Nymphette Tours
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary">
              Home
            </Link>
            <Link to="/packages" className="text-foreground hover:text-primary">
              Packages
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavigation;