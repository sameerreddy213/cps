import type { Topic } from "../interface/types";
import api from "./api";

export const submitQuiz = async (
  courseId: string,
  passed: boolean,
  score: number
): Promise<Topic[]> => {
  await api.post('/user-progress/complete', 
   
    {  courseId, passed, score },
  );

  const progressRes = await api.get(`/user-progress/`);
  if (progressRes.status < 200 || progressRes.status >= 300) {
    throw new Error('Failed to fetch updated progress');
  }

  return progressRes.data;
};