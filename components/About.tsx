import { motion } from "framer-motion";
import { Check } from "lucide-react";

const About = () => {
  const skills = [
    "Character Modeling & Rigging",
    "Environment Design",
    "Texture Painting & UV Mapping",
    "Lighting & Rendering"
  ];

  const software = [
    "Blender & Maya",
    "ZBrush & Substance Painter",
    "Unreal Engine & Unity",
    "Adobe Creative Suite"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="about" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 border-2 border-accent rounded-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Alexander Chen - 3D Artist" 
                className="w-64 h-64 object-cover rounded-lg relative z-10"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-6">
              About <span className="text-accent">Me</span>
            </h2>
            
            <p className="font-opensans text-lg text-gray-300 mb-6">
              I'm Alexander Chen, a 3D artist with over 8 years of experience creating immersive digital worlds and characters for games, film, and interactive media. My passion lies in bringing imaginative concepts to life through detailed modeling, texturing, and animation.
            </p>
            
            <p className="font-opensans text-lg text-gray-300 mb-8">
              Having worked with studios like Dreamworks, Ubisoft, and independent game developers, I specialize in high-poly character modeling, environment design, and concept visualization. My goal is to create memorable visual experiences that tell compelling stories.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="font-montserrat font-semibold text-xl mb-3">Skills</h3>
                <ul className="space-y-2 font-opensans text-gray-300">
                  {skills.map((skill, index) => (
                    <motion.li key={index} className="flex items-center" variants={itemVariants}>
                      <Check className="h-4 w-4 text-accent mr-2" />
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-montserrat font-semibold text-xl mb-3">Software</h3>
                <ul className="space-y-2 font-opensans text-gray-300">
                  {software.map((item, index) => (
                    <motion.li key={index} className="flex items-center" variants={itemVariants}>
                      <Check className="h-4 w-4 text-accent mr-2" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            <div className="flex flex-wrap space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.a
                href="#"
                className="bg-accent text-white py-3 px-6 rounded font-montserrat font-medium text-sm uppercase tracking-wider hover:bg-opacity-90 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.a>
              <motion.button
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    window.scrollTo({
                      top: contactSection.offsetTop - 80,
                      behavior: "smooth"
                    });
                  }
                }}
                className="bg-transparent border border-white text-white py-3 px-6 rounded font-montserrat font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
