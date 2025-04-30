import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative pt-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1601674680111-c394bd92fc42?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="3D Artwork hero background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/80 to-primary"></div>
      </div>
      
      <motion.div 
        className="container mx-auto px-4 z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-montserrat font-bold text-4xl md:text-6xl mb-6 leading-tight">
          Crafting Digital <span className="text-accent">Worlds</span>
        </h1>
        <p className="font-opensans text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-200">
          3D Artist specializing in character modeling, environment design, and concept art for games and film.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            onClick={() => scrollToSection("gallery")}
            className="bg-accent text-white py-3 px-8 rounded font-montserrat font-medium text-sm uppercase tracking-wider hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Portfolio
          </motion.button>
          <motion.button
            onClick={() => scrollToSection("contact")}
            className="bg-transparent border border-white text-white py-3 px-8 rounded font-montserrat font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          onClick={() => scrollToSection("featured")}
          className="text-white opacity-75 hover:opacity-100 transition-opacity duration-300"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
