import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFExportButton = ({ results, maxWeight }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('NutriCargo Optimizer - Optimization Summary', 14, 22);

    doc.setFontSize(12);
    doc.text(`Cargo Capacity: ${maxWeight} kg`, 14, 32);

    results.forEach((res, index) => {
      const startY = 40 + index * 60;
      doc.setFontSize(14);
      doc.text(`${res.algorithm_used || `Algorithm ${index + 1}`}`, 14, startY);

      doc.setFontSize(10);
      doc.text(`Total Weight: ${res.total_weight.toFixed(2)} kg`, 14, startY + 6);
      doc.text(`Total Nutritional Value: ${res.total_nutritional_value.toFixed(2)}`, 14, startY + 12);
      doc.text(`Execution Time: ${res.execution_time_ms ? res.execution_time_ms.toFixed(2) : 'N/A'} ms`, 14, startY + 18);
      doc.text(`Remarks: ${res.efficiency_remarks || '-'}`, 14, startY + 24);

      // Table of selected items
      const tableColumn = ['Name', 'Weight (kg)', 'Nutritional Value', 'Fraction'];
      const tableRows = [];

      res.selected_items.forEach(item => {
        const itemData = [
          item.name,
          item.weight.toFixed(2),
          item.nutritional_value.toFixed(2),
          item.fraction ? item.fraction.toFixed(2) : '1.00',
        ];
        tableRows.push(itemData);
      });

      doc.autoTable({
        startY: startY + 28,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [96, 165, 250] },
      });
    });

    doc.save('nutricargo_optimization_summary.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download PDF Summary
    </button>
  );
};

export default PDFExportButton;
