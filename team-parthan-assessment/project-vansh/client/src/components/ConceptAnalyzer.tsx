// components/ConceptAnalyzer.tsx
import React from "react";

type Concepts = {
  mainTopic: string[];
  prerequisites: string[];
};

interface Props {
  file: File | null;
  typeofinput: string;
  concepts: Concepts | null;
  setConcepts: (c: Concepts | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

const ConceptAnalyzer: React.FC<Props> = ({
  file,
  typeofinput,
  concepts,
  setConcepts,
  loading,
  setLoading,
}) => {
  const handleAnalyze = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("typeofinput", typeofinput);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to analyze file");
      const data = await res.json();
      console.log(data);
      setConcepts(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        disabled={!file || loading}
        onClick={handleAnalyze}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors mb-4"
      >
        {loading ? "Analyzing..." : "Get concepts"}
      </button>

      {concepts && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-bold mb-2">Concepts Extracted:</h4>
          <div className="mb-2">
            <strong>Main Topics:</strong>
            <ul className="list-disc list-inside text-gray-700">
              {concepts.mainTopic.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Prerequisites:</strong>
            <ul className="list-disc list-inside text-gray-700">
              {concepts.prerequisites.map((pre, idx) => (
                <li key={idx}>{pre}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ConceptAnalyzer;
