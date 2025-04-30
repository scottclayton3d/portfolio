import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };
  
  const navItems = [
    { name: "Home", sectionId: "hero" },
    { name: "Gallery", sectionId: "gallery" },
    { name: "About", sectionId: "about" },
    { name: "Contact", sectionId: "contact" }
  ];

  return (
    <header className={`fixed w-full bg-primary bg-opacity-95 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-montserrat font-bold tracking-tight flex items-center">
          <span className="text-white">ALEX</span>
          <span className="text-accent">CHEN</span>
        </Link>
        
        <button 
          className="lg:hidden text-white focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        
        <nav className="hidden lg:flex space-x-8 font-montserrat font-medium text-sm uppercase">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.sectionId)}
              className="text-white hover:text-accent transition-colors duration-300"
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="lg:hidden bg-secondary px-4 py-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col space-y-4 font-montserrat font-medium text-sm uppercase">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.sectionId)}
                className="text-white hover:text-accent transition-colors duration-300 py-2"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
