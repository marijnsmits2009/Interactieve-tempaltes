import React, { useState, useEffect, useRef } from 'react';
import { EducationalComponentProps } from '../types/EducationalComponentProps';

interface WaveSimulationProps extends EducationalComponentProps {
  /**
   * Wave type: sine, cosine, square, triangle, sawtooth
   */
  waveType?: 'sine' | 'cosine' | 'square' | 'triangle' | 'sawtooth';
  
  /**
   * Wave amplitude (height)
   */
  amplitude?: number;
  
  /**
   * Wave frequency (Hz)
   */
  frequency?: number;
  
  /**
   * Phase shift (radians)
   */
  phaseShift?: number;
  
  /**
   * Animation speed multiplier
   */
  animationSpeed?: number;
  
  /**
   * Show wave equation
   */
  showEquation?: boolean;
  
  /**
   * Show grid
   */
  showGrid?: boolean;
}

interface WavePoint {
  x: number;
  y: number;
}

/**
 * WaveSimulation - Interactive wave visualization
 * 
 * Supports multiple wave types with adjustable parameters.
 * Perfect for teaching wave properties, frequency, amplitude, and phase.
 * 
 * @example
 * <WaveSimulation
 *   title="Wave Properties Explorer"
 *   explanation="Understand frequency, amplitude, and phase shift"
 *   waveType="sine"
 *   amplitude={2}
 *   frequency={1}
 *   phaseShift={0}
 *   difficultyLevel="intermediate"
 * />
 */
export const WaveSimulation: React.FC<WaveSimulationProps> = ({
  title = 'Wave Simulation',
  explanation = 'Explore wave properties: amplitude, frequency, and phase',
  instructions = [
    'Adjust amplitude to change wave height',
    'Change frequency to speed up/slow down oscillation',
    'Use phase shift to delay the wave',
    'Compare different wave types'
  ],
  difficultyLevel = 'intermediate',
  lessonContext = 'Physics - Waves & Oscillations',
  learningObjectives = [
    'Understand wave properties',
    'Recognize different wave patterns',
    'Learn about frequency and wavelength'
  ],
  waveType = 'sine',
  amplitude = 1,
  frequency = 1,
  phaseShift = 0,
  animationSpeed = 1,
  showEquation = true,
  showGrid = true,
  showAdvancedFeatures = false,
  dynamicParameters = {},
  onLessonComplete,
  onMetricsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState(waveType);
  const [amp, setAmp] = useState(amplitude);
  const [freq, setFreq] = useState(frequency);
  const [phase, setPhase] = useState(phaseShift);
  const [speed, setSpeed] = useState(animationSpeed);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();

  // Calculate wave value at position x
  const calculateWave = (x: number, t: number): number => {
    const argument = freq * x + phase + t * speed;
    
    switch (type) {
      case 'sine':
        return amp * Math.sin(argument);
      
      case 'cosine':
        return amp * Math.cos(argument);
      
      case 'square': {
        // Square wave: alternates between +amp and -amp
        const normalized = ((argument / Math.PI) % 2);
        return normalized < 1 ? amp : -amp;
      }
      
      case 'triangle': {
        // Triangle wave: linear up then linear down
        const period = 2 * Math.PI / freq;
        const phase_normalized = (argument % (2 * Math.PI)) / (2 * Math.PI);
        if (phase_normalized < 0.25) {
          return amp * (phase_normalized * 4);
        } else if (phase_normalized < 0.75) {
          return amp * (2 - phase_normalized * 4);
        } else {
          return amp * (phase_normalized * 4 - 4);
        }
      }
      
      case 'sawtooth': {
        // Sawtooth wave: linear rise, sharp drop
        const phase_normalized = ((argument / (2 * Math.PI)) % 1);
        return amp * (2 * phase_normalized - 1);
      }
      
      default:
        return 0;
    }
  };

  // Animation loop
  useEffect(() => {
    if (isPaused) return;

    const animate = () => {
      setTime((prevTime) => prevTime + 0.05);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const xScale = 40 / freq; // pixels per wavelength

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      
      // Vertical grid lines (wavelengths)
      const wavelength = (2 * Math.PI) / freq;
      for (let i = 0; i < width; i += xScale) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      const ySpacing = height / (2 * amp + 2);
      for (let i = 0; i < height; i += ySpacing) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    }

    // Draw center axis
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw amplitude bounds
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY - amp * (height / (2 * amp + 2)));
    ctx.lineTo(width, centerY - amp * (height / (2 * amp + 2)));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY + amp * (height / (2 * amp + 2)));
    ctx.lineTo(width, centerY + amp * (height / (2 * amp + 2)));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw wave
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let firstPoint = true;
    const step = 2;
    for (let px = 0; px < width; px += step) {
      const x = (px / xScale);
      const y = calculateWave(x, time);
      const plotY = centerY - y * (height / (2 * amp + 2));

      if (firstPoint) {
        ctx.moveTo(px, plotY);
        firstPoint = false;
      } else {
        ctx.lineTo(px, plotY);
      }
    }
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('0', 5, centerY - 10);
    ctx.fillText(`+${amp}`, 5, 15);
    ctx.fillText(`-${amp}`, 5, height - 10);

    // Draw wave type label
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${type.toUpperCase()} WAVE`, 10, 35);
  }, [type, amp, freq, phase, time, showGrid]);

  const getParameterRange = () => {
    if (difficultyLevel === 'beginner') {
      return { ampMin: 0.5, ampMax: 3, freqMin: 0.5, freqMax: 2, phaseMin: 0, phaseMax: 2 * Math.PI, speedMin: 0.1, speedMax: 2 };
    }
    return { ampMin: 0.1, ampMax: 5, freqMin: 0.1, freqMax: 4, phaseMin: 0, phaseMax: 2 * Math.PI, speedMin: 0.01, speedMax: 3 };
  };

  const range = getParameterRange();

  const period = 1 / freq; // T = 1/f
  const wavelength = (2 * Math.PI) / freq; // λ = 2π/k where k = freq
  const waveSpeed = freq; // Simplified: v = f × λ

  const getEquation = () => {
    switch (type) {
      case 'sine':
        return `y(x,t) = ${amp} × sin(${freq}x + ${phase.toFixed(2)} + ${speed}t)`;
      case 'cosine':
        return `y(x,t) = ${amp} × cos(${freq}x + ${phase.toFixed(2)} + ${speed}t)`;
      case 'square':
        return `y(x,t) = ${amp} × sgn(sin(${freq}x + ${phase.toFixed(2)} + ${speed}t))`;
      case 'triangle':
        return `Triangle wave: Amplitude=${amp}, Frequency=${freq}`;
      case 'sawtooth':
        return `Sawtooth wave: Amplitude=${amp}, Frequency=${freq}`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">🌊 {lessonContext}</p>
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

      {showEquation && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-3 mb-4 rounded font-mono text-sm">
          <p className="font-semibold text-purple-700 mb-1">📐 Equation:</p>
          <p className="text-purple-600">{getEquation()}</p>
        </div>
      )}

      <div className="mb-4">
        <canvas
          ref={canvasRef}
          width={700}
          height={350}
          className="border-2 border-gray-300 rounded w-full bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Wave Type: <span className="text-green-600 font-bold">{type.toUpperCase()}</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="sine">Sine Wave</option>
            <option value="cosine">Cosine Wave</option>
            <option value="square">Square Wave</option>
            {(difficultyLevel === 'intermediate' || difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
              <>
                <option value="triangle">Triangle Wave</option>
                <option value="sawtooth">Sawtooth Wave</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Animation Speed: <span className="text-green-600 font-bold">{speed.toFixed(2)}x</span>
          </label>
          <input
            type="range"
            min={range.speedMin}
            max={range.speedMax}
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Amplitude: <span className="text-blue-600 text-lg">{amp.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={range.ampMin}
            max={range.ampMax}
            step="0.1"
            value={amp}
            onChange={(e) => setAmp(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600 mt-2">Wave height</p>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Frequency: <span className="text-green-600 text-lg">{freq.toFixed(2)} Hz</span>
          </label>
          <input
            type="range"
            min={range.freqMin}
            max={range.freqMax}
            step="0.1"
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600 mt-2">Oscillations per unit</p>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Phase Shift: <span className="text-purple-600 text-lg">{(phase * (180 / Math.PI)).toFixed(1)}°</span>
          </label>
          <input
            type="range"
            min={range.phaseMin}
            max={range.phaseMax}
            step="0.1"
            value={phase}
            onChange={(e) => setPhase(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600 mt-2">Horizontal shift</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`px-6 py-2 rounded text-white ${
            isPaused
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {isPaused ? '▶️ Play' : '⏸️ Pause'}
        </button>
        <button
          onClick={() => setTime(0)}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          ↻ Reset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded">
          <p className="text-xs text-gray-600">Period (T)</p>
          <p className="text-lg font-bold text-blue-600">{period.toFixed(3)} s</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded">
          <p className="text-xs text-gray-600">Wavelength (λ)</p>
          <p className="text-lg font-bold text-green-600">{wavelength.toFixed(3)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded">
          <p className="text-xs text-gray-600">Frequency (f)</p>
          <p className="text-lg font-bold text-purple-600">{freq.toFixed(3)} Hz</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded">
          <p className="text-xs text-gray-600">Wave Speed (v)</p>
          <p className="text-lg font-bold text-orange-600">{waveSpeed.toFixed(3)}</p>
        </div>
      </div>

      {showAdvancedFeatures && (difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="font-semibold text-yellow-700 mb-2">🔬 Advanced Analysis:</p>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <p>Wave Equation: ∂²y/∂t² = v²(∂²y/∂x²)</p>
            <p>Angular Frequency ω = 2πf = {(2 * Math.PI * freq).toFixed(3)} rad/s</p>
            <p>Wave Number k = 2π/λ = {freq.toFixed(3)}</p>
            <p>Phase Velocity v = ω/k = {(2 * Math.PI * freq / freq).toFixed(3)}</p>
            <p>Energy ∝ A²f = {(amp * amp * freq).toFixed(3)}</p>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 text-center">
        Difficulty: <span className="font-semibold text-gray-700">{difficultyLevel.toUpperCase()}</span>
      </div>
    </div>
  );
};
