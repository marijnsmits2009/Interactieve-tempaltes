import React, { useState } from 'react';
import { EducationalComponentProps } from '../types/EducationalComponentProps';

interface Vector {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface VectorVisualizerProps extends EducationalComponentProps {
  /**
   * Operation type: addition, subtraction, magnitude, angle
   */
  operationType?: 'addition' | 'subtraction' | 'magnitude' | 'angle' | 'dotproduct';
  
  /**
   * First vector
   */
  vector1X?: number;
  vector1Y?: number;
  
  /**
   * Second vector
   */
  vector2X?: number;
  vector2Y?: number;
  
  /**
   * Show grid
   */
  showGrid?: boolean;
  
  /**
   * Show coordinate labels
   */
  showCoordinates?: boolean;
}

/**
 * VectorVisualizer - Interactive vector operations visualizer
 * 
 * Allows students to explore vector addition, subtraction, magnitude,
 * angles, and dot products with interactive visualization.
 * 
 * @example
 * <VectorVisualizer
 *   title="Vector Operations Explorer"
 *   explanation="Understand vectors and their operations"
 *   operationType="addition"
 *   vector1X={3}
 *   vector1Y={4}
 *   vector2X={1}
 *   vector2Y={2}
 *   difficultyLevel="intermediate"
 * />
 */
export const VectorVisualizer: React.FC<VectorVisualizerProps> = ({
  title = 'Vector Visualizer',
  explanation = 'Explore vectors and vector operations',
  instructions = [
    'Adjust vector components using sliders',
    'Select an operation (add, subtract, etc.)',
    'Observe the result vector in real-time',
    'Note the magnitude and angle of vectors'
  ],
  difficultyLevel = 'intermediate',
  lessonContext = 'Physics/Mathematics - Vectors',
  learningObjectives = [
    'Understand vector representation',
    'Master vector operations',
    'Calculate magnitude and angles'
  ],
  operationType = 'addition',
  vector1X = 3,
  vector1Y = 4,
  vector2X = 1,
  vector2Y = 2,
  showGrid = true,
  showCoordinates = true,
  showAdvancedFeatures = false,
  dynamicParameters = {},
  onLessonComplete,
  onMetricsUpdate,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [v1X, setV1X] = useState(vector1X);
  const [v1Y, setV1Y] = useState(vector1Y);
  const [v2X, setV2X] = useState(vector2X);
  const [v2Y, setV2Y] = useState(vector2Y);
  const [operation, setOperation] = useState(operationType);

  // Calculate vector properties
  const magnitude = (x: number, y: number) => Math.sqrt(x * x + y * y);
  const angle = (x: number, y: number) => Math.atan2(y, x) * (180 / Math.PI);
  const dotProduct = (x1: number, y1: number, x2: number, y2: number) => x1 * x2 + y1 * y2;

  // Calculate result vector based on operation
  const getResultVector = (): { x: number; y: number; label: string } => {
    switch (operation) {
      case 'addition':
        return { x: v1X + v2X, y: v1Y + v2Y, label: 'A + B' };
      case 'subtraction':
        return { x: v1X - v2X, y: v1Y - v2Y, label: 'A - B' };
      case 'magnitude':
        const mag1 = magnitude(v1X, v1Y);
        return { x: mag1, y: 0, label: `|A| = ${mag1.toFixed(2)}` };
      case 'angle':
        const ang1 = angle(v1X, v1Y);
        return { x: Math.cos((ang1 * Math.PI) / 180) * 3, y: Math.sin((ang1 * Math.PI) / 180) * 3, label: `θ = ${ang1.toFixed(2)}°` };
      case 'dotproduct':
        const dp = dotProduct(v1X, v1Y, v2X, v2Y);
        return { x: dp, y: 0, label: `A·B = ${dp.toFixed(2)}` };
      default:
        return { x: 0, y: 0, label: '' };
    }
  };

  const resultVector = getResultVector();

  // Draw canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30; // pixels per unit

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      for (let i = -10; i <= 10; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, height);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * scale);
        ctx.lineTo(width, centerY + i * scale);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw axis labels
    if (showCoordinates) {
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText('X', width - 20, centerY + 15);
      ctx.fillText('Y', centerX + 10, 20);
    }

    // Helper function to draw vector
    const drawVector = (x: number, y: number, color: string, label: string) => {
      const endX = centerX + x * scale;
      const endY = centerY - y * scale; // Flip Y for screen coordinates

      // Draw arrow line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrowhead
      const headlen = 15;
      const angle = Math.atan2(endY - centerY, endX - centerX);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();

      // Draw dot at tip
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(endX, endY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(label, endX + 10, endY - 10);
    };

    // Draw vectors based on operation
    if (operation === 'addition') {
      drawVector(v1X, v1Y, '#2563eb', 'A');
      drawVector(v2X, v2Y, '#10b981', 'B');
      
      // Draw vector B from tip of A (parallelogram method)
      ctx.strokeStyle = '#10b98166';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + v1X * scale, centerY - v1Y * scale);
      ctx.lineTo(centerX + (v1X + v2X) * scale, centerY - (v1Y + v2Y) * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw result vector
      drawVector(resultVector.x, resultVector.y, '#ef4444', 'A+B');
    } else if (operation === 'subtraction') {
      drawVector(v1X, v1Y, '#2563eb', 'A');
      drawVector(v2X, v2Y, '#10b981', 'B');
      
      // Draw -B from tip of A
      ctx.strokeStyle = '#10b98166';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + v1X * scale, centerY - v1Y * scale);
      ctx.lineTo(centerX + (v1X - v2X) * scale, centerY - (v1Y - v2Y) * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      drawVector(resultVector.x, resultVector.y, '#ef4444', 'A-B');
    } else {
      // For magnitude, angle, dot product - just show main vector
      drawVector(v1X, v1Y, '#2563eb', 'A');
      drawVector(v2X, v2Y, '#10b981', 'B');
    }

    // Draw magnitude circles for magnitude operation
    if (operation === 'magnitude') {
      const mag1 = magnitude(v1X, v1Y);
      ctx.strokeStyle = '#2563eb66';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, mag1 * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [v1X, v1Y, v2X, v2Y, operation, showGrid, showCoordinates]);

  const mag1 = magnitude(v1X, v1Y);
  const mag2 = magnitude(v2X, v2Y);
  const ang1 = angle(v1X, v1Y);
  const ang2 = angle(v2X, v2Y);
  const dp = dotProduct(v1X, v1Y, v2X, v2Y);

  const getParameterRange = () => {
    if (difficultyLevel === 'beginner') return { min: -5, max: 5, step: 0.5 };
    return { min: -10, max: 10, step: 0.1 };
  };

  const range = getParameterRange();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">🎯 {lessonContext}</p>
      <p className="text-gray-700 mb-4">{explanation}</p>

      {instructions && instructions.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
          <p className="font-semibold text-blue-700 mb-2">📖 Instructions:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            {instructions.map((instr, i) => (
              <li key={i}>• {instr}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="border-2 border-gray-300 rounded w-full bg-white"
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <label className="block text-sm font-semibold mb-2">
              Operation: <span className="text-blue-600 font-bold">{operation.toUpperCase()}</span>
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as any)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            >
              <option value="addition">Addition (A + B)</option>
              <option value="subtraction">Subtraction (A - B)</option>
              <option value="magnitude">Magnitude (|A|)</option>
              {(difficultyLevel === 'intermediate' || difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
                <>
                  <option value="angle">Angle (θ)</option>
                  <option value="dotproduct">Dot Product (A·B)</option>
                </>
              )}
            </select>
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold text-gray-700 mb-3">Vector A</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded">
                <label className="block text-xs font-semibold mb-2">
                  X: <span className="text-blue-600 text-sm">{v1X.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={v1X}
                  onChange={(e) => setV1X(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <label className="block text-xs font-semibold mb-2">
                  Y: <span className="text-blue-600 text-sm">{v1Y.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={v1Y}
                  onChange={(e) => setV1Y(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {operation !== 'magnitude' && (
            <div className="border-t pt-4">
              <p className="font-semibold text-gray-700 mb-3">Vector B</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded">
                  <label className="block text-xs font-semibold mb-2">
                    X: <span className="text-green-600 text-sm">{v2X.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={v2X}
                    onChange={(e) => setV2X(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <label className="block text-xs font-semibold mb-2">
                    Y: <span className="text-green-600 text-sm">{v2Y.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={v2Y}
                    onChange={(e) => setV2Y(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded border-l-4 border-blue-600">
          <p className="text-xs text-gray-600">|A| (Magnitude)</p>
          <p className="text-lg font-bold text-blue-600">{mag1.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded border-l-4 border-green-600">
          <p className="text-xs text-gray-600">|B| (Magnitude)</p>
          <p className="text-lg font-bold text-green-600">{mag2.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded border-l-4 border-purple-600">
          <p className="text-xs text-gray-600">θ_A (Angle)</p>
          <p className="text-lg font-bold text-purple-600">{ang1.toFixed(1)}°</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded border-l-4 border-orange-600">
          <p className="text-xs text-gray-600">A·B (Dot Product)</p>
          <p className="text-lg font-bold text-orange-600">{dp.toFixed(2)}</p>
        </div>
      </div>

      {showAdvancedFeatures && (difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="font-semibold text-yellow-700 mb-2">🔬 Advanced Analysis:</p>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <p>|A| = √({v1X}² + {v1Y}²) = {mag1.toFixed(3)}</p>
            <p>|B| = √({v2X}² + {v2Y}²) = {mag2.toFixed(3)}</p>
            <p>A·B = {v1X}×{v2X} + {v1Y}×{v2Y} = {dp.toFixed(3)}</p>
            <p>cos(θ) = (A·B) / (|A|×|B|) = {(dp / (mag1 * mag2)).toFixed(3)}</p>
            {operation === 'addition' && (
              <p>|A+B| = √(({v1X}+{v2X})² + ({v1Y}+{v2Y})²) = {magnitude(resultVector.x, resultVector.y).toFixed(3)}</p>
            )}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 text-center">
        Difficulty: <span className="font-semibold text-gray-700">{difficultyLevel.toUpperCase()}</span>
      </div>
    </div>
  );
};
