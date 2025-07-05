// src/components/ThreadCard.tsx
import { useNavigate } from "react-router-dom";

const ThreadCard = ({ thread }: { thread: any }) => {
  const navigate = useNavigate();

  return (
    <div className="card mb-3 bg-light text-dark p-3 shadow-sm rounded">
      <h5>{thread.title}</h5>
      <p className="text-muted small">Started by {thread.createdBy}</p>
      <p className="small text-truncate">{thread.comments?.[0]?.content}</p>
      <button
        onClick={() => navigate(`/discussion/thread/${thread._id}`)}
        className="btn btn-outline-primary btn-sm mt-2"
      >
        View Thread
      </button>
    </div>
  );
};

export default ThreadCard;
