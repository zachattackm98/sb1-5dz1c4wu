import React from 'react';
import { Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold tracking-wider">SAFEGUARD<span className="text-red-500">70E</span></span>
          </div>
          
          <div className="text-sm text-gray-400 flex items-center">
            <Info size={16} className="mr-1" />
            <span>Based on NFPA 70E Guidelines for Electrical Safety in the Workplace</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400 text-center">
          <p>
            This tool is designed to assist in selecting appropriate PPE. Always follow your
            company's safety policies and consult qualified safety professionals.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;