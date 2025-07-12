// client/src/components/LearnedConceptCard.tsx
import React from 'react';
import { BookOpen, Code, FlaskConical, Calculator, BrainCircuit, Lightbulb, GraduationCap, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface LearnedConceptCardProps {
  title: string;
  quizScores?: { score: number; date: string }[];
}

// A simple map for topic-to-icon. Expand this as needed.
const topicIcons: { [key: string]: React.ElementType } = {
  'Python Basics': Code,
  'Data Structures': BrainCircuit,
  'Algorithms': Lightbulb,
  'Calculus': Calculator,
  'Chemistry': FlaskConical,
  'Physics': GraduationCap,
  // Add more mappings for your validTopics
};

const LearnedConceptCard = ({ title, quizScores }: LearnedConceptCardProps) => {
  const IconComponent = topicIcons[title] || BookOpen;
  const lastScore = quizScores && quizScores.length > 0 ? quizScores[quizScores.length - 1].score : null;

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

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    if (score >= 70) return "text-info";
    return "text-secondary";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return Award;
    if (score >= 80) return TrendingUp;
    return CheckCircle;
  };

  return (
    <motion.div
      className="card bg-gradient-secondary border-0 shadow-lg h-100 learned-concept-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >

      <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
        <motion.div 
          className="mb-3"
          variants={iconVariants}
          whileHover="hover"
        >
          <IconComponent size={48} className="text-primary" />
        </motion.div>
        
        <h4 className="card-title text-primary fw-bold mb-3 fs-6">{title}</h4>
        
        <div className="d-flex align-items-center mb-3">
          <CheckCircle size={20} className="text-success me-2" />
          <span className="text-success fw-semibold">Completed</span>
        </div>

        {lastScore && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`d-flex align-items-center justify-content-center mb-2 ${getScoreColor(lastScore)}`}>
              {React.createElement(getScoreIcon(lastScore), { size: 16, className: "me-2" })}
              <span className="fw-bold">Last Score: {lastScore.toFixed(0)}%</span>
            </div>
            
            <div className="progress" style={{ height: '8px' }}>
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${lastScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="badge bg-success text-white">
            <Award size={14} className="me-1" />
            Mastered
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LearnedConceptCard;