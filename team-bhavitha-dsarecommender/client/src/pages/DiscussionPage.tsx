import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import StartDiscussionModal from "../components/DiscussModal";

interface Comment {
  _id: string;
  username: string;
  text: string;
  role?: string;
  createdAt: string;
  replies: {
    _id: string;
    username: string;
    text: string;
    role?: string;
    createdAt: string;
  }[];
}

interface Thread {
  _id: string;
  isGeneral: boolean;
  topic?: string;
  questionIndex?: number;
  questionText?: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const Discuss = () => {
  const username = useUserStore((state) => state.username);
  const userRole = useUserStore((state) => state.role);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [replyBox, setReplyBox] = useState<{ [commentId: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/discuss/all");
      setThreads(res.data.threads);
    } catch (err) {
      console.error("Error fetching threads", err);
      setError("Failed to load discussions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


const handleDeleteComment = async (threadId: string, commentId: string) => {
  if (!window.confirm("Are you sure you want to delete this comment?")) return;

  const { username, role } = useUserStore.getState();

  try {
    await api.delete(`/discuss/thread/${threadId}/comment/${commentId}`, {
      data: { username, role },
    });

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread._id === threadId) {
          return {
            ...thread,
            comments: thread.comments.filter((c) => c._id !== commentId),
          };
        }
        return thread;
      })
    );
  } catch (err) {
    console.error("Failed to delete comment", err);
    const errorMessage =
      (err as any)?.response?.data?.error || "Only educators or comment owners can delete this comment.";
    alert(errorMessage);
  }
};



  const handleDeleteReply = async (
    threadId: string,
    commentId: string,
    replyId: string
  ) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    const { username, role } = useUserStore.getState();
    try {
      await api.delete(`/discuss/thread/${threadId}/comment/${commentId}/reply/${replyId}`,{
        data: { username, role }
      });
      // Optimistic update
      setThreads(prev => prev.map(thread => {
        if (thread._id === threadId) {
          return {
            ...thread,
            comments: thread.comments.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.filter(r => r._id !== replyId)
                };
              }
              return comment;
            })
          };
        }
        return thread;
      }));
    } catch (err) {
      console.error("Failed to delete reply", err);
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "error" in err.response.data) {
        alert((err as any).response.data.error);
      } else {
        alert("Only educators can delete replies");
      }
    }
  };

  const handleReply = async (threadId: string, commentId: string) => {
    const text = replyBox[commentId];
    if (!text.trim() || !username) return;

    // Declare tempReplyId outside try-catch so it's accessible in both
    const tempReplyId = `temp-${Date.now()}`;

    try {
      // Create optimistic reply
      setThreads(prev => prev.map(thread => {
        if (thread._id === threadId) {
          return {
            ...thread,
            comments: thread.comments.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    {
                      _id: tempReplyId,
                      username,
                      text,
                      role: userRole,
                      createdAt: new Date().toISOString()
                    }
                  ]
                };
              }
              return comment;
            })
          };
        }
        return thread;
      }));

      // Clear reply box immediately
      setReplyBox(prev => ({ ...prev, [commentId]: "" }));

      // Send actual request
      await api.post(`/discuss/${threadId}/comment/${commentId}/reply`, {
        username,
        text,
        role: userRole
      });

      // Refresh data to get actual ID from server
      fetchThreads();
    } catch (err) {
      console.error("Reply failed", err);
      // Revert optimistic update
      setThreads(prev => prev.map(thread => {
        if (thread._id === threadId) {
          return {
            ...thread,
            comments: thread.comments.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.filter(r => r._id !== tempReplyId)
                };
              }
              return comment;
            })
          };
        }
        return thread;
      }));
      if (typeof err === "object" && err !== null && "response" in err && (err as any).response?.data?.error) {
        alert((err as any).response.data.error);
      } else {
        alert("Failed to post reply");
      }
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <div className="container py-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          {userRole === "educator" ? "👨‍🏫 Educator Dashboard" : "💬 Discussion Forum"}
        </h3>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          Start Discussion
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading discussions...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error} <button className="btn btn-sm btn-outline-light ms-2" onClick={fetchThreads}>Retry</button>
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-4">
          <h4>No discussions yet</h4>
          <p>Be the first to start a discussion!</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Start Discussion
          </button>
        </div>
      ) : (
        threads.map((thread) => (
          <div key={thread._id} className="mb-4 p-3 bg-dark border rounded shadow-sm">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/discuss/${thread._id}`)}
            >
              <h5 className="text-info mb-0">
                {thread.isGeneral ? "🌐 General Discussion" : `🔍 ${thread.topic}`}
              </h5>
              <small className="text-muted">
                {thread.comments.length} comments
              </small>
            </div>

            <p className="text-light mt-2 mb-1">
              {thread.isGeneral
                ? thread.comments[0]?.text?.slice(0, 80) + (thread.comments[0]?.text?.length > 80 ? "..." : "")
                : thread.questionText}
            </p>

            {thread.comments.map((comment) => (
              <div key={comment._id} className="bg-secondary p-2 rounded mb-2 mt-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center">
                      <strong className="text-white">{comment.username}</strong>
                      {comment.role === "educator" ? (
                        <span className="badge bg-info ms-2"></span>
                      ) : comment.role ? (
                        <span className="badge bg-secondary ms-2">{comment.role}</span>
                      ) : (
                        <span className="badge bg-secondary ms-2"></span>
                      )}
                    </div>
                    <p className="text-white mt-1">{comment.text}</p>
                  </div>
                  <div className="text-end">
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                    {userRole === "educator" && (
                      <button
                        className="btn btn-sm btn-danger ms-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteComment(thread._id, comment._id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-sm btn-outline-light mt-2 mb-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((prev) => ({
                      ...prev,
                      [comment._id]: !prev[comment._id],
                    }));
                  }}
                >
                  {expanded[comment._id] ? (
                    <>
                      <ChevronUp size={16} /> Hide Replies
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} /> View Replies ({comment.replies.length})
                    </>
                  )}
                </button>

                {expanded[comment._id] && (
                  <div className="ps-3 ms-3 border-start">
                    {comment.replies.length === 0 ? (
                      <p className="text-muted">No replies yet.</p>
                    ) : (
                      comment.replies.map((reply) => (
                        <div key={reply._id} className="bg-dark rounded p-2 mb-2">
                          <div className="d-flex justify-content-between">
                            <div>
                              <div className="d-flex align-items-center">
                                <strong className="text-info">{reply.username}</strong>
                                {reply.role === "educator" ? (
                                  <span className="badge bg-info ms-2">Educator</span>
                                ) : reply.role ? (
                                  <span className="badge bg-secondary ms-2">{reply.role}</span>
                                ) : (
                                  <span className="badge bg-secondary ms-2">Student</span>
                                )}
                              </div>
                              <p className="text-white mb-1 mt-1">{reply.text}</p>
                              <small className="text-muted">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            {userRole === "educator" && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleDeleteReply(thread._id, comment._id, reply._id)
                                }
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}

                    <textarea
                      rows={2}
                      className="form-control mb-2 mt-2"
                      placeholder="Write a reply..."
                      value={replyBox[comment._id] || ""}
                      onChange={(e) =>
                        setReplyBox((prev) => ({
                          ...prev,
                          [comment._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReply(thread._id, comment._id);
                      }}
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      <StartDiscussionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onRefresh={fetchThreads}
        username={username}
        userRole={userRole}
      />
    </div>
  );
};

export default Discuss;