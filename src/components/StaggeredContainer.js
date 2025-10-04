import React from 'react';
import { motion } from 'framer-motion';

/**
 * StaggeredContainer Component
 * 
 * Wraps children and animates them with staggered delays for a professional,
 * smooth content reveal. Perfect for business applications with data-heavy pages.
 * 
 * @param {ReactNode} children - Content to be animated
 * @param {number} staggerDelay - Delay between each child animation (default: 0.08s)
 * @param {number} initialDelay - Initial delay before first animation starts (default: 0s)
 * @param {string} className - Additional CSS classes
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Delay between each child (reduced from 0.08)
      delayChildren: 0.05, // Initial delay before first child (reduced from 0.1)
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const StaggeredContainer = ({ 
  children, 
  staggerDelay = 0.05, 
  initialDelay = 0.05,
  className = "" 
}) => {
  // Custom variants with user-provided delays
  const customContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      }
    }
  };

  return (
    <motion.div
      variants={customContainerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggeredItem Component
 * 
 * Individual item to be animated within StaggeredContainer.
 * Use this to wrap each element you want to animate with stagger effect.
 */
export const StaggeredItem = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default StaggeredContainer;
