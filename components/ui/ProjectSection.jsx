import React from 'react';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';

const ProjectsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 40px 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #ff8a00, #e52e71);
    border-radius: 2px;
  }
`;

const ProjectsSection = () => {
  // Example project data
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, product filtering, and payment processing.",
      imageUrl: "/images/ecommerce-project.jpg",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and styled-components. Features smooth animations and a clean, modern design.",
      imageUrl: "/images/portfolio-project.jpg",
      tags: ["React", "Styled Components", "Framer Motion"]
    },
    {
      id: 3,
      title: "Weather App",
      description: "A weather application that fetches real-time data from OpenWeatherMap API. Displays current weather and 5-day forecast.",
      imageUrl: "/images/weather-app.jpg",
      tags: ["JavaScript", "API", "CSS3"]
    },
    // Add more projects as needed
  ];

  return (
    <section id="projects">
      <SectionTitle>My Projects</SectionTitle>
      <ProjectsContainer>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectsContainer>
    </section>
  );
};

export default ProjectsSection;