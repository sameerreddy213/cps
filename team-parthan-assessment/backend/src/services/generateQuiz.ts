interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic?: string;
}

export default async function generateQuiz(
  topic: string[],
  prerequisites: string[]
) {
  const prompt = `
You are an expert in data structures and algorithms.

Given the list of topics: ${topic}, generate exactly 5 multiple choice questions (MCQs) **per topic**, resulting in a total of 5 × number of topics.

Each question must:
- Have exactly 4 options.
- Have only one correct option (use zero-based index).
- Ensure the correct answer is **fully consistent with the explanation**.
- Include the specific topic the question is related to (from the provided list).

⚠️ Format your output strictly as **valid JSON**, like this:
[
  {
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": optionnumber as number,
    "explanation": "Explain clearly why that option is correct.",
    "topic": "Name of topic"
  },
  ...
]

Do not include any notes, comments, or markdown. Return only clean JSON. Be concise in explanation to reduce latency.
`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt,
      stream: false,
    }),
  });

  const data = (await res.json()) as { response: string };
  const match = data.response.match(/\[\s*{[\s\S]*}\s*\]/);

  if (!match) throw new Error("❌ Could not parse JSON response from Ollama.");

  const rawQuiz = JSON.parse(match[0]);

  // Assign IDs to each question
  const quiz: QuizQuestion[] = rawQuiz.map(
    (
      q: {
        question: any;
        options: any;
        correctAnswer: any;
        explanation: any;
        topic: any;
      },
      index: number
    ) => ({
      id: (index + 1).toString(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic ? q.topic : topic.join(", "),
    })
  );

  console.log(quiz);

  return quiz;
}
