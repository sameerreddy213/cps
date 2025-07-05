import { create } from "zustand";

interface MCQQuestion {
  question: string;
  options: string[];
}

interface QuizState {
  topic: string | null;
  questions: MCQQuestion[];
  correctAnswers: string[];
  setQuizData: (data: {
    topic: string;
    questions: MCQQuestion[];
    correctAnswers: string[];
  }) => void;
  clearQuizData: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  topic: null,
  questions: [],
  correctAnswers: [],
  setQuizData: ({ topic, questions, correctAnswers }) =>
    set({ topic, questions, correctAnswers }),
  clearQuizData: () => set({ topic: null, questions: [], correctAnswers: [] }),
}));
