import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

const ResultDashboard = ({ results, maxWeight }) => {
  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-lg text-gray-500">No results to display.</p>
      </div>
    );
  }

  // If results is an object, flatten all algorithm results to array
  let processedResults = results;
  if (!Array.isArray(results) && typeof results === 'object' && results !== null) {
    processedResults = Object.keys(results).map((key) => results[key]);
  }

  // Helper to abbreviate algorithm names for chart X-axis
  const getShortLabel = (name) => {
    if (!name) return '';
    if (name === 'Fractional Knapsack') return 'Frac. Knapsack';
    if (name === 'Hybrid: 0/1 Knapsack + Fractional Knapsack') return 'Hybrid';
    if (name === 'Brute Force') return 'Brute Force';
    if (name === 'Greedy') return 'Greedy';
    return name.length > 16 ? name.slice(0, 14) + '…' : name;
  };

  // Prepare data for bar chart: total nutritional value by algorithm
  const barData = processedResults.map((res, index) => ({
    name: getShortLabel(res.algorithm_used || `Algorithm ${index + 1}`),
    fullName: res.algorithm_used || `Algorithm ${index + 1}`,
    total_nutritional_value: res.total_nutritional_value,
    color: COLORS[index % COLORS.length]
  }));

  // Prepare data for double bar chart: selected vs not selected weight by algorithm
  const doubleBarData = processedResults.map((res, index) => {
    const selectedWeight = res.selected_items
      ? res.selected_items.reduce((sum, item) => sum + (item.weight || 0), 0)
      : 0;
    const notSelectedWeight = res.not_selected_items
      ? res.not_selected_items.reduce((sum, item) => sum + (item.weight || 0), 0)
      : 0;
    return {
      algorithm_used: getShortLabel(res.algorithm_used || `Algorithm ${index + 1}`),
      fullName: res.algorithm_used || `Algorithm ${index + 1}`,
      selected_weight: selectedWeight,
      not_selected_weight: notSelectedWeight,
    };
  });

  // Find best algorithm by highest nutritional value
  const maxValue = Math.max(...processedResults.map((r) => r.total_nutritional_value));
  const bestAlgorithms = processedResults.filter(
    (r) => r.total_nutritional_value === maxValue
  );

  // Helper to format execution time display
  const formatExecutionTime = (time) => {
    if (time === null || time === undefined) return 'N/A';
    if (typeof time === 'number') return time.toFixed(2);
    return 'N/A';
  };

  return (
    <div className="space-y-8">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutritional Value Chart */}
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Nutritional Value by Algorithm
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const fullName = barData.find(d => d.name === label)?.fullName || label;
                      return (
                        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: 10 }}>
                          <div style={{ fontWeight: 600 }}>{fullName}</div>
                          <div>{payload[0].name}: {payload[0].value}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total_nutritional_value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Distribution Chart */}
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 text-secondary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            Weight Distribution by Algorithm
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doubleBarData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <XAxis 
                  dataKey="algorithm_used" 
                  tick={{ fontSize: 12 }}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const fullName = doubleBarData.find(d => d.algorithm_used === label)?.fullName || label;
                      return (
                        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: 10 }}>
                          <div style={{ fontWeight: 600 }}>{fullName}</div>
                          {payload.map((p, i) => (
                            <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="selected_weight" 
                  fill="#22C55E" 
                  name="Selected Weight" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="not_selected_weight" 
                  fill="#EF4444" 
                  name="Not Selected Weight" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Algorithm Comparison Table */}
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 text-accent-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Algorithm Comparison Table
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Algorithm
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Weight (kg)
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Nutritional Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Execution Time (ms)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedResults.map((res, idx) => {
                const isBest = bestAlgorithms.includes(res);
                return (
                  <tr
                    key={idx}
                    className={`${isBest ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500' : 'hover:bg-gray-50'} transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`font-semibold ${isBest ? 'text-green-800' : 'text-gray-900'}`}>
                          {res.algorithm_used || `Algorithm ${idx + 1}`}
                        </span>
                        {isBest && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Best
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {res.total_weight?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {res.total_nutritional_value?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatExecutionTime(res.execution_time_ms)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {res.efficiency_remarks || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Selected Items Section */}
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Selected Items Details
        </h3>
        {processedResults.map((res, idx) => (
          <div key={idx} className="mb-8 last:mb-0">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <span className="w-3 h-3 rounded-full bg-primary-500 mr-3"></span>
                {res.algorithm_used || `Algorithm ${idx + 1}`}
              </h4>
            </div>
            {res.selected_items && res.selected_items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Weight (kg)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Nutritional Value
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Fraction Selected
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {res.selected_items.map((item, itemIdx) => (
                      <tr key={itemIdx} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {item.weight?.toFixed(2) ?? '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {item.nutritional_value?.toFixed(2) ?? '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {(item.fraction !== undefined && item.fraction !== null) ? item.fraction.toFixed(2) : '1.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No items selected for this algorithm.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultDashboard;
