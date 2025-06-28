import React, { useState } from 'react';
import jsPDF from 'jspdf';

const LOCAL_STORAGE_KEY = 'nutricargo_optimizations';

const PDFExportButton = ({ results, maxWeight }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const saveToLocalStorage = () => {
    const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      results,
      maxWeight,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([entry, ...prev]));
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text('NutriCargo Optimizer - Optimization Summary', 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(75, 85, 99);
      doc.text(`Cargo Capacity: ${maxWeight} kg`, 14, 32);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);

      let y = 50;

      results.forEach((res, index) => {
        doc.setFontSize(14);
        doc.setTextColor(17, 24, 39);
        doc.text(`${res.algorithm_used || `Algorithm ${index + 1}`}`, 14, y);
        y += 8;

        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(`Total Weight: ${res.total_weight?.toFixed(2) || '0.00'} kg`, 14, y);
        y += 6;
        doc.text(`Total Nutritional Value: ${res.total_nutritional_value?.toFixed(2) || '0.00'}`, 14, y);
        y += 6;
        doc.text(`Execution Time: ${res.execution_time_ms ? res.execution_time_ms.toFixed(2) : 'N/A'} ms`, 14, y);
        y += 6;
        doc.text(`Remarks: ${res.efficiency_remarks || '-'}`, 14, y);
        y += 8;

        // Table header
        if (res.selected_items && res.selected_items.length > 0) {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text('Name', 14, y);
          doc.text('Weight (kg)', 64, y);
          doc.text('Nutritional Value', 104, y);
          doc.text('Fraction', 154, y);
          y += 6;

          // Table rows
          res.selected_items.forEach(item => {
            doc.text(String(item.name), 14, y);
            doc.text(String(item.weight?.toFixed(2) || '0.00'), 64, y);
            doc.text(String(item.nutritional_value?.toFixed(2) || '0.00'), 104, y);
            doc.text(String(item.fraction ? item.fraction.toFixed(2) : '1.00'), 154, y);
            y += 6;
            if (y > 270) { // Add new page if needed
              doc.addPage();
              y = 20;
            }
          });
          y += 8;
        }
      });

      doc.save('nutricargo_optimization_summary.pdf');
      saveToLocalStorage();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-medium hover:shadow-large transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF Summary</span>
        </>
      )}
    </button>
  );
};

export default PDFExportButton;