import React, { useState, useEffect, useRef } from 'react';
import { EducationalComponentProps } from '../types/EducationalComponentProps';

interface ProjectileSimulationProps extends EducationalComponentProps {
  /**
   * Initial launch angle in degrees
   */
  launchAngle?: number;
  
  /**
   * Initial velocity in m/s
   */
  initialVelocity?: number;
  
  /**
   * Gravity constant (m/s²) - default 9.81
   */
  gravity?: number;
  
  /**
   * Show velocity vector
   */
  showVelocityVector?: boolean;
  
  /**
   * Show trajectory path
   */
  showTrajectory?: boolean;
  
  /**
   * Show coordinate grid
   */
  showGrid?: boolean;
}

interface ProjectileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
  isFlying: boolean;
}

/**
 * ProjectileSimulation - Physics simulation of projectile motion
 * 
 * Interactive simulation showing how launch angle, velocity, and gravity
 * affect projectile trajectories. Includes real-time physics calculations.
 * 
 * @example
 * <ProjectileSimulation
 *   title="Projectile Motion Simulator"
 *   explanation="Explore how angle and velocity affect trajectories"
 *   launchAngle={45}
 *   initialVelocity={20}
 *   gravity={9.81}
 *   difficultyLevel="intermediate"
 * />
 */
export const ProjectileSimulation: React.FC<ProjectileSimulationProps> = ({
  title = 'Projectile Motion Simulator',
  explanation = 'Launch a projectile and observe its motion under gravity',
  instructions = [
    'Adjust launch angle (0-90 degrees)',
    'Set initial velocity',
    'Click "Launch" to start simulation',
    'Observe the trajectory and measurements'
  ],
  difficultyLevel = 'intermediate',
  lessonContext = 'Physics - Mechanics - Projectile Motion',
  learningObjectives = [
    'Understand projectile motion principles',
    'Apply kinematic equations',
    'Analyze trajectory parameters'
  ],
  launchAngle = 45,
  initialVelocity = 20,
  gravity = 9.81,
  showVelocityVector = true,
  showTrajectory = true,
  showGrid = true,
  showAdvancedFeatures = false,
  dynamicParameters = {},
  onLessonComplete,
  onMetricsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(launchAngle);
  const [velocity, setVelocity] = useState(initialVelocity);
  const [g, setG] = useState(gravity);
  const [isPlaying, setIsPlaying] = useState(false);
  const [projectileState, setProjectileState] = useState<ProjectileState>({
    x: 50,
    y: 0,
    vx: velocity * Math.cos((angle * Math.PI) / 180),
    vy: velocity * Math.sin((angle * Math.PI) / 180),
    time: 0,
    isFlying: false,
  });
  const [trajectory, setTrajectory] = useState<Array<{ x: number; y: number }>>([
    { x: 50, y: 0 },
  ]);
  const [metrics, setMetrics] = useState({
    maxHeight: 0,
    range: 0,
    flightTime: 0,
    maxDistance: 0,
  });

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Physics simulation step
  const simulateStep = (state: ProjectileState, deltaTime: number): ProjectileState => {
    if (!state.isFlying) return state;

    // Using kinematic equations:
    // v_y = v_y0 - g*t
    // y = y0 + v_y0*t - (1/2)*g*t²
    // x = x0 + v_x*t

    const newVy = state.vy - g * deltaTime;
    const newY = state.y + state.vy * deltaTime - 0.5 * g * deltaTime * deltaTime;
    const newX = state.x + state.vx * deltaTime;

    const newTime = state.time + deltaTime;

    // Stop if hits ground (y <= 0)
    const isFlying = newY > 0;

    return {
      x: newX,
      y: Math.max(0, newY),
      vx: state.vx,
      vy: newVy,
      time: newTime,
      isFlying,
    };
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      const now = Date.now();
      if (!startTimeRef.current) startTimeRef.current = now;

      const elapsed = (now - startTimeRef.current) / 1000; // Convert to seconds

      const newState = simulateStep(projectileState, 0.01);
      setProjectileState(newState);

      if (newState.isFlying) {
        // Update trajectory
        setTrajectory((prev) => [...prev, { x: newState.x, y: newState.y }]);

        // Update metrics
        setMetrics((prev) => ({
          ...prev,
          maxHeight: Math.max(prev.maxHeight, newState.y),
          range: newState.x,
          flightTime: newState.time,
          maxDistance: Math.max(prev.maxDistance, newState.x),
        }));

        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        onLessonComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, projectileState, g]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = width / 100; // 100 units wide

    // Clear canvas
    ctx.fillStyle = '#87ceeb'; // Sky blue
    ctx.fillRect(0, 0, width, height * 0.7);
    ctx.fillStyle = '#8b7355'; // Ground brown
    ctx.fillRect(0, height * 0.7, width, height * 0.3);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 100; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, height);
        ctx.stroke();
      }
    }

    // Draw launch point
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(50 * scale, (height * 0.7), 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw trajectory
    if (showTrajectory && trajectory.length > 1) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const firstPoint = trajectory[0];
      ctx.moveTo(firstPoint.x * scale, height * 0.7 - firstPoint.y * scale);

      for (let i = 1; i < trajectory.length; i++) {
        const point = trajectory[i];
        ctx.lineTo(point.x * scale, height * 0.7 - point.y * scale);
      }
      ctx.stroke();
    }

    // Draw projectile
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(
      projectileState.x * scale,
      height * 0.7 - projectileState.y * scale,
      5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw velocity vector
    if (showVelocityVector && projectileState.isFlying) {
      const vectorScale = 0.5;
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        projectileState.x * scale,
        height * 0.7 - projectileState.y * scale
      );
      ctx.lineTo(
        projectileState.x * scale + projectileState.vx * vectorScale,
        height * 0.7 - projectileState.vy * vectorScale
      );
      ctx.stroke();

      // Arrowhead
      const headlen = 15;
      const angle = Math.atan2(
        -projectileState.vy * vectorScale,
        projectileState.vx * vectorScale
      );
      ctx.beginPath();
      ctx.moveTo(
        projectileState.x * scale + projectileState.vx * vectorScale,
        height * 0.7 - projectileState.vy * vectorScale
      );
      ctx.lineTo(
        projectileState.x * scale +
        projectileState.vx * vectorScale -
        headlen * Math.cos(angle - Math.PI / 6),
        height * 0.7 -
        projectileState.vy * vectorScale -
        headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(
        projectileState.x * scale + projectileState.vx * vectorScale,
        height * 0.7 - projectileState.vy * vectorScale
      );
      ctx.lineTo(
        projectileState.x * scale +
        projectileState.vx * vectorScale -
        headlen * Math.cos(angle + Math.PI / 6),
        height * 0.7 -
        projectileState.vy * vectorScale -
        headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }

    // Draw labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('0m', 10, height * 0.7 + 20);
    ctx.fillText('100m', width - 40, height * 0.7 + 20);
  }, [projectileState, trajectory, showGrid, showTrajectory, showVelocityVector]);

  const handleLaunch = () => {
    const angleRad = (angle * Math.PI) / 180;
    setProjectileState({
      x: 0,
      y: 0,
      vx: velocity * Math.cos(angleRad),
      vy: velocity * Math.sin(angleRad),
      time: 0,
      isFlying: true,
    });
    setTrajectory([{ x: 0, y: 0 }]);
    setMetrics({ maxHeight: 0, range: 0, flightTime: 0, maxDistance: 0 });
    setIsPlaying(true);
    startTimeRef.current = null;
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProjectileState({
      x: 0,
      y: 0,
      vx: velocity * Math.cos((angle * Math.PI) / 180),
      vy: velocity * Math.sin((angle * Math.PI) / 180),
      time: 0,
      isFlying: false,
    });
    setTrajectory([{ x: 0, y: 0 }]);
    setMetrics({ maxHeight: 0, range: 0, flightTime: 0, maxDistance: 0 });
  };

  // Calculate theoretical maximum range (no air resistance)
  const theoreticalMaxRange = (velocity * velocity * Math.sin((2 * angle * Math.PI) / 180)) / g;
  const theoreticalMaxHeight = (velocity * velocity * Math.sin((angle * Math.PI) / 180) ** 2) / (2 * g);
  const theoreticalFlightTime = (2 * velocity * Math.sin((angle * Math.PI) / 180)) / g;

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

      <div className="mb-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="border-2 border-gray-300 rounded w-full bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Launch Angle: <span className="text-blue-600 text-lg">{angle.toFixed(1)}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full"
          />
        </div>

        <div className="bg-green-50 p-4 rounded">
          <label className="block text-sm font-semibold mb-2">
            Initial Velocity: <span className="text-green-600 text-lg">{velocity.toFixed(1)} m/s</span>
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full"
          />
        </div>

        {(difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
          <div className="bg-purple-50 p-4 rounded">
            <label className="block text-sm font-semibold mb-2">
              Gravity: <span className="text-purple-600 text-lg">{g.toFixed(2)} m/s²</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={g}
              onChange={(e) => setG(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleLaunch}
          disabled={isPlaying}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isPlaying ? '🚀 In Flight...' : '🚀 Launch'}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          ↻ Reset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded">
          <p className="text-xs text-gray-600">Max Height</p>
          <p className="text-lg font-bold text-blue-600">{Math.max(metrics.maxHeight, theoreticalMaxHeight).toFixed(1)} m</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded">
          <p className="text-xs text-gray-600">Range</p>
          <p className="text-lg font-bold text-green-600">{Math.max(metrics.range, theoreticalMaxRange).toFixed(1)} m</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded">
          <p className="text-xs text-gray-600">Flight Time</p>
          <p className="text-lg font-bold text-purple-600">{Math.max(metrics.flightTime, theoreticalFlightTime).toFixed(2)} s</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded">
          <p className="text-xs text-gray-600">Initial Speed</p>
          <p className="text-lg font-bold text-orange-600">{velocity.toFixed(1)} m/s</p>
        </div>
      </div>

      {showAdvancedFeatures && (difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="font-semibold text-yellow-700 mb-2">🔬 Advanced Physics:</p>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <p>v₀ₓ = {velocity} × cos({angle}°) = {(velocity * Math.cos((angle * Math.PI) / 180)).toFixed(2)} m/s</p>
            <p>v₀ᵧ = {velocity} × sin({angle}°) = {(velocity * Math.sin((angle * Math.PI) / 180)).toFixed(2)} m/s</p>
            <p>h(max) = v₀ᵧ² / (2g) = {theoreticalMaxHeight.toFixed(2)} m</p>
            <p>R = (v₀² × sin(2θ)) / g = {theoreticalMaxRange.toFixed(2)} m</p>
            <p>T = (2 × v₀ᵧ) / g = {theoreticalFlightTime.toFixed(2)} s</p>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 text-center">
        Difficulty: <span className="font-semibold text-gray-700">{difficultyLevel.toUpperCase()}</span>
      </div>
    </div>
  );
};
