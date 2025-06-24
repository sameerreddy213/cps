interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic?: string;
}

export default async function generateQuiz(topic: string[], prerequisites:string[]) {
  
    const prompt = `
You are an expert in data structures and algorithms. Generate 5 MCQs for each of the the topic "${topic}" , so the total number of questions will be 5 times number of topics in ${topic}. Make sure only one option is the correct answer and correct answer follows zero indexing in options. Provide explanation too. And mention the topic of the question from the list - ${topic}. .
Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 1,
    "explanation": "...",
    "topic":"..."
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
  const quiz: QuizQuestion[] = rawQuiz.map((q: { question: any; options: any; correctAnswer: any; explanation: any; topic: any }, index: number) => ({
    id: (index + 1).toString(),
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    topic: q.topic ? q.topic : topic.join(', ')
  }));

  

  console.log(quiz)

  return quiz;
};
