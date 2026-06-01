import React, { useState } from 'react';

interface InteractiveSliderProps {
  title: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  initialValue?: number;
  unit?: string;
  onValueChange: (value: number) => void;
  formula?: (value: number) => string;
  visualization?: (value: number) => React.ReactNode;
}

/**
 * InteractiveSlider - Waarden aanpassen en resultaat live zien
 * 
 * Gebruikt voor:
 * - Grafieken aanpassen (Y=2X+1)
 * - Simulaties (temperatuur, korting, etc.)
 * - Experimenteren met variabelen
 * 
 * @example
 * <InteractiveSlider
 *   title="Korting berekenen"
 *   label="Kortingspercentage"
 *   min={0}
 *   max={100}
 *   unit="%"
 *   formula={(v) => `30% van €80 = €${(80 * v / 100).toFixed(2)}`}
 * />
 */
export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  title,
  label,
  min,
  max,
  step = 1,
  initialValue = min,
  unit = '',
  onValueChange,
  formula,
  visualization
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 text-blue-600">{title}</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          {label}: <span className="text-green-600 text-lg">{value}{unit}</span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {formula && (
        <div className="bg-blue-50 p-4 rounded mb-4">
          <p className="text-sm text-gray-700">
            <strong>Berekening:</strong> {formula(value)}
          </p>
        </div>
      )}

      {visualization && (
        <div className="border-t pt-4">
          {visualization(value)}
        </div>
      )}
    </div>
  );
};
