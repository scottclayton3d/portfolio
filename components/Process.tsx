import { motion } from "framer-motion";

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  index: number;
}

const ProcessStep = ({ number, title, description, index }: ProcessStepProps) => {
  return (
    <motion.div 
      className="relative bg-primary rounded-lg p-6 hover-scale"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 text-white">
        <span className="font-montserrat font-bold text-2xl">{number}</span>
      </div>
      <h3 className="font-montserrat font-semibold text-xl mb-3">{title}</h3>
      <p className="font-opensans text-gray-300">
        {description}
      </p>
    </motion.div>
  );
};

const Process = () => {
  const processSteps = [
    {
      number: "01",
      title: "Concept",
      description: "Every project begins with research and concept development to establish a clear creative direction."
    },
    {
      number: "02",
      title: "Modeling",
      description: "Creating detailed 3D models with careful attention to topology and structure."
    },
    {
      number: "03",
      title: "Texturing",
      description: "Applying detailed textures and materials to bring the 3D models to life with realism."
    },
    {
      number: "04",
      title: "Rendering",
      description: "Final lighting, rendering and post-processing to achieve the desired visual style."
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-montserrat font-bold text-3xl md:text-4xl mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Creative <span className="text-accent">Process</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <ProcessStep 
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
