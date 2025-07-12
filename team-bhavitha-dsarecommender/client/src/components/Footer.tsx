import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail, BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.footer
      className="bg-gradient-secondary border-top border-dark-border mt-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container py-5">
        <div className="row">
          <motion.div className="col-lg-4 mb-4" variants={itemVariants}>
            <div className="d-flex align-items-center mb-3">
              <BookOpen size={32} className="text-primary me-2" />
              <h5 className="text-gradient fw-bold mb-0">LearnFlow</h5>
            </div>

            <div className="d-flex gap-3">
              <motion.a
                href="#"
                className="text-secondary"
                whileHover={{ scale: 1.1, color: "var(--primary-purple)" }}
                transition={{ duration: 0.2 }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-secondary"
                whileHover={{ scale: 1.1, color: "var(--primary-purple)" }}
                transition={{ duration: 0.2 }}
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-secondary"
                whileHover={{ scale: 1.1, color: "var(--primary-purple)" }}
                transition={{ duration: 0.2 }}
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div className="col-lg-2 col-md-6 mb-4" variants={itemVariants}>
            <h6 className="text-primary fw-bold mb-3">Features</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Personalized Learning
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Adaptive Quizzes
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Progress Tracking
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Knowledge Graph
                </motion.a>
              </li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-md-6 mb-4" variants={itemVariants}>
            <h6 className="text-primary fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Documentation
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  API Reference
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Tutorials
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Support
                </motion.a>
              </li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-md-6 mb-4" variants={itemVariants}>
            <h6 className="text-primary fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  About Us
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Careers
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Privacy Policy
                </motion.a>
              </li>
              <li className="mb-2">
                <motion.a
                  href="#"
                  className="text-secondary text-decoration-none"
                  whileHover={{ x: 5, color: "var(--primary-purple)" }}
                  transition={{ duration: 0.2 }}
                >
                  Terms of Service
                </motion.a>
              </li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-md-6 mb-4" variants={itemVariants}>
            <h6 className="text-primary fw-bold mb-3">Stats</h6>
            
          </motion.div>
        </div>

        <motion.div
          className="border-top border-dark-border pt-4 mt-4"
          variants={itemVariants}
        >
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-secondary mb-0">
                © {currentYear} LearnFlow. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
                               <p className="text-secondary mb-0">
                   Made with <Heart size={16} className="text-danger mx-1" />
                 </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
