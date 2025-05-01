import React from 'react';
import ResultsCard from '../components/results/ResultsCard';

const ResultsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Arc Flash PPE Results</h1>
        <p className="text-lg text-gray-600">
          Based on your selections, here are the recommended PPE requirements.
        </p>
      </div>
      
      <ResultsCard />
    </div>
  );
};

export default ResultsPage;