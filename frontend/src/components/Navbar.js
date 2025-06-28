import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PreviousOptimizations from './PreviousOptimizations';

const Navbar = () => {
  const location = useLocation();
  const [showPrev, setShowPrev] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openPrevModal = () => {
    setRefreshKey(prev => prev + 1);
    setShowPrev(true);
  };

  return (
    <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50">
      {/* Modal for Previous Optimizations */}
      {showPrev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowPrev(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <PreviousOptimizations onSelect={() => setShowPrev(false)} refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-medium">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-primary-900 transition-all duration-300">
              NutriCargo Optimizer
            </span>
          </Link>
          
          <div className="flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-primary-100 text-primary-700 shadow-soft' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/optimize" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/optimize' 
                  ? 'bg-primary-100 text-primary-700 shadow-soft' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Optimize
            </Link>
            <button
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-soft ml-2"
              onClick={openPrevModal}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Previous Optimizations</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
