import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useUserStore } from "../store/userStore";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
}

export default function StudentAssignments() {
  const username = useUserStore((state) => state.username);
  if (!username) {
    return <div className="container py-4">Please log in to view your assignments.</div>;
  }
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const cached = localStorage.getItem("studentAssignments");
        if (cached) setAssignments(JSON.parse(cached));

        const res = await api.get(`/assignments/${username}`);
        setAssignments(res.data);
        localStorage.setItem("studentAssignments", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to load assignments", err);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [username]);

  return (
    <div className="container py-4">
      <h2 className="text-primary text-center mb-4 ">Assignments</h2>
      {loading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="text-muted">No assignments assigned yet.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {assignments.map((a) => (
            <div key={a._id} className="col">
              <div className="card border-info shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-info">{a.title}</h5>
                  <p className="card-text text-white">{a.description}</p>
                  <a
                    href={a.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    📎 View File
                  </a>
                  <p className="text-white mt-2">
                    Assigned on {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
