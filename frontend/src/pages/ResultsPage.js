import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultDashboard from '../components/ResultDashboard';
import PDFExportButton from '../components/PDFExportButton';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { results, maxWeight } = location.state || {};

  if (!results || !maxWeight) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <p className="text-center text-red-500">No results to display. Please run optimization first.</p>
        <button
          onClick={() => navigate('/optimize')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Optimize Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Optimization Results</h1>
      <ResultDashboard results={results} maxWeight={maxWeight} />
      <div className="mt-4">
        <PDFExportButton results={results} maxWeight={maxWeight} />
      </div>
      <div className="mt-6">
        <button
          onClick={() => navigate('/optimize')}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Optimize
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
