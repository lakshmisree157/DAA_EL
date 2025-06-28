import React, { useEffect } from 'react';

const defaultItems = [
  { name: 'Rice', weight: 10, nutritional_value: 50, is_bulk: true, transport_duration: 5, storage_requirements: 'Dry' },
  { name: 'Lentils', weight: 8, nutritional_value: 40, is_bulk: true, transport_duration: 4, storage_requirements: 'Dry' },
  { name: 'Sealed Meal Pack 1', weight: 2, nutritional_value: 30, is_bulk: false, transport_duration: 2, storage_requirements: 'Cool' },
  { name: 'Sealed Meal Pack 2', weight: 3, nutritional_value: 35, is_bulk: false, transport_duration: 3, storage_requirements: 'Cool' },
  { name: 'Milk', weight: 5, nutritional_value: 20, is_bulk: false, transport_duration: 1, storage_requirements: 'Refrigerated' }
];

const ItemInputTable = ({ items, setItems }) => {
  useEffect(() => {
    if (items.length === 0) {
      setItems(defaultItems);
    }
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === 'weight' || field === 'nutritional_value' || field === 'transport_duration'
        ? parseFloat(value)
        : field === 'is_bulk'
        ? value === 'true'
        : value;
    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        name: '',
        weight: 0,
        nutritional_value: 0,
        is_bulk: false,
        transport_duration: 0,
        storage_requirements: ''
      },
    ]);
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Food Items</h3>
        <button
          onClick={addNewItem}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Item
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-soft rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Weight (kg)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nutritional Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Bulk Item
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Transport Duration (days)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Storage Requirements
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                        placeholder="Enter item name"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input
                          type="number"
                          value={item.weight}
                          onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                          min="0"
                          step="0.1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-400 text-xs">kg</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.nutritional_value}
                        onChange={(e) => handleItemChange(index, 'nutritional_value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                        min="0"
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.is_bulk}
                        onChange={(e) => handleItemChange(index, 'is_bulk', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input
                          type="number"
                          value={item.transport_duration || ''}
                          onChange={(e) => handleItemChange(index, 'transport_duration', e.target.value)}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                          min="0"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-400 text-xs">days</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.storage_requirements || ''}
                        onChange={(e) => handleItemChange(index, 'storage_requirements', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                      >
                        <option value="">Select type</option>
                        <option value="Dry">Dry</option>
                        <option value="Cool">Cool</option>
                        <option value="Refrigerated">Refrigerated</option>
                        <option value="Frozen">Frozen</option>
                        <option value="Ambient">Ambient</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeItem(index)}
                        className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {items.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{items.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {items.reduce((sum, item) => sum + (item.weight || 0), 0).toFixed(1)} kg
              </div>
              <div className="text-sm text-gray-600">Total Weight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">
                {items.reduce((sum, item) => sum + (item.nutritional_value || 0), 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Total Nutritional Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {items.filter(item => item.is_bulk).length}
              </div>
              <div className="text-sm text-gray-600">Bulk Items</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemInputTable;
