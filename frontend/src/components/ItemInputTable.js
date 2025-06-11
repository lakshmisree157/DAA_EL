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
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Weight (kg)</th>
            <th className="border p-2">Nutritional Value</th>
            <th className="border p-2">Is Bulk?</th>
            <th className="border p-2">Transport Duration (days)</th>
            <th className="border p-2">Storage Requirements</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={item.weight}
                  onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={item.nutritional_value}
                  onChange={(e) => handleItemChange(index, 'nutritional_value', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <select
                  value={item.is_bulk}
                  onChange={(e) => handleItemChange(index, 'is_bulk', e.target.value)}
                  className="w-full p-1 border rounded"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={item.transport_duration || ''}
                  onChange={(e) => handleItemChange(index, 'transport_duration', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.storage_requirements || ''}
                  onChange={(e) => handleItemChange(index, 'storage_requirements', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addNewItem}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add New Item
      </button>
    </div>
  );
};

export default ItemInputTable;
