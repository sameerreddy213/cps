// client/src/components/QuizCard.tsx
import LoadingSpinner from "./LoadingSpinner";
import { motion } from "framer-motion";
import { Target, Play } from "lucide-react";

interface QuizCardProps {
  topic: string;
  onTakeQuiz: (topic: string) => void;
  isLoading?: boolean;
}

const QuizCard = ({ topic, onTakeQuiz, isLoading }: QuizCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      className="card bg-gradient-secondary border-0 shadow-lg h-100 clickable-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => !isLoading && onTakeQuiz(topic)}
      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
    >
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <div className="text-center mb-3">
          <motion.div
            className="mb-3"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Target size={40} className="text-primary" />
          </motion.div>
          <h4 className="card-title text-primary fw-bold mb-2 fs-5">{topic}</h4>
          <p className="card-text text-secondary fs-6 mb-0">
            Test your knowledge and track your progress
          </p>
        </div>

        <motion.div
          className="mt-auto"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onTakeQuiz(topic);
            }}
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="d-flex align-items-center">
                <LoadingSpinner size="sm" />
                <span className="ms-2">Loading...</span>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <Play size={18} className="me-2" />
                Take Quiz
              </div>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >

        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuizCard;