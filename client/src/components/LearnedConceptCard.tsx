interface LearnedConceptCardProps {
  title: string;
}

const LearnedConceptCard = ({ title }: LearnedConceptCardProps) => {
  return (
    <div className="learned-concept-card">
      <h4>{title}</h4>
      <p>Status: ✅ Completed</p>
    </div>
  );
};

export default LearnedConceptCard;