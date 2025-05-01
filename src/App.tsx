import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SelectorPage from './pages/SelectorPage';
import ResultsPage from './pages/ResultsPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { SelectorProvider } from './context/SelectorContext';

function App() {
  return (
    <SelectorProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/selector" element={<SelectorPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SelectorProvider>
  );
}

export default App;