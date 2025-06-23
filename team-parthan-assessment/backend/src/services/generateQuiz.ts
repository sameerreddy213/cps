interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default async function generateQuiz(topic: string[], prerequisites:string[]) {
  // Use Gemini, OpenAI, or static template
    const prompt = `
You are an expert in data structures and algorithms. Generate 5 MCQs on the topic "${topic}". Make sure only one option is the correct answer and correct answer follows zero indexing in options. Provide explanation too.
Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 1,
    "explanation": "..."
  }
]
Return only valid JSON.
`;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt,
      stream: false
    })
  });

  const data = await res.json() as { response: string };
  const match = data.response.match(/\[\s*{[\s\S]*}\s*\]/);

  if (!match) throw new Error('❌ Could not parse JSON response from Ollama.');

  const rawQuiz = JSON.parse(match[0]);

  // Assign IDs to each question
  const quiz: QuizQuestion[] = rawQuiz.map((q: { question: any; options: any; correctAnswer: any; explanation: any; }, index: number) => ({
    id: (index + 1).toString(),
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation
  }));

  console.log(quiz)

  return quiz;
};
