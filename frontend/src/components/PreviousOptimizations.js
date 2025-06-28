import React, { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'nutricargo_optimizations';

const PreviousOptimizations = ({ onSelect, refreshKey }) => {
  const [optimizations, setOptimizations] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    setOptimizations(data);
  }, [refreshKey]);

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Previous Optimizations
      </h2>
      {optimizations.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No previous optimizations found.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {optimizations.map(opt => (
            <li key={opt.id} className="py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">{new Date(opt.timestamp).toLocaleString()}</div>
                <div className="text-sm text-gray-500">Cargo Capacity: {opt.maxWeight} kg</div>
              </div>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                onClick={() => onSelect(opt)}
              >
                View / Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviousOptimizations; 