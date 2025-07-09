import React from "react";

type Props = {
  history: Record<string, {
    strongConcepts: string[];
    weakConcepts: string[];
    recommendedConcepts: string[];
  }>;
};

const AttemptHistory = ({ history }: Props) => {
  if (Object.keys(history).length === 0)
    return <p className="text-gray-600">Play and Know...</p>;

  return (
    <div className="space-y-4">
      {Object.entries(history).map(([concept, result]) => (
        <div key={concept} className="bg-gray-50 p-4 rounded border">
          <h4 className="font-bold text-indigo-700 mb-1">{concept}</h4>
          <p className="text-sm">
            <strong>✅ Strong:</strong> {result.strongConcepts.join(", ") || "None"}
          </p>
          <p className="text-sm">
            <strong>❌ Weak:</strong> {result.weakConcepts.join(", ") || "None"}
          </p>
          <p className="text-sm">
            <strong>📌 Recommended:</strong> {result.recommendedConcepts.join(", ") || "None"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AttemptHistory;
