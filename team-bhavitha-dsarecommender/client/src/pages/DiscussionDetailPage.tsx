// src/pages/DiscussionDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import LoadingWithQuote from "../components/LoadingWithQuotes";
import { useUserStore } from "../store/userStore";
import { Trash2 } from "lucide-react";

interface Reply {
  _id: string;
  username: string;
  role?: string;
  text: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  username: string;
  role?: string;
  text: string;
  createdAt: string;
  replies?: Reply[];
}

interface DiscussionThread {
  _id: string;
  title?: string;
  question?: string;
  topic?: string;
  createdBy?: string;
  createdAt: string;
  comments: Comment[];
}

const DiscussionDetailPage = () => {
  const username = useUserStore((state) => state.username);
  const userRole = useUserStore((state) => state.role);
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<DiscussionThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState<{ [commentId: string]: string }>({});

  const fetchThread = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/discuss/thread/${id}`);
      setThread(res.data);
    } catch (err) {
      console.error("Error fetching thread:", err);
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        alert((err as any).response?.data?.error || "Failed to load thread");
      } else {
        alert("Failed to load thread");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!username) return alert("You must be logged in to comment.");
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/discuss/thread/${id}/comment`, {
        username,
        text: newComment,
        // Optional: Add role if backend doesn't attach it
        role: userRole
      });
      setNewComment("");
      fetchThread(); // Refresh thread
    } catch (err) {
      console.error("Error submitting comment:", err);
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        alert((err as any).response?.data?.error || "Failed to submit comment");
      } else {
        alert("Failed to submit comment");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    const replyText = replyTextMap[commentId];
    if (!username) return alert("You must be logged in to reply.");
    if (!replyText?.trim()) return;

    try {
      await api.post(`/discuss/${id}/comment/${commentId}/reply`, {
        username,
        text: replyText,
        // Optional: Add role if backend doesn't attach it
        role: userRole
      });
      setReplyTextMap((prev) => ({ ...prev, [commentId]: "" }));
      fetchThread(); // Refresh thread
    } catch (err) {
      console.error("Error submitting reply:", err);
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        alert((err as any).response?.data?.error || "Failed to submit reply");
      } else {
        alert("Failed to submit reply");
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await api.delete(`/discuss/thread/${id}/comment/${commentId}`);
      // Optimistic update
      setThread(prev => prev ? {
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      } : null);
    } catch (err) {
      console.error("Failed to delete comment", err);
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        alert((err as any).response?.data?.error || "Failed to delete comment");
      } else {
        alert("Failed to delete comment");
      }
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    
    try {
      await api.delete(
        `/discuss/thread/${id}/comment/${commentId}/reply/${replyId}`
      );
      // Optimistic update
      setThread(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: prev.comments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                replies: comment.replies?.filter(r => r._id !== replyId)
              };
            }
            return comment;
          })
        };
      });
    } catch (err) {
      console.error("Failed to delete reply", err);
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        alert((err as any).response?.data?.error || "Failed to delete reply");
      } else {
        alert("Failed to delete reply");
      }
    }
  };

  if (loading) return <LoadingWithQuote />;
  if (!thread) return <div className="text-center text-danger">Thread not found.</div>;

  return (
    <div className="container py-5 text-white">
      <div className="bg-dark p-4 rounded shadow">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary mb-0">{thread.title || "Discussion"}</h2>
          {userRole === 'educator' && (
            <span className="badge bg-info">Educator Mode</span>
          )}
        </div>
        
        <p className="text-muted mb-4">{thread.question}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-secondary">
            Started by {thread.createdBy || "Anonymous"} on{" "}
            {new Date(thread.createdAt).toLocaleString()}
          </small>
        </div>

        <hr className="my-4 border-secondary" />

        <h4 className="mb-3">💬 Comments</h4>
        <div className="mb-5">
          {thread.comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first to reply!</p>
          ) : (
            thread.comments.map((c) => (
              <div key={c._id} className="mb-4 p-3 bg-light text-dark rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-semibold d-flex align-items-center">
                      <span>{c.username}</span>
                      {/* Role badge for comment author */}
                      {c.role === 'educator' ? (
                        <span className="badge bg-info ms-2">Educator</span>
                      ) : c.role ? (
                        <span className="badge bg-secondary ms-2">{c.role}</span>
                      ) : (
                        <span className="badge bg-secondary ms-2">Student</span>
                      )}
                    </div>
                    <p className="mb-1 mt-2">{c.text}</p>
                  </div>
                  
                  <div className="d-flex flex-column align-items-end">
                    <small className="text-muted">
                      {new Date(c.createdAt).toLocaleString()}
                    </small>
                    {/* Delete button for educators */}
                    {userRole === 'educator' && (
                      <button
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => handleDeleteComment(c._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {(c.replies?.length ?? 0) > 0 && (
                  <div className="mt-3 ps-3 border-start border-secondary">
                    {c.replies!.map((r) => (
                      <div key={r._id} className="mt-3 p-2 bg-white rounded">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="d-flex align-items-center">
                              <strong>{r.username}</strong>
                              {/* Role badge for reply author */}
                              {r.role === 'educator' ? (
                                <span className="badge bg-info ms-2"></span>
                              ) : r.role ? (
                                <span className="badge bg-secondary ms-2">{r.role}</span>
                              ) : (
                                <span className="badge bg-secondary ms-2"></span>
                              )}
                            </div>
                            <p className="mb-1 mt-1">{r.text}</p>
                            <small className="text-muted">
                              {new Date(r.createdAt).toLocaleString()}
                            </small>
                          </div>
                          {/* Delete button for educators */}
                          {userRole === 'educator' && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteReply(c._id, r._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="mt-3">
                  <textarea
                    rows={2}
                    className="form-control mb-2"
                    placeholder="Reply to this comment..."
                    value={replyTextMap[c._id] || ""}
                    onChange={(e) =>
                      setReplyTextMap((prev) => ({ ...prev, [c._id]: e.target.value }))
                    }
                  />
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      disabled={!replyTextMap[c._id]?.trim()}
                      onClick={() => handleReplySubmit(c._id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Comment Input */}
        <div className="bg-white text-dark rounded p-4 shadow-sm">
          <h5 className="mb-3">📝 Add a Comment</h5>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="form-control mb-3"
            placeholder="Type your response..."
          />
          <div className="d-flex justify-content-end">
            <button
              onClick={handleCommentSubmit}
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailPage;