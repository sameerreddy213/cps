import type { Topic } from "../interface/types";

export const submitQuiz = async (
  userId: string,
  courseId: string,
  passed: boolean,
  score: number
): Promise<Topic[]> => {
  await fetch('/api/user-progress/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, courseId, passed, score }),
  });

  const progressRes = await fetch(`/api/user-progress/${userId}`);
  if (!progressRes.ok) {
    throw new Error('Failed to fetch updated progress');
  }

  return await progressRes.json();
};