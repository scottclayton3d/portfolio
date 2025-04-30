import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

export type Tag = string;

export interface ProjectCardProps {
  /** Project title (displayed in overlay) */
  title: string;
  /** Image/Video source url – ignored when `customMedia` is provided */
  cover?: string;
  /** 1–2 line description */
  description?: string;
  /** CTA button label (e.g. “View project”) */
  ctaLabel?: string;
  /** Destination URL for the CTA */
  ctaHref?: string;
  /** Treat `cover` as video rather than image */
  isVideo?: boolean;
  /** Extra className if you want to compose styles */
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  cover = "",
  description,
  ctaLabel = "View project",
  ctaHref = "#",
  isVideo = false,
  className = "",
}) => {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      glareEnable
      className={className}
    >
      <motion.article
        className="project-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* MEDIA ************************************** */}
        <div className="media">
          {isVideo ? (
            <video
              src={cover}
              autoPlay
              muted
              loop
              playsInline
              typeof="video/mp4"
            />
          ) : (
            <img src={cover} alt={`${title} cover`} loading="lazy" />
          )}
        </div>

        {/* OVERLAY ************************************ */}
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h3>{title}</h3>

          {description && <p className="blurb">{description}</p>}

          <a
            href={ctaHref}
            className="cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctaLabel}
          </a>
        </motion.div>
      </motion.article>
    </Tilt>
  );
};

export default ProjectCard;