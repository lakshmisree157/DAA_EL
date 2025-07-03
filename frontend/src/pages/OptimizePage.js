import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemInputTable from '../components/ItemInputTable';
import ResultDashboard from '../components/ResultDashboard';
import PDFExportButton from '../components/PDFExportButton';
import Navbar from '../components/Navbar';

const storageOptions = ['Dry', 'Cool', 'Refrigerated', 'Frozen', 'Ambient'];

const OptimizePage = () => {
  const [items, setItems] = useState([]);
  const [maxWeight, setMaxWeight] = useState(35);
  const [maxTransportDuration, setMaxTransportDuration] = useState('');
  const [allowedStorageTypes, setAllowedStorageTypes] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStorageTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAllowedStorageTypes([...allowedStorageTypes, value]);
    } else {
      setAllowedStorageTypes(allowedStorageTypes.filter((type) => type !== value));
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/optimize/comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          max_weight: maxWeight,
          max_transport_duration: maxTransportDuration ? parseFloat(maxTransportDuration) : null,
          allowed_storage_types: allowedStorageTypes.length > 0 ? allowedStorageTypes : null,
        }),
      });
      const data = await response.json();
      if (data.results && data.results.comparison) {
        const comparisonArray = Object.values(data.results.comparison).map(r => ({ ...r, input_items: items }));
        navigate('/results', { state: { results: comparisonArray, maxWeight } });
      } else {
        console.error('Backend response missing comparison key:', data);
        setResults(null);
      }
    } catch (error) {
      console.error('Error optimizing:', error);
      setResults(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-medium mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NutriCargo Optimizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configure your cargo parameters and food items to find the optimal packing solution using advanced algorithms.
          </p>
        </div>

        {/* Configuration Section */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cargo Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="maxWeight" className="block text-sm font-semibold text-gray-700">
                Cargo Capacity (kg)
              </label>
              <div className="relative">
                <input
                  id="maxWeight"
                  type="number"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                  min="0"
                  placeholder="35"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400 text-sm">kg</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="maxTransportDuration" className="block text-sm font-semibold text-gray-700">
                Max Transport Duration (days)
              </label>
              <div className="relative">
                <input
                  id="maxTransportDuration"
                  type="number"
                  value={maxTransportDuration}
                  onChange={(e) => setMaxTransportDuration(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                  min="0"
                  placeholder="No limit"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400 text-sm">days</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Allowed Storage Types
              </label>
              <div className="flex flex-wrap gap-3">
                {storageOptions.map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={type}
                      checked={allowedStorageTypes.includes(type)}
                      onChange={handleStorageTypeChange}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table Section */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Food Items Configuration
          </h2>
          <ItemInputTable items={items} setItems={setItems} />
        </div>

        {/* Optimize Button */}
        <div className="text-center">
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-medium hover:shadow-large transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Optimizing...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Run Optimization</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </div>

        {results && (
          <div className="mt-12 animate-slide-up">
            <ResultDashboard results={results} maxWeight={maxWeight} />
            <div className="mt-8 text-center">
              <PDFExportButton results={results} maxWeight={maxWeight} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizePage;
