import React, { useState, useEffect, useRef } from 'react';
import { EducationalComponentProps, DifficultyLevel, LearningMetrics } from '../types/EducationalComponentProps';

interface FunctionGraphProps extends EducationalComponentProps {
  /**
   * Function type: linear, quadratic, cubic, exponential, logarithmic, absolute
   */
  functionType?: 'linear' | 'quadratic' | 'cubic' | 'exponential' | 'logarithmic' | 'absolute' | 'sine' | 'cosine';
  
  /**
   * Parameter A (coefficient/amplitude)
   */
  parameterA?: number;
  
  /**
   * Parameter B (coefficient/frequency)
   */
  parameterB?: number;
  
  /**
   * Parameter C (offset/phase)
   */
  parameterC?: number;
  
  /**
   * X-axis range
   */
  xMin?: number;
  xMax?: number;
  
  /**
   * Y-axis range
   */
  yMin?: number;
  yMax?: number;
  
  /**
   * Zoom level (1 = normal)
   */
  zoom?: number;
  
  /**
   * Show coordinate grid
   */
  showGrid?: boolean;
  
  /**
   * Show axes labels and values
   */
  showLabels?: boolean;
}

/**
 * FunctionGraph - Interactive mathematical function visualizer
 * 
 * Supports multiple function types with real-time parameter adjustments.
 * Perfect for teaching algebra, trigonometry, and calculus concepts.
 * 
 * @example
 * <FunctionGraph
 *   title="Quadratic Functions"
 *   explanation="Explore how changing parameters affects the parabola"
 *   functionType="quadratic"
 *   parameterA={1}
 *   parameterB={0}
 *   parameterC={0}
 *   difficultyLevel="intermediate"
 * />
 */
export const FunctionGraph: React.FC<FunctionGraphProps> = ({
  title = 'Function Graph',
  explanation = 'Explore mathematical functions by adjusting parameters',
  instructions = ['Adjust parameters A, B, C', 'Observe how the graph changes', 'Try different function types'],
  difficultyLevel = 'intermediate',
  lessonContext = 'Mathematics - Functions',
  learningObjectives = ['Understand function behavior', 'Recognize parameter effects'],
  functionType = 'linear',
  parameterA = 1,
  parameterB = 0,
  parameterC = 0,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  zoom = 1,
  showGrid = true,
  showLabels = true,
  showAdvancedFeatures = false,
  dynamicParameters = {},
  onLessonComplete,
  onMetricsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(parameterA);
  const [b, setB] = useState(parameterB);
  const [c, setC] = useState(parameterC);
  const [type, setType] = useState(functionType);
  const [zoomLevel, setZoomLevel] = useState(zoom);
  const [xRange, setXRange] = useState({ min: xMin, max: xMax });
  const [yRange, setYRange] = useState({ min: yMin, max: yMax });
  const [attemptsCount, setAttemptsCount] = useState(0);

  // Calculate function value
  const calculateY = (x: number): number => {
    switch (type) {
      case 'linear':
        return a * x + b + c;
      case 'quadratic':
        return a * x * x + b * x + c;
      case 'cubic':
        return a * x * x * x + b * x + c;
      case 'exponential':
        return a * Math.pow(b + 1, x) + c;
      case 'logarithmic':
        return a * Math.log(Math.abs(x) + 1) + c;
      case 'absolute':
        return a * Math.abs(b * x + c);
      case 'sine':
        return a * Math.sin(b * x + c);
      case 'cosine':
        return a * Math.cos(b * x + c);
      default:
        return x;
    }
  };

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      const gridSpacing = 40 / zoomLevel;
      
      for (let x = xRange.min; x <= xRange.max; x += 1) {
        const px = centerX + (x - (xRange.min + xRange.max) / 2) * (width / (xRange.max - xRange.min)) * zoomLevel;
        if (px > 0 && px < width) {
          ctx.beginPath();
          ctx.moveTo(px, 0);
          ctx.lineTo(px, height);
          ctx.stroke();
        }
      }

      for (let y = yRange.min; y <= yRange.max; y += 1) {
        const py = centerY - (y - (yRange.min + yRange.max) / 2) * (height / (yRange.max - yRange.min)) * zoomLevel;
        if (py > 0 && py < height) {
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(width, py);
          ctx.stroke();
        }
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

    // Draw function curve
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let firstPoint = true;
    for (let px = 0; px < width; px += 2) {
      const x = xRange.min + (px / width) * (xRange.max - xRange.min);
      const y = calculateY(x);

      const plotX = centerX + (x - (xRange.min + xRange.max) / 2) * (width / (xRange.max - xRange.min)) * zoomLevel;
      const plotY = centerY - (y - (yRange.min + yRange.max) / 2) * (height / (yRange.max - yRange.min)) * zoomLevel;

      if (plotY > -1000 && plotY < height + 1000) {
        if (firstPoint) {
          ctx.moveTo(plotX, plotY);
          firstPoint = false;
        } else {
          ctx.lineTo(plotX, plotY);
        }
      }
    }
    ctx.stroke();

    // Draw labels
    if (showLabels) {
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      for (let i = xRange.min; i <= xRange.max; i += 2) {
        const px = centerX + (i - (xRange.min + xRange.max) / 2) * (width / (xRange.max - xRange.min)) * zoomLevel;
        if (px > 0 && px < width) {
          ctx.fillText(i.toString(), px - 5, centerY + 15);
        }
      }
    }
  }, [a, b, c, type, zoomLevel, xRange, yRange, showGrid, showLabels]);

  const handleParameterChange = (param: 'a' | 'b' | 'c', value: number) => {
    setAttemptsCount(prev => prev + 1);
    if (param === 'a') setA(value);
    if (param === 'b') setB(value);
    if (param === 'c') setC(value);

    onMetricsUpdate?.({
      componentId: 'function-graph',
      timestamp: Date.now(),
      userAction: `adjusted_${param}`,
      parametersUsed: { a, b, c, type },
      timeSpent: 0,
      attemptsCount,
    });
  };

  const getParameterRange = () => {
    if (difficultyLevel === 'beginner') return { min: -5, max: 5, step: 0.5 };
    if (difficultyLevel === 'intermediate') return { min: -10, max: 10, step: 0.1 };
    return { min: -20, max: 20, step: 0.01 };
  };

  const range = getParameterRange();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">📚 {lessonContext}</p>
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

      <div className="mb-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="border-2 border-gray-300 rounded w-full bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Function Type: <span className="text-green-600 font-bold">{type}</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="linear">Linear (y = ax + b + c)</option>
            <option value="quadratic">Quadratic (y = ax² + bx + c)</option>
            <option value="cubic">Cubic (y = ax³ + bx + c)</option>
            {(difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
              <>
                <option value="exponential">Exponential (y = a(b+1)^x + c)</option>
                <option value="logarithmic">Logarithmic (y = a·ln(|x|+1) + c)</option>
              </>
            )}
            {difficultyLevel === 'beginner' && (
              <>
                <option value="absolute">Absolute (y = a|bx + c|)</option>
              </>
            )}
            {(difficultyLevel === 'intermediate' || difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
              <>
                <option value="sine">Sine (y = a·sin(bx + c))</option>
                <option value="cosine">Cosine (y = a·cos(bx + c))</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Zoom: <span className="text-green-600 font-bold">{zoomLevel.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Parameter A: <span className="text-blue-600 text-lg">{a.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={range.step}
            value={a}
            onChange={(e) => handleParameterChange('a', Number(e.target.value))}
            className="w-full"
          />
          {difficultyLevel !== 'beginner' && (
            <p className="text-xs text-gray-600 mt-2">Coefficient/Amplitude</p>
          )}
        </div>

        <div className="bg-green-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Parameter B: <span className="text-green-600 text-lg">{b.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={range.step}
            value={b}
            onChange={(e) => handleParameterChange('b', Number(e.target.value))}
            className="w-full"
          />
          {difficultyLevel !== 'beginner' && (
            <p className="text-xs text-gray-600 mt-2">Coefficient/Frequency</p>
          )}
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Parameter C: <span className="text-purple-600 text-lg">{c.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={range.step}
            value={c}
            onChange={(e) => handleParameterChange('c', Number(e.target.value))}
            className="w-full"
          />
          {difficultyLevel !== 'beginner' && (
            <p className="text-xs text-gray-600 mt-2">Offset/Phase</p>
          )}
        </div>
      </div>

      {showAdvancedFeatures && difficultyLevel === 'expert' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
          <p className="font-semibold text-yellow-700 mb-2">🔬 Advanced Analysis:</p>
          <div className="text-sm text-gray-700 space-y-1">
            <p>• Derivative: {type === 'quadratic' ? `2ax + b = ${(2*a + b).toFixed(2)}` : 'See calculus lessons'}</p>
            <p>• Domain: {type === 'logarithmic' ? 'x > -1' : 'All real numbers'}</p>
            <p>• Attempts: {attemptsCount}</p>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 text-center">
        Difficulty: <span className="font-semibold text-gray-700">{difficultyLevel.toUpperCase()}</span>
      </div>
    </div>
  );
};
