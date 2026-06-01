import React, { useState } from 'react';
import { EducationalComponentProps } from '../types/EducationalComponentProps';

interface Resistor {
  id: string;
  resistance: number; // Ohms
  label: string;
}

interface CircuitSimulatorProps extends EducationalComponentProps {
  /**
   * Circuit type: series or parallel
   */
  circuitType?: 'series' | 'parallel';
  
  /**
   * Voltage source (volts)
   */
  voltage?: number;
  
  /**
   * Number of resistors
   */
  resistorCount?: number;
  
  /**
   * Initial resistance values (ohms)
   */
  initialResistances?: number[];
  
  /**
   * Show circuit diagram
   */
  showDiagram?: boolean;
}

/**
 * CircuitSimulator - Interactive electrical circuit simulator
 * 
 * Teaches Ohm's Law (V=IR) and circuit analysis.
 * Supports series and parallel circuit configurations.
 * 
 * @example
 * <CircuitSimulator
 *   title="Circuit Analysis Tool"
 *   explanation="Explore series and parallel circuits using Ohm's Law"
 *   circuitType="series"
 *   voltage={12}
 *   resistorCount={3}
 *   difficultyLevel="intermediate"
 * />
 */
export const CircuitSimulator: React.FC<CircuitSimulatorProps> = ({
  title = 'Circuit Simulator',
  explanation = 'Explore series and parallel circuits using Ohm\'s Law (V=IR)',
  instructions = [
    'Select circuit type (series or parallel)',
    'Set the voltage source',
    'Adjust individual resistor values',
    'Observe how current and power change'
  ],
  difficultyLevel = 'intermediate',
  lessonContext = 'Physics - Electricity',
  learningObjectives = [
    'Understand Ohm\'s Law',
    'Analyze series circuits',
    'Analyze parallel circuits',
    'Calculate power dissipation'
  ],
  circuitType = 'series',
  voltage = 12,
  resistorCount = 3,
  initialResistances = [10, 15, 5],
  showDiagram = true,
  showAdvancedFeatures = false,
  dynamicParameters = {},
  onLessonComplete,
  onMetricsUpdate,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState(circuitType);
  const [V, setV] = useState(voltage);
  const [count, setCount] = useState(resistorCount);
  const [resistances, setResistances] = useState<Resistor[]>(
    initialResistances.map((r, i) => ({
      id: `r${i}`,
      resistance: r,
      label: `R${i + 1}`,
    }))
  );

  // Calculate circuit properties
  const calculateCircuit = () => {
    if (resistances.length === 0) return { R_total: 0, I_total: 0, P_total: 0, currents: [], voltages: [], powers: [] };

    let R_total = 0;

    if (type === 'series') {
      // Series: R_total = R1 + R2 + R3 + ...
      R_total = resistances.reduce((sum, r) => sum + r.resistance, 0);
    } else {
      // Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3 + ...
      const reciprocal = resistances.reduce((sum, r) => sum + 1 / (r.resistance || 1), 0);
      R_total = reciprocal > 0 ? 1 / reciprocal : 0;
    }

    // Ohm's Law: I = V / R
    const I_total = R_total > 0 ? V / R_total : 0;

    // Power: P = V*I = I²*R = V²/R
    const P_total = V * I_total;

    let currents: number[] = [];
    let voltages: number[] = [];
    let powers: number[] = [];

    if (type === 'series') {
      // In series: same current through all resistors
      currents = resistances.map(() => I_total);
      voltages = resistances.map((r) => I_total * r.resistance);
      powers = resistances.map((r) => I_total * I_total * r.resistance);
    } else {
      // In parallel: same voltage across all resistors
      voltages = resistances.map(() => V);
      currents = resistances.map((r) => (r.resistance > 0 ? V / r.resistance : 0));
      powers = resistances.map((r) => (r.resistance > 0 ? (V * V) / r.resistance : 0));
    }

    return {
      R_total,
      I_total,
      P_total,
      currents,
      voltages,
      powers,
    };
  };

  const circuit = calculateCircuit();

  // Update resistor value
  const updateResistance = (id: string, newValue: number) => {
    setResistances((prev) =>
      prev.map((r) => (r.id === id ? { ...r, resistance: Math.max(1, newValue) } : r))
    );
  };

  // Draw circuit diagram
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showDiagram) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';

    if (type === 'series') {
      // Draw series circuit
      const margin = 40;
      const boxWidth = (width - 2 * margin) / count;
      const boxHeight = 60;
      const startY = height / 2 - boxHeight / 2;

      // Draw battery
      ctx.beginPath();
      ctx.rect(margin - 30, startY + 20, 20, 20);
      ctx.stroke();
      ctx.fillText('V', margin - 22, startY + 35);

      // Draw resistors in series
      for (let i = 0; i < count; i++) {
        const x = margin + i * boxWidth;
        ctx.fillText(`${resistances[i].label}`, x + 10, startY - 10);
        ctx.fillText(`${resistances[i].resistance}Ω`, x + 5, startY + 40);
        ctx.fillText(`I=${circuit.currents[i]?.toFixed(2)}A`, x + 2, startY + 55);
      }

      // Draw connecting wires
      ctx.strokeStyle = '#0000ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(margin - 10, startY + 30);
      for (let i = 0; i < count; i++) {
        const x = margin + i * boxWidth + 20;
        ctx.lineTo(x, startY + 30);
      }
      ctx.lineTo(width - margin, startY + 30);
      ctx.stroke();
    } else {
      // Draw parallel circuit
      const topY = 60;
      const bottomY = height - 60;
      const margin = 40;

      // Draw battery
      ctx.beginPath();
      ctx.rect(margin - 30, topY, 20, 20);
      ctx.stroke();
      ctx.fillText('V', margin - 22, topY + 15);

      // Draw horizontal wires from battery
      ctx.strokeStyle = '#0000ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(margin - 10, topY + 10);
      ctx.lineTo(width - margin, topY + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(margin - 10, bottomY);
      ctx.lineTo(width - margin, bottomY);
      ctx.stroke();

      // Draw parallel branches
      const branchSpacing = (width - 2 * margin) / (count + 1);
      for (let i = 0; i < count; i++) {
        const x = margin + (i + 1) * branchSpacing;
        
        // Vertical wires
        ctx.beginPath();
        ctx.moveTo(x, topY + 10);
        ctx.lineTo(x, topY + 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, bottomY - 40);
        ctx.lineTo(x, bottomY);
        ctx.stroke();

        // Resistor box
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(x - 15, topY + 40, 30, bottomY - topY - 80);
        ctx.stroke();

        // Labels
        ctx.fillText(`${resistances[i].label}`, x - 10, topY + 25);
        ctx.fillText(`${resistances[i].resistance}Ω`, x - 12, bottomY - 20);
        ctx.fillText(`I=${circuit.currents[i]?.toFixed(2)}A`, x - 15, bottomY + 15);
      }
    }
  }, [type, V, resistances, count, showDiagram, circuit.currents]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">⚡ {lessonContext}</p>
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
        {showDiagram && (
          <div className="lg:col-span-1">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border-2 border-gray-300 rounded w-full bg-white"
            />
          </div>
        )}

        <div className={`${showDiagram ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Circuit Type: <span className="text-blue-600 font-bold">{type.toUpperCase()}</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              >
                <option value="series">Series</option>
                <option value="parallel">Parallel</option>
              </select>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Voltage: <span className="text-green-600 text-lg">{V.toFixed(1)} V</span>
              </label>
              <input
                type="range"
                min="1"
                max="24"
                step="0.5"
                value={V}
                onChange={(e) => setV(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {difficultyLevel !== 'beginner' && (
            <div className="bg-purple-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Number of Resistors: <span className="text-purple-600 text-lg">{count}</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={count}
                onChange={(e) => {
                  const newCount = Number(e.target.value);
                  setCount(newCount);
                  if (newCount > resistances.length) {
                    const newResistances = [...resistances];
                    for (let i = resistances.length; i < newCount; i++) {
                      newResistances.push({
                        id: `r${i}`,
                        resistance: 10,
                        label: `R${i + 1}`,
                      });
                    }
                    setResistances(newResistances);
                  } else {
                    setResistances(resistances.slice(0, newCount));
                  }
                }}
                className="w-full"
              />
            </div>
          )}

          <div className="border-t pt-4">
            <p className="font-semibold text-gray-700 mb-3">Resistor Values (Ohms)</p>
            <div className="space-y-2">
              {resistances.map((r, idx) => (
                <div key={r.id} className="flex items-center gap-3">
                  <label className="w-12 font-semibold text-gray-700">{r.label}:</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={r.resistance}
                    onChange={(e) => updateResistance(r.id, Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-semibold text-gray-700">{r.resistance.toFixed(0)}Ω</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded border-l-4 border-blue-600">
          <p className="text-xs text-gray-600">Total Resistance</p>
          <p className="text-lg font-bold text-blue-600">{circuit.R_total.toFixed(2)}Ω</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded border-l-4 border-green-600">
          <p className="text-xs text-gray-600">Total Current</p>
          <p className="text-lg font-bold text-green-600">{circuit.I_total.toFixed(3)}A</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded border-l-4 border-purple-600">
          <p className="text-xs text-gray-600">Total Power</p>
          <p className="text-lg font-bold text-purple-600">{circuit.P_total.toFixed(2)}W</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded border-l-4 border-orange-600">
          <p className="text-xs text-gray-600">Source Voltage</p>
          <p className="text-lg font-bold text-orange-600">{V.toFixed(1)}V</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-600">
        <p className="font-semibold text-gray-700 mb-2">📊 Individual Component Analysis:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Currents (A):</p>
            <div className="text-sm font-mono text-gray-700 space-y-1">
              {circuit.currents.map((i, idx) => (
                <div key={idx}>{resistances[idx]?.label}: {i.toFixed(3)}A</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Voltages (V):</p>
            <div className="text-sm font-mono text-gray-700 space-y-1">
              {circuit.voltages.map((v, idx) => (
                <div key={idx}>{resistances[idx]?.label}: {v.toFixed(3)}V</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Power (W):</p>
            <div className="text-sm font-mono text-gray-700 space-y-1">
              {circuit.powers.map((p, idx) => (
                <div key={idx}>{resistances[idx]?.label}: {p.toFixed(3)}W</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAdvancedFeatures && (difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
          <p className="font-semibold text-yellow-700 mb-2">🔬 Advanced Physics:</p>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <p>Ohm's Law: V = I × R → I = V / R</p>
            <p>{type === 'series' ? `R_total = ${resistances.map(r => r.resistance).join(' + ')} = ${circuit.R_total.toFixed(2)}Ω` : `1/R_total = ${resistances.map(r => `1/${r.resistance}`).join(' + ')} → R_total = ${circuit.R_total.toFixed(2)}Ω`}</p>
            <p>Power: P = V × I = I² × R = V² / R</p>
            <p>Total Power = {V} × {circuit.I_total.toFixed(3)} = {circuit.P_total.toFixed(2)}W</p>
            <p>Voltage Drop Check: Σ(V) = {circuit.voltages.reduce((a, b) => a + b, 0).toFixed(2)}V {type === 'series' ? '(should equal source)' : ''}</p>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 text-center mt-4">
        Difficulty: <span className="font-semibold text-gray-700">{difficultyLevel.toUpperCase()}</span>
      </div>
    </div>
  );
};
