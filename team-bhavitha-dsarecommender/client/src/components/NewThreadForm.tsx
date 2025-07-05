// src/components/NewThreadForm.tsx
import { useState } from "react";
import { api } from "../lib/api";
import { useUserStore } from "../store/userStore";

const NewThreadForm = ({ onNewThread }: { onNewThread: (t: any) => void }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const username = useUserStore((state) => state.username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/discuss/general", {
        title,
        createdBy: username,
        content,
      });
      onNewThread(res.data);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4 className="text-white">Start a General Discussion</h4>
      <input
        type="text"
        className="form-control my-2"
        placeholder="Thread Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="form-control mb-2"
        placeholder="Your comment to start the discussion"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-success">
        Start Discussion
      </button>
    </form>
  );
};

export default NewThreadForm;
