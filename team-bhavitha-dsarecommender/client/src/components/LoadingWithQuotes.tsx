import { useEffect, useState } from "react";

interface LoadingWithQuoteProps {
  quotes?: string[];
  intervalMs?: number;
}

const defaultQuotes = [
  "Why did the Python list break up with the array? Too much indexing drama!",
  "Recursion in Python: It's like calling yourself until you believe it.",
  "DSA in Python: When time complexity meets duck typing.",
  "Why do Python coders love trees? Because they always branch out.",
];

const LoadingWithQuote = ({ quotes = defaultQuotes, intervalMs = 3000 }: LoadingWithQuoteProps) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      setCurrentQuote(quotes[(quoteIndex + 1) % quotes.length]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [quotes, quoteIndex, intervalMs]);

  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p className="fst-italic text-info">{currentQuote}</p>
    </div>
  );
};

export default LoadingWithQuote;
