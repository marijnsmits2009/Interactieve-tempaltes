import React, { useState } from 'react';
import { EducationalComponentProps } from '../types/EducationalComponentProps';

interface GeometryExplorerProps extends EducationalComponentProps {
  /**
   * Shape type: circle, square, triangle, star, polygon
   */
  shapeType?: 'circle' | 'square' | 'triangle' | 'star' | 'polygon';
  
  /**
   * Rotation angle in degrees
   */
  rotation?: number;
  
  /**
   * Scale factor (1 = normal size)
   */
  scale?: number;
  
  /**
   * Fill color (hex)
   */
  fillColor?: string;
  
  /**
   * Number of polygon sides (for polygon type)
   */
  polygonSides?: number;
  
  /**
   * Show coordinate grid
   */
  showGrid?: boolean;
  
  /**
   * Show measurements
   */
  showMeasurements?: boolean;
}

/**
 * GeometryExplorer - Interactive geometry shape explorer
 * 
 * Allows students to explore geometric shapes with transformations.
 * Includes rotation, scaling, and property calculations.
 * 
 * @example
 * <GeometryExplorer
 *   title="Geometry Shapes Explorer"
 *   explanation="Learn about geometric shapes and transformations"
 *   shapeType="circle"
 *   scale={1}
 *   rotation={0}
 *   difficultyLevel="beginner"
 * />
 */
export const GeometryExplorer: React.FC<GeometryExplorerProps> = ({
  title = 'Geometry Explorer',
  explanation = 'Explore geometric shapes and learn about their properties',
  instructions = [
    'Select a shape from the dropdown',
    'Rotate the shape using the rotation slider',
    'Scale the shape larger or smaller',
    'Change the color',
    'Observe how properties change'
  ],
  difficultyLevel = 'beginner',
  lessonContext = 'Mathematics - Geometry',
  learningObjectives = [
    'Understand geometric shapes',
    'Learn about transformations',
    'Calculate area and perimeter'
  ],
  shapeType = 'circle',
  rotation = 0,
  scale = 1,
  fillColor = '#2563eb',
  polygonSides = 5,
  showGrid = true,
  showMeasurements = true,
  showAdvancedFeatures = false,
  dynamicParameters = {},
  onLessonComplete,
  onMetricsUpdate,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState(shapeType);
  const [angle, setAngle] = useState(rotation);
  const [size, setSize] = useState(scale);
  const [color, setColor] = useState(fillColor);
  const [sides, setSides] = useState(polygonSides);
  const [showOutline, setShowOutline] = useState(true);

  const radius = 80 * size; // Base radius

  // Calculate properties based on shape
  const calculateProperties = () => {
    switch (type) {
      case 'circle':
        return {
          area: (Math.PI * radius * radius).toFixed(2),
          perimeter: (2 * Math.PI * radius).toFixed(2),
          label: 'Circle',
          formula: `A = πr², P = 2πr`
        };
      
      case 'square':
        const squareSide = radius * Math.sqrt(2);
        return {
          area: (squareSide * squareSide).toFixed(2),
          perimeter: (4 * squareSide).toFixed(2),
          label: 'Square',
          formula: `A = s², P = 4s`
        };
      
      case 'triangle':
        const triHeight = radius * 1.5;
        const triBase = radius * Math.sqrt(3);
        return {
          area: (0.5 * triBase * triHeight).toFixed(2),
          perimeter: (3 * radius).toFixed(2),
          label: 'Equilateral Triangle',
          formula: `A = (√3/4)s², P = 3s`
        };
      
      case 'star':
        return {
          area: 'Complex',
          perimeter: 'Complex',
          label: '5-Point Star',
          formula: 'Star composed of triangles'
        };
      
      case 'polygon':
        const apothem = radius * Math.cos(Math.PI / sides);
        const polyPerimeter = 2 * sides * radius * Math.sin(Math.PI / sides);
        const polyArea = 0.5 * polyPerimeter * apothem;
        return {
          area: polyArea.toFixed(2),
          perimeter: polyPerimeter.toFixed(2),
          label: `${sides}-sided Polygon`,
          formula: `A = (1/2)×P×a, P = 2ns×sin(π/n)`
        };
      
      default:
        return { area: '0', perimeter: '0', label: '', formula: '' };
    }
  };

  // Draw shape on canvas
  React.useEffect(() => {
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
      const gridSpacing = 20;
      
      for (let i = 0; i < width; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      for (let i = 0; i < height; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
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

    // Save context state
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);

    // Set fill and stroke
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    // Draw shape
    switch (type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        if (showOutline) ctx.stroke();
        break;

      case 'square':
        const squareSize = radius * Math.sqrt(2);
        ctx.fillRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
        if (showOutline) ctx.strokeRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(radius * Math.cos(7 * Math.PI / 6), radius * Math.sin(7 * Math.PI / 6));
        ctx.lineTo(radius * Math.cos(11 * Math.PI / 6), radius * Math.sin(11 * Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        if (showOutline) ctx.stroke();
        break;

      case 'star':
        // Draw 5-point star
        const starPoints = 5;
        const outerRadius = radius;
        const innerRadius = radius * 0.4;
        ctx.beginPath();
        for (let i = 0; i < starPoints * 2; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / starPoints - Math.PI / 2;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        if (showOutline) ctx.stroke();
        break;

      case 'polygon':
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        if (showOutline) ctx.stroke();
        break;
    }

    // Draw rotation indicator
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 20, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.restore();

    // Draw rotation angle
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Rotation: ${angle.toFixed(1)}°`, 10, 30);
  }, [type, angle, size, color, sides, showGrid, showOutline]);

  const properties = calculateProperties();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">📐 {lessonContext}</p>
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
              Shape Type: <span className="text-blue-600 font-bold">{type.toUpperCase()}</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle (Equilateral)</option>
              {(difficultyLevel === 'intermediate' || difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
                <>
                  <option value="star">Star (5-point)</option>
                  <option value="polygon">Regular Polygon</option>
                </>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Rotation: <span className="text-green-600 text-lg">{angle.toFixed(1)}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="bg-purple-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Scale: <span className="text-purple-600 text-lg">{size.toFixed(2)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded">
            <label className="block text-sm font-semibold mb-2">
              Color:
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          {type === 'polygon' && (
            <div className="bg-pink-50 p-4 rounded">
              <label className="block text-sm font-semibold mb-2">
                Polygon Sides: <span className="text-pink-600 text-lg">{sides}</span>
              </label>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={sides}
                onChange={(e) => setSides(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="outline"
              checked={showOutline}
              onChange={(e) => setShowOutline(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="outline" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Show Outline
            </label>
          </div>
        </div>
      </div>

      {showMeasurements && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded border-2 border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">AREA</p>
            <p className="text-2xl font-bold text-blue-600">{properties.area}</p>
            <p className="text-xs text-gray-600 mt-2">Square units</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded border-2 border-green-200">
            <p className="text-xs font-semibold text-green-700 mb-1">PERIMETER</p>
            <p className="text-2xl font-bold text-green-600">{properties.perimeter}</p>
            <p className="text-xs text-gray-600 mt-2">Linear units</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded border-2 border-purple-200">
            <p className="text-xs font-semibold text-purple-700 mb-1">FORMULA</p>
            <p className="text-sm font-mono text-purple-600">{properties.formula}</p>
          </div>
        </div>
      )}

      {showAdvancedFeatures && (difficultyLevel === 'advanced' || difficultyLevel === 'expert') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="font-semibold text-yellow-700 mb-2">🔬 Advanced Properties:</p>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            {type === 'circle' && (
              <>
                <p>Radius = {radius.toFixed(2)}</p>
                <p>Diameter = {(2 * radius).toFixed(2)}</p>
                <p>Circumference = {(2 * Math.PI * radius).toFixed(2)}</p>
              </>
            )}
            {type === 'polygon' && (
              <>
                <p>Sides: {sides}</p>
                <p>Interior Angle: {(((sides - 2) * 180) / sides).toFixed(2)}°</p>
                <p>Central Angle: {(360 / sides).toFixed(2)}°</p>
              </>
            )}
            <p>Scale Factor: {size.toFixed(2)}</p>
            <p>Rotation: {angle.toFixed(1)}°</p>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 text-center">
        Difficulty: <span className="font-semibold text-gray-700">{difficultyLevel.toUpperCase()}</span>
      </div>
    </div>
  );
};
