


export const submitQuiz = async (userId: string,courseId: string, passed: boolean) => {
    await fetch('/api/user-progress/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, passed }),
    })};