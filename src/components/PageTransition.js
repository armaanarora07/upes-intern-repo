import React from 'react';
import { motion } from 'framer-motion';

// Page transition wrapper with smooth fade-in and slide-up animation
// Similar to the animation used in Help section
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.25,
        ease: "easeOut"
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
