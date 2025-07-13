// src/pages/AskQuestionPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import {api} from "../lib/api";
import {validTopics} from "../data/validTopic";

export default function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.username);

  const handleSubmit = async () => {
    if (!title || !body || !topic) {
      alert("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/discuss/ask", {
        userId: user,
        title,
        body,
        topic,
      });
      navigate(`/discuss/${res.data.threadId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to post question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>

      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Enter a clear, descriptive title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded mb-4 min-h-[150px]"
        placeholder="Explain your question clearly. You can mention what you've tried or where you're stuck."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded mb-4"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      >
        <option value="">Select related topic</option>
        {validTopics.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Posting..." : "Submit Question"}
      </button>
    </div>
  );
}
