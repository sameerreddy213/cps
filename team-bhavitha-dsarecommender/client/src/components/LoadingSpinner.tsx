// client/src/components/LoadingSpinner.tsx
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  message?:string;
}

const LoadingSpinner = ({ size = "md", text, className = "" }: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <motion.div
        variants={spinnerVariants}
        animate="animate"
      >
        <Loader2 size={sizeMap[size]} className="text-primary" />
      </motion.div>
      {text && (
        <motion.span
          className="ms-2 text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
};

export default LoadingSpinner;