import React, { useState } from 'react';

interface CalculatorField {
  id: string;
  label: string;
  placeholder?: string;
  unit?: string;
  type?: 'number' | 'text';
}

interface CalculatorProps {
  title: string;
  fields: CalculatorField[];
  calculate: (values: Record<string, string | number>) => { result: number; explanation: string };
  unit?: string;
}

/**
 * Calculator - Berekeningen live uitvoeren
 * 
 * Gebruikt voor:
 * - Formules visualiseren
 * - Getallen invoeren en resultaat zien
 * - Simulaties (korting, rente, etc.)
 * 
 * @example
 * <Calculator
 *   title="Afleveringskosten berekenen"
 *   fields={[
 *     { id: 'weight', label: 'Gewicht', unit: 'kg', type: 'number' },
 *     { id: 'distance', label: 'Afstand', unit: 'km', type: 'number' }
 *   ]}
 *   calculate={(values) => ({
 *     result: (values.weight * values.distance * 0.5),
 *     explanation: 'Kosten = gewicht × afstand × €0.50 per kg-km'
 *   })}
 *   unit="€"
 * />
 */
export const Calculator: React.FC<CalculatorProps> = ({ title, fields, calculate, unit = '' }) => {
  const [values, setValues] = useState<Record<string, string | number>>(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  );
  const [result, setResult] = useState<{ result: number; explanation: string } | null>(null);

  const handleInputChange = (fieldId: string, value: string | number) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCalculate = () => {
    const output = calculate(values);
    setResult(output);
  };

  const canCalculate = fields.every(f => values[f.id] !== '');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 text-blue-600">{title}</h3>

      <div className="space-y-4 mb-6">
        {fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm font-semibold mb-2">
              {field.label} {field.unit && `(${field.unit})`}
            </label>
            <input
              type={field.type || 'number'}
              placeholder={field.placeholder}
              value={values[field.id]}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleCalculate}
        disabled={!canCalculate}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        Bereken
      </button>

      {result && (
        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Resultaat:</p>
          <p className="text-3xl font-bold text-green-600 mb-4">
            {result.result.toFixed(2)} {unit}
          </p>
          <p className="text-gray-700">{result.explanation}</p>
        </div>
      )}
    </div>
  );
};
