import React from 'react';

interface DiagramProps {
  title: string;
  svgContent: string;
  description?: string;
  labels?: { id: string; label: string; description: string }[];
}

/**
 * Diagram - Visualisaties tonen (SVG)
 * 
 * Gebruikt voor:
 * - Technische tekeningen
 * - Anatomische modellen
 * - Schematische voorstellingen
 * - Structuurdiagrammen
 * 
 * @example
 * <Diagram
 *   title="Wateratoom"
 *   svgContent="<svg>...</svg>"
 *   labels={[
 *     { id: 'o', label: 'Zuurstof', description: 'Centrale atoom' },
 *     { id: 'h1', label: 'Waterstof 1', description: 'Linker waterstofatoom' }
 *   ]}
 * />
 */
export const Diagram: React.FC<DiagramProps> = ({ title, svgContent, description, labels }) => {
  const [hoveredLabel, setHoveredLabel] = React.useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">{title}</h2>

      {description && (
        <p className="text-gray-700 mb-4">{description}</p>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-center overflow-auto max-h-96">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="w-full"
        />
      </div>

      {labels && labels.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-gray-700 mb-3">Componenten:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {labels.map(label => (
              <div
                key={label.id}
                onMouseEnter={() => setHoveredLabel(label.id)}
                onMouseLeave={() => setHoveredLabel(null)}
                className={`p-3 rounded border-l-4 cursor-pointer transition ${
                  hoveredLabel === label.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <p className="font-semibold text-gray-700">{label.label}</p>
                <p className="text-sm text-gray-600">{label.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
