import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from './ProjectCard';

// Define TypeScript interfaces
interface ProjectProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

interface ProjectsSectionProps {
  className?: string;
}

const Section = styled(motion.section)`
  padding: 80px 20px;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(#00000010 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 0;
  opacity: 0.5;
`;

const ContentContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ProjectsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px;
  padding: 40px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.8rem;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
  color: #333;
  font-weight: 700;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #ff8a00, #e52e71);
    border-radius: 2px;
  }
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? 'linear-gradient(90deg, #ff8a00, #e52e71)' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? 'transparent' : '#ddd'};
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 15px rgba(229, 46, 113, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 6px 20px rgba(229, 46, 113, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.2rem;
`;

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ className }) => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // State for filtering
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [filteredProjects, setFilteredProjects] = useState<ProjectProps[]>([]);
  
  // Example project data
  const projects: ProjectProps[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, product filtering, and payment processing.",
      imageUrl: "/images/ecommerce-project.jpg",
      tags: ["React", "Node.js", "MongoDB"],
      demoUrl: "https://demo-ecommerce.example.com",
      githubUrl: "https://github.com/yourusername/ecommerce-platform"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and styled-components. Features smooth animations and a clean, modern design.",
      imageUrl: "/images/portfolio-project.jpg",
      tags: ["React", "Styled Components", "Framer Motion"],
      demoUrl: "https://portfolio.example.com",
      githubUrl: "https://github.com/yourusername/portfolio"
    },
    {
      id: 3,
      title: "Weather App",
      description: "A weather application that fetches real-time data from OpenWeatherMap API. Displays current weather and 5-day forecast.",
      imageUrl: "/images/weather-app.jpg",
      tags: ["JavaScript", "API", "CSS3"],
      demoUrl: "https://weather.example.com",
      githubUrl: "https://github.com/yourusername/weather-app"
    },
    {
      id: 4,
      title: "Task Management App",
      description: "A productivity application for managing tasks and projects with team collaboration features.",
      imageUrl: "/images/task-app.jpg",
      tags: ["React", "Firebase", "Material UI"],
      demoUrl: "https://tasks.example.com",
      githubUrl: "https://github.com/yourusername/task-manager"
    },
    // Add more projects as needed
  ];
  
  // Get all unique tags for filter buttons
  const allTags = ['All', ...Array.from(new Set(projects.flatMap(project => project.tags)))];
  
  // Filter projects when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => 
        project.tags.includes(activeFilter)
      ));
    }
  }, [activeFilter]);
  
  // Start animations when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  const titleVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <Section 
      id="projects"
      className={className}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <BackgroundPattern />
      <ContentContainer>
        <SectionTitle variants={titleVariants}>
          My Projects
        </SectionTitle>
        
        <FilterContainer variants={itemVariants}>
          {allTags.map((tag, index) => (
            <FilterButton
              key={index}
              active={activeFilter === tag}
              onClick={() => setActiveFilter(tag)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </FilterButton>
          ))}
        </FilterContainer>
        
        <ProjectsContainer variants={containerVariants}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          ) : (
            <EmptyState variants={itemVariants}>
              No projects found with the selected filter.
            </EmptyState>
          )}
        </ProjectsContainer>
      </ContentContainer>
    </Section>
  );
};

export default ProjectsSection;