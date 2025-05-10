import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface KeyValueGridProps {
  data: { key: string; value: string }[];
  className?: string;
  style?: React.CSSProperties;
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const KeyValueGrid: React.FC<KeyValueGridProps> = ({ data, className = "", style = {} }) => {
  return (
    <div
      className={`key-value-grid ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "1rem",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "1rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        padding: "2rem",
        ...style
      }}
    >
      <AnimatePresence>
        {data.map((item, idx) => (
          <React.Fragment key={item.key + item.value}>
            <motion.div
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              style={{
                fontWeight: 600,
                color: "#6c63ff",
                padding: "0.5rem 0",
                borderBottom: "1px solid rgba(108,99,255,0.1)",
                fontFamily: "Inter, sans-serif",
                fontSize: "1.1rem"
              }}
            >
              {item.key}
            </motion.div>
            <motion.div
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, delay: idx * 0.05 + 0.03 }}
              style={{
                color: "#fff",
                background: "rgba(108,99,255,0.07)",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                marginBottom: "0.25rem",
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem"
              }}
            >
              {item.value}
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default KeyValueGrid;