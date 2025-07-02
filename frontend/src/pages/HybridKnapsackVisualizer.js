import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const sampleItems = [
  { name: 'Rice', icon: '🍚', weight: 10, nutritional_value: 50, is_bulk: true },
  { name: 'Beans', icon: '🫘', weight: 5, nutritional_value: 30, is_bulk: true },
  { name: 'Canned Soup', icon: '🥫', weight: 2, nutritional_value: 15, is_bulk: false },
  { name: 'Energy Bar', icon: '🍫', weight: 1, nutritional_value: 12, is_bulk: false },
  { name: 'Pasta', icon: '🍝', weight: 3, nutritional_value: 25, is_bulk: true },
  { name: 'Protein Powder', icon: '🧃', weight: 4, nutritional_value: 35, is_bulk: true },
  { name: 'Canned Meat', icon: '🥩', weight: 3, nutritional_value: 28, is_bulk: false },
];

const itemIconMap = Object.fromEntries(sampleItems.map(i => [i.name, i.icon]));
const itemBulkMap = Object.fromEntries(sampleItems.map(i => [i.name, i.is_bulk]));
const itemRatioMap = Object.fromEntries(sampleItems.map(i => [i.name, i.is_bulk ? (i.nutritional_value / i.weight).toFixed(2) : null]));

const HybridKnapsackVisualizer = () => {
  const location = useLocation();
  const userItems = location.state?.items;
  const userMaxWeight = location.state?.maxWeight;
  const [cargoWeight, setCargoWeight] = useState(userMaxWeight || 45);
  const [simulation, setSimulation] = useState([]); // Steps to animate
  const [packedItems, setPackedItems] = useState([]); // Items currently packed
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stepTable, setStepTable] = useState([]); // For calculation table
  const [remainingBulk, setRemainingBulk] = useState([]); // For split bulk items
  const [phase, setPhase] = useState(1); // 1: packed, 2: bulk
  const [dpInfo, setDpInfo] = useState(null); // For DP table info
  const [dpOpen, setDpOpen] = useState(false); // Collapsible DP table
  const timerRef = useRef(null);
  const maxWeight = userMaxWeight || 100;
  const items = userItems && userItems.length > 0 ? userItems : sampleItems;

  // Debugging: log what is being used
  useEffect(() => {
    console.log('HybridKnapsackVisualizer: location.state =', location.state);
    console.log('HybridKnapsackVisualizer: items used for simulation =', items);
    console.log('HybridKnapsackVisualizer: cargoWeight/maxWeight =', cargoWeight, maxWeight);
  }, [location.state, items, cargoWeight, maxWeight]);

  // Helper to reset simulation
  const resetSimulation = () => {
    setPackedItems([]);
    setSimStep(0);
    setIsSimulating(false);
    setSimulation([]);
    setStepTable([]);
    setRemainingBulk([]);
    setPhase(1);
    setDpInfo(null);
    setDpOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Simulate Packing button handler
  const handleSimulate = async () => {
    resetSimulation();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/optimize/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, max_weight: cargoWeight })
      });
      const data = await response.json();
      if (data.success && data.result) {
        // Split packed and bulk items for two-phase animation
        const packedPhase = data.result.selected_items.filter(item => !itemBulkMap[item.name]).map(item => ({ ...item, is_bulk: false, icon: itemIconMap[item.name], packed: true, ratio: null }));
        const bulkPhase = data.result.selected_items.filter(item => itemBulkMap[item.name]).map(item => ({ ...item, is_bulk: true, icon: itemIconMap[item.name], packed: true, ratio: itemRatioMap[item.name] }));
        // For each packed bulk item with fraction < 1, create a remaining portion
        let remaining = [];
        bulkPhase.forEach(item => {
          if (item.is_bulk && item.fraction && item.fraction < 1) {
            const orig = sampleItems.find(si => si.name === item.name);
            if (orig) {
              const remainingWeight = orig.weight - item.weight;
              const remainingValue = orig.nutritional_value * (1 - item.fraction);
              if (remainingWeight > 0) {
                remaining.push({
                  name: item.name,
                  icon: item.icon,
                  weight: remainingWeight,
                  nutritional_value: Math.round(remainingValue),
                  is_bulk: true,
                  packed: false,
                  fraction: 1 - item.fraction,
                  is_remaining: true,
                  ratio: itemRatioMap[item.name]
                });
              }
            }
          }
        });
        // Add not selected items for table and available
        const notPacked = (data.result.not_selected_items || []).map(item => ({ ...item, is_bulk: itemBulkMap[item.name], icon: itemIconMap[item.name], packed: false, ratio: itemRatioMap[item.name] }));
        setSimulation([...packedPhase, ...bulkPhase]);
        setStepTable([...packedPhase, ...bulkPhase, ...notPacked, ...remaining]);
        setRemainingBulk(remaining);
        setIsSimulating(true);
        setSimStep(0);
        setDpInfo(data.result.backtrack_info?.packed_items_processing || null);
        animateStep(packedPhase, bulkPhase, 0, remaining);
      }
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  // Animate each step: first packed, then bulk
  const animateStep = (packedPhase, bulkPhase, idx, remaining) => {
    if (idx < packedPhase.length) {
      setPhase(1);
      setPackedItems(packedPhase.slice(0, idx + 1));
      setSimStep(idx + 1);
      setRemainingBulk(remaining);
      timerRef.current = setTimeout(() => animateStep(packedPhase, bulkPhase, idx + 1, remaining), 900);
    } else if (idx - packedPhase.length < bulkPhase.length) {
      setPhase(2);
      setPackedItems([...packedPhase, ...bulkPhase.slice(0, idx - packedPhase.length + 1)]);
      setSimStep(idx + 1);
      setRemainingBulk(remaining);
      timerRef.current = setTimeout(() => animateStep(packedPhase, bulkPhase, idx + 1, remaining), 900);
    } else {
      setIsSimulating(false);
    }
  };

  // Replay simulation
  const handleReplay = () => {
    if (simulation.length > 0) {
      setPackedItems([]);
      setSimStep(0);
      setIsSimulating(true);
      // Split simulation into packed and bulk
      const packedPhase = simulation.filter(item => !itemBulkMap[item.name]);
      const bulkPhase = simulation.filter(item => itemBulkMap[item.name]);
      animateStep(packedPhase, bulkPhase, 0, remainingBulk);
    }
  };

  // Items not yet packed, including remaining bulk
  const availableItems = [
    ...items
      .filter(item => {
        if (item.is_bulk) {
          const packedBulk = packedItems.find(pi => pi.name === item.name && pi.is_bulk);
          if (packedBulk && packedBulk.fraction && packedBulk.fraction < 1) {
            return false;
          }
        }
        return !packedItems.some(pi => pi.name === item.name && (!item.is_bulk || pi.fraction === 1));
      }),
    ...remainingBulk
  ];

  const totalPackedValue = packedItems.reduce((a, b) => a + (b.nutritional_value || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* User Input Table if present */}
      {userItems && userItems.length > 0 && (
        <section className="bg-white rounded-xl shadow p-6 mb-4">
          <h4 className="font-semibold mb-2 text-blue-900">User Input Items</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-2 py-1">Item</th>
                  <th className="px-2 py-1">Weight</th>
                  <th className="px-2 py-1">Nutritional Value</th>
                  <th className="px-2 py-1">Bulk?</th>
                  <th className="px-2 py-1">Transport Days</th>
                  <th className="px-2 py-1">Storage</th>
                </tr>
              </thead>
              <tbody>
                {userItems.map((item, idx) => (
                  <tr key={item.name + idx}>
                    <td>{item.name}</td>
                    <td>{item.weight}</td>
                    <td>{item.nutritional_value}</td>
                    <td>{item.is_bulk ? 'Yes' : 'No'}</td>
                    <td>{item.transport_duration ?? '-'}</td>
                    <td>{item.storage_requirements ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-blue-700 font-bold">Cargo Limit: {userMaxWeight} kg</div>
        </section>
      )}
      {/* About Section - Hero Style */}
      <section className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-8 text-center overflow-hidden">
        <div className="absolute -top-8 -right-8 opacity-10 text-[10rem] select-none pointer-events-none">📦</div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-blue-900 drop-shadow">NutriCargo: Hybrid Knapsack Visualizer</h2>
        <p className="mb-6 text-lg text-blue-700 max-w-2xl mx-auto">
          This interactive tool demonstrates how NutriCargo uses a hybrid knapsack algorithm to optimize food allocation in disaster-relief scenarios. The goal is to pack cargo with maximum nutritional value, shelf-stable items, and minimum waste — all within a fixed weight limit.
        </p>
        <div className="flex justify-center gap-10 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-4xl">📦</span>
            <span className="text-base mt-1 font-semibold text-blue-800">Weight Capacity</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">🥗</span>
            <span className="text-base mt-1 font-semibold text-blue-800">Nutrition</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">💰</span>
            <span className="text-base mt-1 font-semibold text-blue-800">Cost Effectiveness</span>
          </div>
        </div>
      </section>

      {/* Cargo Weight Control Panel */}
      <section className="bg-white rounded-xl shadow p-6">
        <label htmlFor="cargoWeight" className="block font-semibold mb-2 text-blue-900">Adjust Cargo Weight Capacity</label>
        <input
          id="cargoWeight"
          type="range"
          min={10}
          max={100}
          value={cargoWeight}
          onChange={e => setCargoWeight(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="text-center mt-2 text-blue-700 font-bold">Capacity: {cargoWeight} kg</div>
      </section>

      {/* Phase Indicator Banner */}
      <div className="mb-4 flex justify-center">
        {phase === 1 ? (
          <span className="px-4 py-2 rounded bg-yellow-100 text-yellow-800 font-bold shadow">Step 1: 0/1 Knapsack (Packed Items)</span>
        ) : (
          <span className="px-4 py-2 rounded bg-blue-100 text-blue-800 font-bold shadow">Step 2: Fractional Knapsack (Bulk Items)</span>
        )}
      </div>

      {/* Visualization Section - Two Boxes */}
      <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Live Visualization of Packing</h3>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          {/* Available Items */}
          <div className="w-full md:w-1/2 bg-blue-50 rounded-xl p-4 min-h-[200px]">
            <h4 className="font-bold text-center mb-2">Available Items</h4>
            <div className="flex flex-wrap gap-4 justify-center items-end">
              {availableItems.map((item, idx) => (
                <motion.div
                  key={item.name + idx + (item.is_remaining ? '-rem' : '')}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-xl shadow p-3 flex flex-col items-center bg-white border-2 ${item.is_remaining ? 'border-blue-300 bg-blue-100 opacity-70' : 'border-blue-200'} min-w-[120px] relative`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-semibold mt-1">{item.name}</span>
                  <span className="text-xs text-gray-500">{item.weight}kg{item.fraction && item.fraction < 1 ? ` (${Math.round(item.fraction*100)}%)` : ''}{item.is_remaining ? ' (remaining)' : ''}</span>
                  {item.is_bulk && (
                    <span className="text-xs text-purple-700 font-semibold">Ratio: {item.ratio}</span>
                  )}
                  <span className="text-xs text-blue-700 font-semibold">Value: {item.nutritional_value}</span>
                  {item.is_bulk && item.fraction && (
                    <span className="text-xs text-blue-500 font-semibold">{item.is_remaining ? `${Math.round(item.fraction*100)}% remaining` : `${Math.round(item.fraction*100)}% used`}</span>
                  )}
                  <span className={`mt-1 px-2 py-0.5 rounded text-xs font-bold ${item.is_bulk ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.is_bulk ? 'Bulk' : 'Packed'}</span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Packed Items */}
          <div className="w-full md:w-1/2 bg-green-50 rounded-xl p-4 min-h-[200px]">
            <h4 className="font-bold text-center mb-2">Packed Items</h4>
            <div className="flex flex-wrap gap-4 justify-center items-end">
              <AnimatePresence>
                {packedItems.map((item, idx) => (
                  <motion.div
                    key={item.name + idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-xl shadow p-3 flex flex-col items-center bg-white border-2 border-green-200 min-w-[120px] relative ${simStep - 1 === idx ? 'ring-2 ring-green-500' : ''}`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-semibold mt-1">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.weight}kg{item.fraction && item.fraction < 1 ? ` (${Math.round(item.fraction*100)}%)` : ''}</span>
                    {item.is_bulk && (
                      <span className="text-xs text-purple-700 font-semibold">Ratio: {item.ratio}</span>
                    )}
                    <span className="text-xs text-blue-700 font-semibold">Value: {item.nutritional_value}</span>
                    {item.is_bulk && item.fraction && (
                      <span className="text-xs text-blue-500 font-semibold">{item.fraction < 1 ? `${Math.round(item.fraction*100)}% used` : '100% used'}</span>
                    )}
                    <span className={`mt-1 px-2 py-0.5 rounded text-xs font-bold ${item.is_bulk ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.is_bulk ? 'Bulk' : 'Packed'}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Running total nutritional value */}
            <div className="text-right text-green-700 font-bold mt-2">
              Total Value Packed: {totalPackedValue}
            </div>
          </div>
        </div>
        {/* Weight meter */}
        <div className="w-full max-w-md mt-6">
          <div className="flex justify-between text-xs text-blue-700 font-semibold mb-1">
            <span>0 kg</span>
            <span>{maxWeight} kg</span>
          </div>
          <div className="w-full h-4 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(packedItems.reduce((a, b) => a + (b.weight || 0), 0) / maxWeight) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-blue-900 font-bold mt-1">Used: {packedItems.reduce((a, b) => a + (b.weight || 0), 0)} kg</div>
        </div>
      </section>

      {/* Simulation Section */}
      <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
        <button
          className={`inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-bold rounded-xl shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 transition-all duration-300 mb-2 ${isSimulating || loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={isSimulating || loading}
          onClick={handleSimulate}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.759A1 1 0 007 8.118v7.764a1 1 0 001.234.97l6.518-1.409A1 1 0 0016 14.882V9.118a1 1 0 00-1.248-.95z" />
          </svg>
          {loading ? 'Simulating...' : 'Simulate Packing'}
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 px-6 py-2 text-md font-bold rounded-xl shadow bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 transition-all duration-300 mb-2"
          disabled={isSimulating || simulation.length === 0}
          onClick={handleReplay}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5 19A9 9 0 1119 5" />
          </svg>
          Replay
        </button>
        <div className="text-gray-400">{isSimulating ? 'Simulation running...' : '[Simulation playback ready]'}</div>
      </section>

      {/* Calculation Table Section */}
      <section className="bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold mb-2 text-blue-900">Packing Calculation Steps</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-2 py-1">Item</th>
                <th className="px-2 py-1">Type</th>
                <th className="px-2 py-1">Weight Used</th>
                <th className="px-2 py-1">Fraction</th>
                <th className="px-2 py-1">Value</th>
                <th className="px-2 py-1">Value/Weight</th>
                <th className="px-2 py-1">Packed?</th>
              </tr>
            </thead>
            <tbody>
              {stepTable.map((item, idx) => (
                <tr key={item.name + idx + (item.is_remaining ? '-rem' : '')} className={item.packed ? 'bg-green-50' : item.is_remaining ? 'bg-blue-50' : 'bg-red-50'}>
                  <td className="px-2 py-1 flex items-center gap-2 justify-center"><span>{item.icon}</span>{item.name}{item.is_remaining ? ' (remaining)' : ''}</td>
                  <td>{item.is_bulk ? 'Bulk' : 'Packed'}</td>
                  <td>{item.weight}kg</td>
                  <td>{item.fraction ? Math.round(item.fraction * 100) + '%' : '100%'}</td>
                  <td>{item.nutritional_value}</td>
                  <td>{item.is_bulk ? item.ratio : '-'}</td>
                  <td className={item.packed ? 'text-green-700 font-bold' : item.is_remaining ? 'text-blue-700 font-bold' : 'text-red-700 font-bold'}>{item.packed ? 'Yes' : item.is_remaining ? 'Remaining' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DP Table Section (collapsible, matrix view) */}
      {dpInfo && dpInfo.dp_matrix && dpInfo.item_names && (
        <section className="bg-white rounded-xl shadow p-6">
          <button
            className="mb-2 px-4 py-1 rounded bg-blue-200 text-blue-900 font-semibold"
            onClick={() => setDpOpen(v => !v)}
          >
            {dpOpen ? 'Hide' : 'Show'} 0/1 Knapsack DP Table
          </button>
          {dpOpen && (
            <div className="overflow-x-auto">
              <div className="mb-2 text-sm text-blue-900 font-bold">DP Table Size: {dpInfo.dp_table_size}</div>
              <table className="min-w-max border border-blue-200 text-xs">
                <thead>
                  <tr>
                    <th className="border border-blue-200 bg-blue-50 px-2 py-1">Item/Weight</th>
                    {dpInfo.dp_matrix[0].map((_, w) => (
                      <th key={w} className="border border-blue-200 bg-blue-50 px-2 py-1">{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dpInfo.dp_matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-blue-200 bg-blue-50 px-2 py-1 font-bold">{i === 0 ? '-' : dpInfo.item_names[i-1]}</td>
                      {row.map((cell, w) => (
                        <td key={w} className="border border-blue-100 px-2 py-1 text-center">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s both;
        }
      `}</style>
    </div>
  );
};

export default HybridKnapsackVisualizer; 