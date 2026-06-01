import React, { useState } from 'react';

interface Step {
  title: string;
  description: string;
  example?: string;
  tip?: string;
}

interface StepByStepProps {
  title: string;
  steps: Step[];
}

/**
 * StepByStep - Procedures stap-voor-stap uitleggen
 * 
 * Gebruikt voor:
 * - Complexe processen in stappen verdelen
 * - Hoe-to's en tutorials
 * - Procedures leren
 * 
 * @example
 * <StepByStep
 *   title="Hoe schrijf je een goede samenvatting?"
 *   steps={[
 *     {
 *       title: 'Lees de tekst goed',
 *       description: 'Lees de hele tekst door...',
 *       tip: 'Onderstreep belangrijke woorden'
 *     }
 *   ]}
 * />
 */
export const StepByStep: React.FC<StepByStepProps> = ({ title, steps }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">{title}</h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded cursor-pointer transition ${
              activeStep === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveStep(index)}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                  activeStep === index ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              </div>
            </div>

            {activeStep === index && (
              <div className="ml-12 mt-4 space-y-3">
                <p className="text-gray-700">{step.description}</p>

                {step.example && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-700 mb-1">Voorbeeld:</p>
                    <p className="text-gray-700 text-sm">{step.example}</p>
                  </div>
                )}

                {step.tip && (
                  <div className="bg-yellow-50 p-3 rounded border-l-2 border-yellow-400">
                    <p className="text-sm text-yellow-700">💡 {step.tip}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
