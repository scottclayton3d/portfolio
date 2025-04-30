import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Define TypeScript interfaces
interface ProjectProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

interface ProjectCardProps {
  project: ProjectProps;
}

const Card = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Overlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), transparent);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transform: translateY(70%);
  transition: transform 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  
  ${Card}:hover & {
    transform: translateY(0);
  }
`;

const Title = styled(motion.h3)`
  color: white;
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Description = styled(motion.p)`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.4s ease 0.1s;
  
  ${Card}:hover & {
    max-height: 100px;
    opacity: 1;
    margin-bottom: 15px;
  }
`;

const Tags = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 8px;
`;

const Tag = styled(motion.span)`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-top: 15px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease 0.2s;
  
  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Button = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  svg {
    margin-right: 6px;
  }
`;

const Spotlight = styled(motion.div)`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const tagVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.3
      }
    })
  };
  
  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <ProjectImage src={project.imageUrl} alt={project.title} />
      
      <Spotlight 
        style={{ 
          left: mousePosition.x - 75, 
          top: mousePosition.y - 75 
        }} 
      />
      
      <Overlay>
        <Title
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {project.title}
        </Title>
        
        <Description>{project.description}</Description>
        
        <Tags>
          <AnimatePresence>
            {project.tags.map((tag, index) => (
              <Tag 
                key={index}
                custom={index}
                variants={tagVariants}
                initial="hidden"
                animate={isHovered ? "visible" : "hidden"}
              >
                {tag}
              </Tag>
            ))}
          </AnimatePresence>
        </Tags>
        
        <ButtonsContainer>
          {project.demoUrl && (
            <Button 
              href={project.demoUrl} 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="white"/>
              </svg>
              Demo
            </Button>
          )}
          
          {project.githubUrl && (
            <Button 
              href={project.githubUrl} 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.52 21.272 9.52 21.008C9.52 20.768 9.512 20.058 9.508 19.192C6.726 19.8 6.139 17.782 6.139 17.782C5.685 16.642 5.028 16.334 5.028 16.334C4.132 15.728 5.097 15.74 5.097 15.74C6.094 15.809 6.628 16.757 6.628 16.757C7.52 18.266 8.97 17.829 9.54 17.575C9.629 16.928 9.889 16.492 10.175 16.241C7.954 15.988 5.62 15.131 5.62 11.288C5.62 10.171 6.01 9.262 6.647 8.555C6.547 8.303 6.203 7.378 6.747 6.038C6.747 6.038 7.586 5.772 9.497 7.031C10.295 6.81 11.15 6.699 12 6.695C12.85 6.699 13.705 6.81 14.504 7.031C16.414 5.772 17.251 6.038 17.251 6.038C17.797 7.378 17.453 8.303 17.353 8.555C17.991 9.262 18.379 10.171 18.379 11.288C18.379 15.142 16.041 15.984 13.813 16.232C14.172 16.541 14.499 17.153 14.499 18.094C14.499 19.444 14.487 20.679 14.487 21.008C14.487 21.275 14.665 21.587 15.173 21.489C19.135 20.162 22 16.417 22 12C22 6.477 17.523 2 12 2Z" fill="white"/>
              </svg>
              Code
            </Button>
          )}
        </ButtonsContainer>
      </Overlay>
    </Card>
  );
};

export default ProjectCard;