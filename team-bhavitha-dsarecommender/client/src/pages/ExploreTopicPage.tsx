// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const ExploreTopicPage = () => {
//   const { topic } = useParams<{ topic: string }>();
//   const [concept, setConcept] = useState<any>(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!topic) return;

//     axios
//       .get(`/api/explore/${encodeURIComponent(topic)}`)
//       .then((res) => {
//         setConcept(res.data);
//         setError(""); // clear previous error
//       })
//       .catch((err) => {
//         console.error("Error fetching concept:", err);
//         setError("⚠️ Could not load topic information.");
//         setConcept(null);
//       });
//   }, [topic]);

//   if (error) return <p style={{ color: "red" }}>{error}</p>;
//   if (!concept) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
//       <h2>{concept.name}</h2>
//       <p><strong>Description:</strong> {concept.description}</p>
//       <p><strong>Spotlight Fact:</strong> {concept.spotlight_fact}</p>
//       <p><strong>Appears in Lecture:</strong> {concept.lecture}</p>
//     </div>
//   );
// };

// export default ExploreTopicPage;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Concept {
  name: string;
  description: string;
  spotlight_fact: string;
  lecture: string;
  examples?: string[];
  related_topics?: string[];
  quiz_available?: boolean;
}

const ExploreTopicPage = () => {
  const { topic } = useParams<{ topic: string }>();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/api/explore/${encodeURIComponent(topic || "")}`)
      .then((res) => setConcept(res.data))
      .catch((err) => {
        console.error("Error fetching concept:", err);
        setError("Couldn't load concept information.");
      });
  }, [topic]);

  if (error) return <p>{error}</p>;
  if (!concept) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2 className="text-3xl font-bold mb-4">{concept.name}</h2>

      <p><strong>Description:</strong> {concept.description}</p>
      <p><strong>Spotlight Fact:</strong> {concept.spotlight_fact}</p>
      <p><strong>Appears in Lecture:</strong> {concept.lecture}</p>

      {concept.examples && concept.examples.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Examples:</strong>
          <ul style={{ paddingLeft: "1.5rem" }}>
            {concept.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}

      {concept.related_topics && concept.related_topics.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Related Topics:</strong>
          <ul style={{ paddingLeft: "1.5rem" }}>
            {concept.related_topics.map((related, i) => (
              <li key={i}>{related}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <strong>Quiz Available:</strong>{" "}
        <span style={{ color: concept.quiz_available ? "green" : "red" }}>
          {concept.quiz_available ? "Yes" : "No"}
        </span>
      </div>
    </div>
  );
};

export default ExploreTopicPage;
