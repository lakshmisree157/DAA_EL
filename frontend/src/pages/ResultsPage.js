import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultDashboard from '../components/ResultDashboard';
import PDFExportButton from '../components/PDFExportButton';
import Navbar from '../components/Navbar';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, maxWeight } = location.state || {};

  if (!results || !maxWeight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Results Available</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              No optimization results were found. Please run the optimization process first to view results.
            </p>
            <button
              onClick={() => navigate('/optimize')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-medium hover:shadow-large transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go to Optimize Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-medium mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Optimization Results
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analysis complete! Here are the results comparing different algorithms for your cargo optimization.
          </p>
          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <div className="text-2xl font-bold text-primary-600">{results.length}</div>
              <div className="text-sm text-gray-600">Algorithms Compared</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <div className="text-2xl font-bold text-secondary-600">{maxWeight} kg</div>
              <div className="text-sm text-gray-600">Cargo Capacity</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <div className="text-2xl font-bold text-accent-600">
                {Math.max(...results.map(r => r.total_nutritional_value || 0)).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Best Nutritional Value</div>
            </div>
          </div>
        </div>
        {/* Results Dashboard */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 border border-gray-100 animate-slide-up">
          <ResultDashboard results={results} maxWeight={maxWeight} />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <PDFExportButton results={results} maxWeight={maxWeight} />
          <button
            onClick={() => navigate('/hybrid-knapsack', { state: { items: results[0]?.input_items || [], maxWeight } })}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-9 9-9 9s-9-4-9-9a9 9 0 1118 0z" />
            </svg>
            Visualize
          </button>
          <button
            onClick={() => navigate('/optimize')}
            className="inline-flex items-center px-6 py-3 border-2 border-primary-200 text-primary-700 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Optimize
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
