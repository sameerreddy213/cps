 import { Brain,Target, Zap,BarChart3} from 'lucide-react';
 
export const features = [
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "Smart Dependency Mapping",
      description: "Automatically identifies prerequisite concepts and skills needed before tackling new learning objectives.",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600"
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Adaptive Assessment Generation",
      description: "Creates personalized formative assessments that target specific knowledge gaps and readiness levels.",
      color: "bg-gradient-to-br from-blue-500 to-cyan-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Real-time Progress Tracking",
      description: "Monitor student readiness and automatically adjust assessment difficulty based on performance.",
      color: "bg-gradient-to-br from-green-500 to-emerald-600"
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Instant Feedback Loop",
      description: "Provides immediate insights to both educators and learners about prerequisite mastery.",
      color: "bg-gradient-to-br from-orange-500 to-red-600"
    }
  ];

export const steps = [
    {
      number: "1",
      title: "Define Learning Objective",
      description: "Input your target learning goal and the system analyzes required prerequisites."
    },
    {
      number: "2",
      title: "Map Dependencies",
      description: "AI identifies and maps all prerequisite concepts and skills needed for success."
    },
    {
      number: "3",
      title: "Generate Assessment",
      description: "System creates targeted questions to evaluate readiness for each prerequisite."
    },
    {
      number: "4",
      title: "Analyze Results",
      description: "Get detailed insights on student readiness and recommended next steps."
    }
  ];