import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [topic, setTopic] = useState("");
  const [model, setModel] = useState("gemma:2b");
  const [layout, setLayout] = useState("hierarchical");
  const [image, setImage] = useState("");
  const [jsonLink, setJsonLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8000/generate",
        { topic, model, layout },
        { responseType: "blob" }
      );
      const imageBlob = new Blob([response.data], { type: "image/png" });
      setImage(URL.createObjectURL(imageBlob));

      const jsonRes = await axios.get("http://localhost:8000/download_json", {
        responseType: "blob",
      });
      const jsonBlob = new Blob([jsonRes.data], { type: "application/json" });
      setJsonLink(URL.createObjectURL(jsonBlob));
    } catch (err) {
      setError("Something went wrong while generating the graph.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center px-4 py-8 font-sans">
      <motion.h1
        className="text-5xl font-extrabold text-blue-800 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📘 Prerequisite Graph Generator
      </motion.h1>

      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Enter Course Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Thermodynamics"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Model:
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            >
              <option value="gemma:2b">gemma:2b (⚡ Fast)</option>
              <option value="mistral">mistral</option>
              <option value="phi3">phi3</option>
              <option value="llama2">llama2</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout:
            </label>
            <div className="flex gap-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="hierarchical"
                  checked={layout === "hierarchical"}
                  onChange={() => setLayout("hierarchical")}
                  className="mr-2"
                />
                Hierarchical
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="circular"
                  checked={layout === "circular"}
                  onChange={() => setLayout("circular")}
                  className="mr-2"
                />
                Circular
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Generate Graph
        </button>

        {loading && (
          <p className="text-blue-600 mt-4 font-semibold text-center">
            🔄 Generating graph...
          </p>
        )}
        {error && (
          <p className="text-red-500 mt-4 text-center font-medium">{error}</p>
        )}
      </div>

      {image && !loading && (
        <motion.div
          className="mt-8 text-center max-w-3xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            src={image}
            alt="Graph"
            className="rounded-lg border shadow-md w-full max-h-[500px] object-contain"
          />
          <a
            href={jsonLink}
            download="graph_data.json"
            className="text-blue-700 underline block mt-3 text-base"
          >
            ⬇ Download Prerequisite JSON
          </a>
        </motion.div>
      )}
    </div>
  );
}

export default App;
