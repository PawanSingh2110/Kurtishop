// components/SizeChartModal.jsx
import React from "react";

const SizeChartModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 aleo bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Women's Kurti Size Chart</h2>

        <table className="w-full border border-gray-300 text-sm text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Bust</th>
              <th className="p-2 border">Waist</th>
              <th className="p-2 border">Hip</th>
              <th className="p-2 border">Length</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["XS", "32", "26", "34", "44"],
              ["S", "34", "28", "36", "44"],
              ["M", "36", "30", "38", "45"],
              ["L", "38", "32", "40", "45"],
              ["XL", "40", "34", "42", "46"],
              ["XXL", "42", "36", "44", "46"],
            ].map(([size, bust, waist, hip, length]) => (
              <tr key={size}>
                <td className="p-2 border">{size}</td>
                <td className="p-2 border">{bust} in</td>
                <td className="p-2 border">{waist} in</td>
                <td className="p-2 border">{hip} in</td>
                <td className="p-2 border">{length} in</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SizeChartModal;
