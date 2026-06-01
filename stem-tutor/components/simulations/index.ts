import React, { useState, useEffect, useRef } from 'react';
import { EducationalComponentProps } from '../types/EducationalComponentProps';

interface PendulumSimulationProps extends EducationalComponentProps {
  /**
   * Pendulum length in cm
   */
  length?: number;
  
  /**
   * Gravity constant (m/s²)
   */
  gravity?: number;
  
  /**
   * Damping coefficient (0 = no damping)
   */
  damping?: number;
  
  /**
   * Pendulum mass in kg
   */
  mass?: number;
  
  /**
   * Initial angle in degrees
   */
  initialAngle?: number;
  
  /**
   * Show energy display
   */
  showEnergy?: boolean;
}

interface PendulumState {
  angle: number; // Current angle in radians
  angularVelocity: number; // d(angle)/dt
  time: number;
}

/**
 * PendulumSimulation - Interactive pendulum with energy visualization
 * 
 * Shows how length, mass, and gravity affect pendulum motion.
 * Displays kinetic, potential, and total mechanical energy.
 * 
 * @example
 * <PendulumSimulation
 *   title="Pendulum Energy Explorer"
 *   explanation="Understand how energy changes in a pendulum system"
 *   length={100}
 *   gravity={9.81}
 *   damping={0.02}
 *   difficultyLevel="intermediate"
 * />
 */
export const PendulumSimulation: React.FC<PendulumSimulationProps> = ({
  title = 'Pendulum Simulation',
  explanation = 'Explore pendulum motion and energy conservation',
  instructions = [
    'Set pendulum parameters',
    'Click "Start" to begin animation',
    'Observe the motion and energy changes',
    'Try different damping values'
  ],
  difficultyLevel = 'intermediate',
  lessonContext = 'Physics - Mechanics - Oscillations',
  learningObjectives = [
    'Understand simple harmonic motion',
    'Observe energy conservation',
    'Learn about damped oscillations'
  ],
  length = 100,
  gravity = 9.81,
  damping = 0.02,
  mass = 1,
  initialAngle = 45,
  showEnergy = true,
  showAdvancedFeatures = false,
  dynamicParameters = {},
  onLessonComplete,
  onMetricsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [L, setL] = useState(length / 100); // Convert cm to meters
  const [g, setG] = useState(gravity);
  const [damperCoeff, setDamperCoeff] = useState(damping);
  const [m, setM] = useState(mass);
  const [theta0, setTheta0] = useState((initialAngle * Math.PI) / 180);
  const [isRunning, setIsRunning] = useState(false);
  
  const [pendulum, setPendulum] = useState<PendulumState>({
    angle: (initialAngle * Math.PI) / 180,
    angularVelocity: 0,
    time: 0,
  });

  const [energyData, setEnergyData] = useState({
    kineticEnergy: 0,
    potentialEnergy: 0,
    totalEnergy: 0,
    energyHistory: [] as Array<{ ke: number; pe: number; total: number }>,
  });

  const animationRef = useRef<number>();

  // Calculate period using formula: T = 2π√(L/g)
  const period = 2 * Math.PI * Math.sqrt(L / g);

  // Calculate natural frequency: ω = √(g/L)
  const naturalFrequency = Math.sqrt(g / L);

  // Physics simulation: θ'' + (c/m)θ' + (g/L)sin(θ) = 0
  // Using Runge-Kutta or simple Euler method
  const simulateStep = (state: PendulumState, dt: number): PendulumState => {
    // For small angles: sin(θ) ≈ θ (simple harmonic motion)
    // For larger angles: use exact formula
    const useSmallAngleApproximation = Math.abs(state.angle) < 0.1;
    
    let acceleration: number;
    if (useSmallAngleApproximation && difficultyLevel === 'beginner') {
      // Simple harmonic: θ'' = -(g/L)θ
      acceleration = -(g / L) * state.angle;
    } else {
      // Full equation: θ'' = -(g/L)sin(θ) - (c/m)θ'
      acceleration = -(g / L) * Math.sin(state.angle) - (damperCoeff / m) * state.angularVelocity;
    }

    const newAngularVelocity = state.angularVelocity + acceleration * dt;
    const newAngle = state.angle + newAngularVelocity * dt;
    const newTime = state.time + dt;

    return {
      angle: newAngle,
      angularVelocity: newAngularVelocity,
      time: newTime,
    };
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      setPendulum((prevState) => {
        const newState = simulateStep(prevState, 0.01);

        // Calculate energies
        // KE = (1/2) * I * ω² = (1/2) * (m*L²) * θ'²
        // PE = m*g*h = m*g*L*(1 - cos(θ))
        const I = m * L * L; // Moment of inertia
        const kineticEnergy = 0.5 * I * newState.angularVelocity * newState.angularVelocity;
        const potentialEnergy = m * g * L * (1 - Math.cos(newState.angle));
        const totalEnergy = kineticEnergy + potentialEnergy;

        setEnergyData((prev) => ({
          kineticEnergy,
          potentialEnergy,
          totalEnergy,
          energyHistory: [...prev.energyHistory.slice(-100), { ke: kineticEnergy, pe: potentialEnergy, total: totalEnergy }],
        }));

        return newState;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, L, g, damperCoeff, m]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const pivotX = width / 2;
    const pivotY = 80;
    const bobRadius = 12;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw pivot point
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw string
    const bobX = pivotX + L * 300 * Math.sin(pendulum.angle);
    const bobY = pivotY + L * 300 * Math.cos(pendulum.angle);

    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw bob
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw velocity vector
    if (Math.abs(pendulum.angularVelocity) > 0.01) {
      const velocityScale = 30;
      const vx = -velocityScale * pendulum.angularVelocity * L * 300 * Math.cos(pendulum.angle);
      const vy = velocityScale * pendulum.angularVelocity * L * 300 * Math.sin(pendulum.angle);

      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vx, bobY + vy);
      ctx.stroke();

      // Arrowhead
      const headlen = 8;
      const angle = Math.atan2(vy, vx);
      ctx.beginPath();
      ctx.moveTo(bobX + vx, bobY + vy);
      ctx.lineTo(
        bobX + vx - headlen * Math.cos(angle - Math.PI / 6),
        bobY + vy - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(bobX + vx, bobY + vy);
      ctx.lineTo(
        bobX + vx - headlen * Math.cos(angle + Math.PI / 6),
        bobY + vy - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }

    // Draw angle arc
    ctx.strokeStyle = '#0088ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 40, -Math.PI / 2, -Math.PI / 2 + pendulum.angle, pendulum.angle < 0);
    ctx.stroke();

    // Draw angle label
    ctx.fillStyle = '#0088ff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(
      `θ = ${(pendulum.angle * (180 / Math.PI)).toFixed(1)}°`,
      pivotX + 50,
      pivotY - 20
    );
  }, [pendulum, L]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPendulum({
      angle: theta0,
      angularVelocity: 0,
      time: 0,
    });
    setEnergyData({
      kineticEnergy: 0,
      potentialEnergy: 0,
      totalEnergy: 0,
      energyHistory: [],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">🔬 {lessonContext}</p>
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
        <div>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="border-2 border-gray-300 rounded bg-white"
          />
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded">
            <label className="block text-sm font-semibold mb-2">
              Length: <span className="text-blue-600 text-lg">{(L * 100).toFixed(0)} cm</span>
            </label>
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={L}
              onChange={(e) => setL(Number(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
          </div>

          {(difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
            <div className="bg-green-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Gravity: <span className="text-green-600 text-lg">{g.toFixed(2)} m/s²</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={g}
                onChange={(e) => setG(Number(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>
          )}

          <div className="bg-purple-50 p-4 rounded">
            <label className="block text-sm font-semibold mb-2">
              Damping: <span className="text-purple-600 text-lg">{damperCoeff.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.001"
              value={damperCoeff}
              onChange={(e) => setDamperCoeff(Number(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
            <p className="text-xs text-gray-600 mt-1">0 = No damping, 0.1 = Heavy damping</p>
          </div>

          {(difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
            <div className="bg-orange-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Mass: <span className="text-orange-600 text-lg">{m.toFixed(2)} kg</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={m}
                onChange={(e) => setM(Number(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {showEnergy && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded border-2 border-red-200">
              <p className="text-xs font-semibold text-red-700 mb-2">⚡ KINETIC ENERGY</p>
              <p className="text-2xl font-bold text-red-600">{energyData.kineticEnergy.toFixed(3)} J</p>
            </div>
          )}

          {showEnergy && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded border-2 border-blue-200">
              <p className="text-xs font-semibold text-blue-700 mb-2">📍 POTENTIAL ENERGY</p>
              <p className="text-2xl font-bold text-blue-600">{energyData.potentialEnergy.toFixed(3)} J</p>
            </div>
          )}

          {showEnergy && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded border-2 border-green-200">
              <p className="text-xs font-semibold text-green-700 mb-2">📊 TOTAL ENERGY</p>
              <p className="text-2xl font-bold text-green-600">{energyData.totalEnergy.toFixed(3)} J</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">⏱️ PERIOD</p>
            <p className="text-2xl font-bold text-gray-600">{period.toFixed(3)} s</p>
          </div>

          {difficultyLevel === 'expert' && (
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-xs font-semibold text-yellow-700 mb-2">🔢 FREQUENCY</p>
              <p className="text-lg font-bold text-yellow-600">{(1 / period).toFixed(3)} Hz</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          ▶️ Start
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 disabled:bg-gray-400"
        >
          ⏸️ Pause
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          ↻ Reset
        </button>
      </div>

      {showAdvancedFeatures && (difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
          <p className="font-semibold text-yellow-700 mb-2">🔬 Advanced Physics:</p>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <p>Period T = 2π√(L/g) = {period.toFixed(3)} s</p>
            <p>Natural frequency ω = √(g/L) = {naturalFrequency.toFixed(3)} rad/s</p>
            <p>Moment of inertia I = mL² = {(m * L * L).toFixed(3)} kg·m²</p>
            <p>Damping ratio ζ = c / (2√(km)) ≈ {(damperCoeff / (2 * Math.sqrt(m * g / L))).toFixed(3)}</p>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 text-center">
        Difficulty: <span className="font-semibold text-gray-700">{difficultyLevel.toUpperCase()}</span>
      </div>
    </div>
  );
};
