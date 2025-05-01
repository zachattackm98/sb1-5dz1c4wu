import React from 'react';
import SelectorStepper from '../components/selector/SelectorStepper';

const SelectorPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Arc Flash PPE Selection</h1>
        <p className="text-lg text-gray-600">
          Follow the steps below to determine the appropriate PPE category and arc flash boundary for your task.
        </p>
      </div>
      
      <SelectorStepper />
    </div>
  );
};

export default SelectorPage;