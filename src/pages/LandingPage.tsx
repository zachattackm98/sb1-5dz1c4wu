import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CloudLightning as Lightning, Cpu, BookOpen, Check, BookOpen as Book } from 'lucide-react';
import { getPublicImageUrl } from '../lib/supabase';

const LandingPage: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    async function loadLogo() {
      try {
        const url = await getPublicImageUrl('picture', 'safeguard70e lock only.png');
        setLogoUrl(url);
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    }
    loadLogo();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <section className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          {logoUrl && (
            <div className="w-72 h-72 md:w-96 md:h-96 flex items-center justify-center -mt-8">
              <img 
                src={logoUrl} 
                alt="Safeguard70E Logo" 
                className="object-contain w-full h-full"
              />
            </div>
          )}
          
          <div className="-mt-12 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 text-center">
              Arc Flash PPE Selector
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 text-center max-w-2xl">
              Fast, accurate PPE recommendations based on the latest edition of NFPA 70E — built for contractors in the field.
            </p>

            <div className="flex flex-col items-center">
              <Link 
                to="/selector"
                className="group inline-flex items-center px-8 py-4 bg-primary-500 text-white rounded-full text-lg font-semibold transition-all hover:bg-primary-600 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse hover:animate-none mb-4"
              >
                Get Started
                <ChevronRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <p className="text-gray-600 text-lg italic">
                When the equipment label isn't there — we are.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Lightning size={24} className="text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Quick Selection</h3>
            <p className="text-gray-600">
              Select your voltage range and equipment type to get instant PPE recommendations.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Cpu size={24} className="text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Equipment Specific</h3>
            <p className="text-gray-600">
              Tailored recommendations based on voltage range, equipment type, and specific tasks.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <BookOpen size={24} className="text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple step-by-step interface to quickly determine the appropriate PPE category and arc flash boundary.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-4">
                  1
                </div>
                <h3 className="text-lg font-semibold">Select Parameters</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Choose voltage range, equipment type, and task details through an intuitive interface.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Book size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Based on NFPA 70E Table 130.5(C) — used to estimate the likelihood of an arc flash occurrence.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-4">
                  2
                </div>
                <h3 className="text-lg font-semibold">Confirm Conditions</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Specify equipment maintenance status and any relevant system parameters.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Book size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Supports accurate PPE category determination per Table 130.7(C)(15)(a).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-4">
                  3
                </div>
                <h3 className="text-lg font-semibold">View Results</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get detailed arc flash boundary, PPE category, and a full list of required protective equipment.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Book size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Includes arc-rated clothing and protective gear guidance from Table 130.7(C)(15)(c).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-3/4 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Ready to determine your Arc Flash PPE requirements?</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check size={20} className="text-success-700 mr-2 flex-shrink-0" />
                  <span>NFPA 70E compliant recommendations</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-success-700 mr-2 flex-shrink-0" />
                  <span>Specific to your equipment and tasks</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-success-700 mr-2 flex-shrink-0" />
                  <span>Quick, accurate results in seconds</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/4">
              <Link to="/selector" className="block">
                <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center group">
                  Get Started
                  <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;