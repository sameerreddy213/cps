/*CREATED BY NIKITA S RAJ KAPINI(14-06-2025)*/
/* This file has the preliminary frontend code created to test with the backend. This file needs to be changed
accordingly to integrate both frontend and backend. Also note that this file has some dependecies that needs to installed before
running this. These dependencies are not currently been used in the frontend*/


// import axios from 'axios';
// import React, { useRef, useState } from 'react';
// const html2pdf = require('html2pdf.js');

// type QuestionType = 'single-correct-mcq' | 'multiple-correct-mcq' | 'one-word' | 'numerical';

// interface Question {
//   question: string;
//   options?: string[];
//   correct_answer: string | string[] | number;
//   type: QuestionType;
//   topic_tested: string;
//   concept_area: string;
//   difficulty: string;
//   insight_if_wrong: string;
//   estimated_time_min: number;
// }

// interface AssessmentResponse {
//   _id: string;
//   targetTopic: string;
//   prerequisites: string[];
//   questions: Question[];
// }

// interface AnalysisResponse {
//   message: string;
//   weakTopics: string[];
//   recommendations: string;
// }

// interface ResponseWithCorrectness {
//   question: Question;
//   userAnswer: any;
//   isCorrect: boolean;
// }


// export default function AssessmentForm() {
//   const [topic, setTopic] = useState('');
//   const [userId, setUserId] = useState('');
//   const [result, setResult] = useState<AssessmentResponse | null>(null);
//   const [answers, setAnswers] = useState<{ [key: number]: any }>({});
//   const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
//   const [score, setScore] = useState<number | null>(null);
//   const [showReport, setShowReport] = useState(false);
//   const [responsesWithCorrectness, setResponsesWithCorrectness] = useState<ResponseWithCorrectness[]>([]);

//   const reportRef = useRef<HTMLDivElement>(null);

//   const handleSubmitTopic = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/assessment/generate', { target: topic });
//       setResult(res.data);
//       setAnswers({});
//       setAnalysis(null);
//       setScore(null);
//       setShowReport(false);
//     } catch (err: any) {
//       alert(err.response?.data?.error || 'Failed to generate assessment');
//     }
//   };

//   const handleAnswerChange = (idx: number, value: any) => {
//     setAnswers((prev) => ({ ...prev, [idx]: value }));
//   };

//   const handleMultiSelectChange = (idx: number, option: string) => {
//     const prev = answers[idx] || [];
//     if (prev.includes(option)) {
//       handleAnswerChange(idx, prev.filter((o: string) => o !== option));
//     } else {
//       handleAnswerChange(idx, [...prev, option]);
//     }
//   };
  

//   const handleSubmitAssessment = async () => {
//     if (!result || !userId.trim()) {
//       alert('Please provide a User ID and generate the assessment first.');
//       return;
//     }

//     try {
//       const payload = {
//         assessmentId: result._id,
//         userId,
//         answers: result.questions.map((_, idx) => ({
//           userAnswer: answers[idx] || [],
//         })),
//       };

//       const submitRes = await axios.post('http://localhost:5000/api/response/submit', payload);
//       const responses = submitRes.data.result.responses;

//       const correctCount = responses.filter((r: any) => r.isCorrect).length;
//       setScore(correctCount);

//       const enrichedResponses = responses.map((r: any, i: number) => ({
//         question: result.questions[i],
//         userAnswer: r.userAnswer,
//         isCorrect: r.isCorrect,
//       }));
//       setResponsesWithCorrectness(enrichedResponses);

//       const analysisRes = await axios.get(
//         `http://localhost:5000/api/response/analysis/${userId}/${result._id}`
//       );
//       setAnalysis(analysisRes.data);
//       setShowReport(true);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to submit or fetch analysis.');
//     }
//   };

//   const downloadPDF = () => {
//     if (reportRef.current) {
//       html2pdf()
//         .set({
//           margin: 0.5,
//           filename: `assessment_report_${userId}.pdf`,
//           image: { type: 'jpeg', quality: 0.98 },
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//         })
//         .from(reportRef.current)
//         .save();
//     }
//   };

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <div className="mb-4 flex gap-4 items-center">
//         <input
//           className="border p-2"
//           type="text"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           placeholder="Enter User ID"
//         />
//         <input
//           className="border p-2 flex-1"
//           type="text"
//           value={topic}
//           onChange={(e) => setTopic(e.target.value)}
//           placeholder="Enter Target Topic"
//         />
//         <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSubmitTopic}>
//           Generate Assessment
//         </button>
//       </div>

//       {!showReport && result && (
//         <div className="mt-6">
//           <h2 className="text-2xl font-bold mb-4">Assessment for {result.targetTopic}</h2>
//           <form>
//             {result.questions.map((q, idx) => (
//               <div key={idx} className="mb-6 border-b pb-4">
//                 <p className="font-semibold">Q{idx + 1}. {q.question}</p>

//                 {q.type === 'single-correct-mcq' ? (
//                   q.options?.map((opt, optIdx) => (
//                     <label key={optIdx} className="block mt-2">
//                       <input
//                         type="radio"
//                         name={`q-${idx}`}
//                         value={opt}
//                         checked={answers[idx] === opt}
//                         onChange={() => handleAnswerChange(idx, opt)}
//                         className="mr-2"
//                       />
//                       {opt}
//                     </label>
//                   ))
//                 ) : q.type === 'multiple-correct-mcq' ? (
//                   q.options?.map((opt, optIdx) => (
//                     <label key={optIdx} className="block mt-2">
//                       <input
//                         type="checkbox"
//                         value={opt}
//                         checked={answers[idx]?.includes(opt)}
//                         onChange={() => handleMultiSelectChange(idx, opt)}
//                         className="mr-2"
//                       />
//                       {opt}
//                     </label>
//                   ))
//                 ) : (
//                   <input
//                     type="text"
//                     className="border mt-2 p-1 w-full max-w-md"
//                     placeholder="Your answer"
//                     value={answers[idx] || ''}
//                     onChange={(e) => handleAnswerChange(idx, e.target.value)}
//                   />
//                 )}
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={handleSubmitAssessment}
//               className="bg-green-600 text-white px-6 py-2 rounded mt-4"
//             >
//               Submit Assessment
//             </button>
//           </form>
//         </div>
//       )}

//       {showReport && (
//         <div ref={reportRef} className="mt-10 bg-gray-100 p-6 rounded shadow">
//           <h2 className="text-2xl font-bold mb-4">📊 Performance Report</h2>
//           {score !== null && (
//             <p className="text-lg font-medium mb-4">✅ Total Score: {score}/{result?.questions.length}</p>
//           )}

//           {responsesWithCorrectness.map((res, idx) => (
//             <div key={idx} className="mb-4 border-b pb-4">
//               <p className="font-semibold">Q{idx + 1}. {res.question.question}</p>
//               <p>User Answer: <span className="text-blue-700">{Array.isArray(res.userAnswer) ? res.userAnswer.join(', ') : res.userAnswer}</span></p>
//               <p>Correct Answer: <span className="text-green-700">{Array.isArray(res.question.correct_answer) ? res.question.correct_answer.join(', ') : res.question.correct_answer}</span></p>
//               <p className={`font-semibold ${res.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
//                 Score: {res.isCorrect ? '1/1' : '0/1'}
//               </p>
//             </div>
//           ))}

//           {analysis && (
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold">Topics to Revisit:</h3>
//               <ul className="list-disc list-inside text-red-600 mb-4">
//                 {analysis.weakTopics.map((topic, idx) => (
//                   <li key={idx}>{topic}</li>
//                 ))}
//               </ul>
//               <p className="text-green-700 whitespace-pre-line">{analysis.recommendations}</p>
//             </div>
//           )}
//         </div>
//       )}

//       {showReport && (
//         <div className="mt-6 flex gap-4">
//           <button
//             className="bg-blue-700 text-white px-4 py-2 rounded"
//             onClick={() => alert("Deeper analysis coming soon!")}
//           >
//             🔍 Deeper Analysis
//           </button>
//           <button
//             className="bg-purple-600 text-white px-4 py-2 rounded"
//             onClick={downloadPDF}
//           >
//             📄 Download Report
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


