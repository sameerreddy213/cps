import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useUserStore } from "../store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Calendar, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  BookOpen,
  Award
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
  status?: 'pending' | 'completed' | 'overdue';
  dueDate?: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function StudentAssignments() {
  const username = useUserStore((state) => state.username);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const cached = localStorage.getItem("studentAssignments");
        if (cached) setAssignments(JSON.parse(cached));

        const res = await api.get(`/assignments/${username}`);
        // Add mock data for demonstration
        const enhancedAssignments = res.data.map((assignment: Assignment) => ({
          ...assignment,
          status: Math.random() > 0.5 ? 'pending' : 'completed',
          dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          subject: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'][Math.floor(Math.random() * 4)],
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
        }));
        setAssignments(enhancedAssignments);
        localStorage.setItem("studentAssignments", JSON.stringify(enhancedAssignments));
      } catch (err) {
        console.error("Failed to load assignments", err);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [username]);

  if (!username) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          <AlertCircle className="me-2" />
          Please log in to view your assignments.
        </div>
      </div>
    );
  }

  const filteredAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || assignment.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "dueDate":
          return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "subject":
          return (a.subject || "").localeCompare(b.subject || "");
        default:
          return 0;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge bg-success"><CheckCircle size={12} className="me-1" />Completed</span>;
      case 'pending':
        return <span className="badge bg-warning"><Clock size={12} className="me-1" />Pending</span>;
      case 'overdue':
        return <span className="badge bg-danger"><AlertCircle size={12} className="me-1" />Overdue</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="badge bg-success">Easy</span>;
      case 'medium':
        return <span className="badge bg-warning">Medium</span>;
      case 'hard':
        return <span className="badge bg-danger">Hard</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading your assignments..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 assignments-page" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh'
    }}>
      <style>{`
        .assignments-page .form-control, 
        .assignments-page .form-select {
          background-color: #1e293b !important;
          border-color: #8b5cf6 !important;
          color: #ffffff !important;
        }
        .assignments-page .form-control:focus, 
        .assignments-page .form-select:focus {
          background-color: #1e293b !important;
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25) !important;
          color: #ffffff !important;
        }
        .assignments-page .form-control::placeholder {
          color: #94a3b8 !important;
        }
        .assignments-page .form-select option {
          background-color: #1e293b;
          color: #ffffff;
        }
      `}</style>
      {/* Header Section */}
      <motion.div 
        className="text-center mb-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="d-flex align-items-center justify-content-center mb-3">
          <BookOpen size={40} className="text-primary me-3" />
          <h1 className="display-4 fw-bold text-gradient mb-0">My Assignments</h1>
        </div>
        <p className="text-white-50 fs-5">Track and manage your learning assignments</p>
        
        {/* Stats Cards */}
        <div className="row justify-content-center mt-4">
          <div className="col-6 col-md-3 mb-3">
            <motion.div 
              className="card border-primary border-2 text-center p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-primary fw-bold">{assignments.length}</h3>
              <p className="text-white-50 mb-0">Total Assignments</p>
            </motion.div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <motion.div 
              className="card border-success border-2 text-center p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-success fw-bold">
                {assignments.filter(a => a.status === 'completed').length}
              </h3>
              <p className="text-white-50 mb-0">Completed</p>
            </motion.div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <motion.div 
              className="card border-warning border-2 text-center p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-warning fw-bold">
                {assignments.filter(a => a.status === 'pending').length}
              </h3>
              <p className="text-white-50 mb-0">Pending</p>
            </motion.div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <motion.div 
              className="card border-danger border-2 text-center p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-danger fw-bold">
                {assignments.filter(a => a.status === 'overdue').length}
              </h3>
              <p className="text-white-50 mb-0">Overdue</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        className="row justify-content-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
          <div className="card border-primary border-2 p-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-dark border-primary">
                    <Search size={18} className="text-primary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-primary"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select border-primary"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select border-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="subject">Sort by Subject</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assignments Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="row justify-content-center"
      >
        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
          {filteredAssignments.length === 0 ? (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Award size={80} className="text-white-50 mb-3" />
              <h3 className="text-white-50">No assignments found</h3>
              <p className="text-white-50">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "You don't have any assignments yet. Check back later!"}
              </p>
            </motion.div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <AnimatePresence>
                {filteredAssignments.map((assignment) => (
                  <motion.div
                    key={assignment._id}
                    className="col"
                    variants={itemVariants}
                    layout
                  >
                    <motion.div
                      className="card border-primary border-2 shadow-lg h-100"
                      variants={cardVariants}
                      whileHover="hover"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowModal(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title text-primary fw-bold mb-0">
                            {assignment.title}
                          </h5>
                          {getStatusBadge(assignment.status || 'pending')}
                        </div>
                        
                        <p className="card-text text-white-50 flex-grow-1">
                          {assignment.description}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <small className="text-white-50 d-flex align-items-center">
                                <Calendar size={14} className="me-1" />
                                Assigned: {new Date(assignment.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            {assignment.dueDate && (
                              <div className="col-6">
                                <small className={`d-flex align-items-center ${isOverdue(assignment.dueDate) ? 'text-danger' : 'text-white-50'}`}>
                                  <Clock size={14} className="me-1" />
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </small>
                              </div>
                            )}
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                              {assignment.subject && (
                                <span className="badge bg-info">{assignment.subject}</span>
                              )}
                              {assignment.difficulty && getDifficultyBadge(assignment.difficulty)}
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(assignment.fileUrl, '_blank');
                                }}
                              >
                                <Eye size={14} className="me-1" />
                                View
                              </button>
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const link = document.createElement('a');
                                  link.href = assignment.fileUrl;
                                  link.download = assignment.title;
                                  link.click();
                                }}
                              >
                                <Download size={14} className="me-1" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Assignment Detail Modal */}
      {showModal && selectedAssignment && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark border-primary border-2">
              <div className="modal-header border-primary">
                <h5 className="modal-title text-primary fw-bold">
                  <FileText className="me-2" />
                  {selectedAssignment.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-primary">Description</h6>
                                         <p className="text-white-50">{selectedAssignment.description}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary">Details</h6>
                    <div className="d-flex flex-column gap-2">
                                             <div className="d-flex justify-content-between">
                         <span className="text-white-50">Status:</span>
                         {getStatusBadge(selectedAssignment.status || 'pending')}
                       </div>
                       <div className="d-flex justify-content-between">
                         <span className="text-white-50">Subject:</span>
                         <span className="text-white">{selectedAssignment.subject || 'N/A'}</span>
                       </div>
                       <div className="d-flex justify-content-between">
                         <span className="text-white-50">Difficulty:</span>
                         {selectedAssignment.difficulty && getDifficultyBadge(selectedAssignment.difficulty)}
                       </div>
                       <div className="d-flex justify-content-between">
                         <span className="text-white-50">Assigned:</span>
                         <span className="text-white">{new Date(selectedAssignment.createdAt).toLocaleDateString()}</span>
                       </div>
                      {selectedAssignment.dueDate && (
                                                 <div className="d-flex justify-content-between">
                           <span className="text-white-50">Due Date:</span>
                           <span className={isOverdue(selectedAssignment.dueDate) ? 'text-danger' : 'text-white'}>
                             {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                           </span>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => window.open(selectedAssignment.fileUrl, '_blank')}
                  >
                    <Eye className="me-2" />
                    View Assignment
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedAssignment.fileUrl;
                      link.download = selectedAssignment.title;
                      link.click();
                    }}
                  >
                    <Download className="me-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
