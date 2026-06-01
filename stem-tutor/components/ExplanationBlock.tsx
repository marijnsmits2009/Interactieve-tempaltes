import React from 'react';

interface ExplanationBlockProps {
  title: string;
  content: string;
  imageUrl?: string;
  practicalExample?: string;
}

/**
 * ExplanationBlock - Uitleg geven met praktische voorbeelden
 * 
 * Gebruikt voor:
 * - Concepten uitleggen
 * - Praktische voorbeelden geven
 * - Afbeeldingen/visualisaties tonen
 * 
 * @example
 * <ExplanationBlock
 *   title="Procenten in de winkel"
 *   content="Procenten geven aan welk deel van 100 iets is."
 *   practicalExample="Je ziet: artikel €80 met 30% korting. Hoeveel betaal je?"
 * />
 */
export const ExplanationBlock: React.FC<ExplanationBlockProps> = ({
  title,
  content,
  imageUrl,
  practicalExample
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">{title}</h2>
      
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full max-h-64 object-cover rounded-lg mb-4"
        />
      )}
      
      <p className="text-gray-700 mb-4 leading-relaxed">{content}</p>
      
      {practicalExample && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h3 className="font-semibold text-green-700 mb-2">💡 Praktisch voorbeeld:</h3>
          <p className="text-gray-700">{practicalExample}</p>
        </div>
      )}
    </div>
  );
};
