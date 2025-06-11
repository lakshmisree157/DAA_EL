import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemInputTable from '../components/ItemInputTable';
import ResultDashboard from '../components/ResultDashboard';
import PDFExportButton from '../components/PDFExportButton';

const storageOptions = ['Dry', 'Cool', 'Refrigerated', 'Frozen', 'Ambient'];

const OptimizePage = () => {
  const [items, setItems] = useState([]);
  const [maxWeight, setMaxWeight] = useState(50);
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
        const comparisonArray = Object.values(data.results.comparison);
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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NutriCargo Optimizer</h1>

      <div className="mb-4">
        <label htmlFor="maxWeight" className="block font-semibold mb-1">
          Cargo Capacity (kg)
        </label>
        <input
          id="maxWeight"
          type="number"
          value={maxWeight}
          onChange={(e) => setMaxWeight(parseFloat(e.target.value))}
          className="w-32 p-2 border border-gray-300 rounded"
          min="0"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="maxTransportDuration" className="block font-semibold mb-1">
          Max Transport Duration (days)
        </label>
        <input
          id="maxTransportDuration"
          type="number"
          value={maxTransportDuration}
          onChange={(e) => setMaxTransportDuration(e.target.value)}
          className="w-32 p-2 border border-gray-300 rounded"
          min="0"
          placeholder="No limit"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Allowed Storage Types</label>
        <div className="flex flex-wrap gap-4">
          {storageOptions.map((type) => (
            <label key={type} className="inline-flex items-center">
              <input
                type="checkbox"
                value={type}
                checked={allowedStorageTypes.includes(type)}
                onChange={handleStorageTypeChange}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <ItemInputTable items={items} setItems={setItems} />

      <button
        onClick={handleOptimize}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Optimizing...' : 'Optimize'}
      </button>

      {results && (
        <>
          <ResultDashboard results={results} maxWeight={maxWeight} />
          <div className="mt-4">
            <PDFExportButton results={results} maxWeight={maxWeight} />
          </div>
        </>
      )}
    </div>
  );
};

export default OptimizePage;
