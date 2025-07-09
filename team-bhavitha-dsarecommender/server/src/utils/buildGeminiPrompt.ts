export function buildBinaryQuestionPrompt(concept: string, content: string): string {
  return `
You are an educational assistant helping students assess their understanding of computer science concepts.

**Task**: From the following learning material, generate a **single yes/no question** that tests understanding of the concept: **"${concept}"**.

**Guidelines**:
- Focus on conceptual understanding
- Avoid factual, memory-based, or trivia questions
- Ask reasoning-based questions (e.g., "Can you explain how a stack is used in recursion?")

**Return only the question**, with no explanation or intro.

---

**Learning Content**:
${content}
`;
}
