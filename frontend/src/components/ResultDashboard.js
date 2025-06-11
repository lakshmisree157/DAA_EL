import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];

const ResultDashboard = ({ results, maxWeight }) => {
  if (!results || Object.keys(results).length === 0) {
    return <p className="mt-6 text-center text-gray-500">No results to display.</p>;
  }

  // If results is an object, flatten all algorithm results to array
  let processedResults = results;
  if (!Array.isArray(results) && typeof results === 'object' && results !== null) {
    processedResults = Object.keys(results).map((key) => results[key]);
  }

  // Prepare data for bar chart: total nutritional value by algorithm
  const barData = processedResults.map((res, index) => ({
    name: res.algorithm_used || `Algorithm ${index + 1}`,
    total_nutritional_value: res.total_nutritional_value,
  }));

  // Prepare data for double bar chart: selected vs not selected weight by algorithm
  // Compute selected_weight and not_selected_weight by summing weights of selected_items and not_selected_items
  const doubleBarData = processedResults.map((res) => {
    const selectedWeight = res.selected_items
      ? res.selected_items.reduce((sum, item) => sum + (item.weight || 0), 0)
      : 0;
    const notSelectedWeight = res.not_selected_items
      ? res.not_selected_items.reduce((sum, item) => sum + (item.weight || 0), 0)
      : 0;
    return {
      algorithm_used: res.algorithm_used || '',
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
    <div className="mt-6 space-y-8">
      <h2 className="text-xl font-semibold mb-4">Optimization Comparison</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-medium mb-2">Nutritional Value by Algorithm</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_nutritional_value" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Double Bar Chart */}
        <div>
          <h3 className="text-lg font-medium mb-2">Selected vs Not Selected Weight by Algorithm</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doubleBarData}>
                <XAxis dataKey="algorithm_used" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="selected_weight" fill="#34D399" name="Selected Weight" />
                <Bar dataKey="not_selected_weight" fill="#F87171" name="Not Selected Weight" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div>
        <h3 className="text-lg font-medium mb-2">Algorithm Comparison Table</h3>
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Algorithm</th>
              <th className="border p-2 text-right">Total Weight (kg)</th>
              <th className="border p-2 text-right">Total Nutritional Value</th>
              <th className="border p-2 text-right">Execution Time (ms)</th>
              <th className="border p-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {processedResults.map((res, idx) => {
              const isBest = bestAlgorithms.includes(res);
              return (
                <tr
                  key={idx}
                  className={isBest ? 'bg-green-100 font-semibold' : ''}
                >
                  <td className="border p-2">{res.algorithm_used || `Algorithm ${idx + 1}`}</td>
                  <td className="border p-2 text-right">{res.total_weight?.toFixed(2) ?? '0.00'}</td>
                  <td className="border p-2 text-right">{res.total_nutritional_value?.toFixed(2) ?? '0.00'}</td>
                  <td className="border p-2 text-right">{formatExecutionTime(res.execution_time_ms)}</td>
                  <td className="border p-2">{res.efficiency_remarks || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detailed Selected Items Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">Selected Items Details</h3>
        {processedResults.map((res, idx) => (
          <div key={idx} className="mb-6 border border-gray-300 rounded p-4">
            <h4 className="font-semibold mb-2">{res.algorithm_used || `Algorithm ${idx + 1}`}</h4>
            {res.selected_items && res.selected_items.length > 0 ? (
              <table className="w-full table-auto border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2 text-left">Item Name</th>
                    <th className="border p-2 text-right">Weight (kg)</th>
                    <th className="border p-2 text-right">Nutritional Value</th>
                    <th className="border p-2 text-right">Fraction Selected</th>
                  </tr>
                </thead>
                <tbody>
                  {res.selected_items.map((item, itemIdx) => (
                    <tr key={itemIdx}>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">{item.weight?.toFixed(2) ?? '0.00'}</td>
                      <td className="border p-2 text-right">{item.nutritional_value?.toFixed(2) ?? '0.00'}</td>
                      <td className="border p-2 text-right">{(item.fraction_selected !== undefined && item.fraction_selected !== null) ? item.fraction_selected.toFixed(2) : '1.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No items selected for this algorithm.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultDashboard;
