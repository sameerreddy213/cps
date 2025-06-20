//Author: Pentapati V V Satya Pavan Sandeep
import React from 'react';
import { ProgressData } from '../types';
import { BarChart } from './Charts';

interface ProgressProps {
  data: ProgressData[];
}

export const Progress: React.FC<ProgressProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">No progress yet</h3>
        <p className="mb-6 text-gray-600">You haven't started any topics yet. Start learning to see your progress here!</p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.topicName),
    datasets: [
      {
        label: 'Score',
        data: data.map(item => item.score),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Progress Overview</h3>
      <div className="h-64">
        <BarChart data={chartData} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-600">Completed Topics</h4>
          <p className="text-2xl font-bold text-blue-700">
            {data.filter(item => item.completed).length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-600">Average Score</h4>
          <p className="text-2xl font-bold text-green-700">
            {data.length > 0
              ? Math.round(
                  data.reduce((acc, item) => acc + item.score, 0) / data.length
                )
              : 0}
            %
          </p>
        </div>
      </div>
    </div>
  );
};
