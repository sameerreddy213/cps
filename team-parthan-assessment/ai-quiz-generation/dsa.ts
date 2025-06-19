// AI Integration and Quiz Analysis
// Developed by Srishti Koni
import readline from 'readline';
import fetch from 'node-fetch';

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

async function fetchQuiz(topic: string): Promise<MCQ[]> {
  const prompt = `
Generate 5 MCQs on the topic "${topic}".Make sure the options are correct and that only one option is correct answer and also make sure you have the right and precise answer
Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 1,
    "explanation": "...",
    "concept": "..."
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
  if (!match) throw new Error('Could not parse JSON response');

  return JSON.parse(match[0]);
}

async function runQuiz() {
  const topic = await ask('📝 Enter the topic you want a quiz on: ');
  console.log(`\n🎯 Generating quiz for "${topic}"...\n`);

  const quiz = await fetchQuiz(topic);
  let score = 0;

  for (let i = 0; i < quiz.length; i++) {
    const q = quiz[i];
    console.log(`Q${i + 1}: ${q.question}`);
    q.options.forEach((opt, idx) => console.log(`   ${idx + 1}. ${opt}`));

    const ans = await ask('👉 Your answer (1-4): ');
    const userChoice = parseInt(ans) - 1;

    const isCorrect = userChoice === q.correctAnswer;
    if (isCorrect) {
      console.log('✅ Correct!\n');
      score++;
    } else {
      if (!isCorrect) {
  console.log(`❌ Incorrect. ✅ Correct Answer: ${q.options[q.correctAnswer]}\n`);
}

    }
  }

  const percent = (score / quiz.length) * 100;
  console.log(`📊 Your Score: ${score}/${quiz.length} (${percent.toFixed(0)}%)`);

  if (percent >= 70) {
    console.log('🎉 You’re ready to move to the next topic!');
  } else {
    console.log('🧠 Please revise this topic before proceeding.');
  }

  rl.close();
}

runQuiz();

/* import readline from 'readline';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

// 📥 Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 🔁 Wrap readline in a Promise for async/await
function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

// 📄 Send PDF to backend and get matched DSA topics
async function fetchTopicsFromPDF(pdfPath: string): Promise<string[]> {
  const form = new FormData();
  form.append('pdf', fs.createReadStream(pdfPath));
  const res = await fetch('http://localhost:3000/analyzePDF', {
    method: 'POST',
    // @ts-ignore
    body: form,
    headers: form.getHeaders(),
  });

  if (!res.ok) throw new Error('Failed to analyze PDF');
  const data = await res.json();
  return data.matchedConcepts || [];
}

// ❓ Call Ollama or quiz API to generate questions
async function fetchQuiz(topic: string): Promise<{
  question: string;
  options: string[];
  correctAnswer: number;
}[]> {
  const res = await fetch('http://localhost:11434/api/generateQuiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic,
      model: 'llama3', // or codellama, etc.
    }),
  });

  if (!res.ok) throw new Error('Failed to generate quiz');
  return await res.json(); // should return array of quiz questions
}

// 🎮 Run quiz flow
async function runQuiz() {
  const pdfPath = await ask('📄 Enter path to your PDF file: ');
  let topics: string[];

  try {
    topics = await fetchTopicsFromPDF(pdfPath.trim());
  } catch (e: any) {
    console.log('❌ Could not analyze PDF:', e.message);
    rl.close();
    return;
  }

  if (!topics.length) {
    console.log('No topics found in PDF.');
    rl.close();
    return;
  }

  console.log('\n📚 Topics found:');
  topics.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  const idx = await ask('Select a topic number for quiz: ');
  const topic = topics[parseInt(idx) - 1];

  if (!topic) {
    console.log('Invalid selection.');
    rl.close();
    return;
  }

  console.log(`\n🎯 Generating quiz for "${topic}"...\n`);

  let quiz;
  try {
    quiz = await fetchQuiz(topic);
  } catch (e: any) {
    console.log('❌ Could not fetch quiz:', e.message);
    rl.close();
    return;
  }

  let score = 0;
  for (let i = 0; i < quiz.length; i++) {
    const q = quiz[i];
    console.log(`Q${i + 1}: ${q.question}`);
    q.options.forEach((opt, idx) => console.log(`   ${idx + 1}. ${opt}`));

    const ans = await ask('👉 Your answer (1-4): ');
    const userChoice = parseInt(ans) - 1;

    const isCorrect = userChoice === q.correctAnswer;
    if (isCorrect) {
      console.log('✅ Correct!\n');
      score++;
    } else {
      console.log(`❌ Incorrect. ✅ Correct Answer: ${q.options[q.correctAnswer]}\n`);
    }
  }

  const percent = (score / quiz.length) * 100;
  console.log(`📊 Your Score: ${score}/${quiz.length} (${percent.toFixed(0)}%)`);

  if (percent >= 70) {
    console.log('🎉 You’re ready to move to the next topic!');
  } else {
    console.log('🧠 Please revise this topic before proceeding.');
  }

  rl.close();
}

runQuiz();*/

