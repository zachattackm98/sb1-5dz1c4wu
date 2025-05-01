import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div>
              <span className="text-2xl font-bold tracking-wider">SAFEGUARD<span className="text-red-500">70E</span></span>
              <div className="text-xs text-red-500 font-medium tracking-wider">YOUR SAFETY. OUR PRIORITY.</div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full">
            <Zap size={16} className="text-red-500" />
            <span className="font-medium">NFPA 70E COMPLIANT</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;