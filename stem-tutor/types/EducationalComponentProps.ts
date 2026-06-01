/**
 * EducationalComponentProps - Shared interface for all STEM components
 * 
 * Allows LLM to dynamically configure and control any STEM component
 * with consistent properties across all learning modules.
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface EducationalComponentProps {
  /**
   * Component title/name
   * Example: "Projectile Motion Simulator"
   */
  title: string;

  /**
   * Detailed explanation of the concept
   * Example: "Understanding how objects move under gravity"
   */
  explanation: string;

  /**
   * Step-by-step instructions for the student
   * Example: ["Adjust the launch angle", "Set initial velocity", "Click Play"]
   */
  instructions?: string[];

  /**
   * Difficulty level (beginner, intermediate, advanced, expert)
   * Controls complexity of math, UI, and available features
   */
  difficultyLevel: DifficultyLevel;

  /**
   * Educational context/lesson this belongs to
   * Example: "Physics - Mechanics - Projectile Motion"
   */
  lessonContext?: string;

  /**
   * Learning objectives for this component
   * Example: ["Understand projectile trajectories", "Apply kinematic equations"]
   */
  learningObjectives?: string[];

  /**
   * Dynamic parameters that LLM can configure
   * Example: { minAngle: 0, maxAngle: 90, defaultAngle: 45 }
   */
  dynamicParameters?: Record<string, any>;

  /**
   * Whether to show advanced features (vectors, energy, etc.)
   */
  showAdvancedFeatures?: boolean;

  /**
   * Callback when simulation completes or reaches key milestone
   */
  onLessonComplete?: () => void;

  /**
   * Callback to send data to learning management system
   */
  onMetricsUpdate?: (metrics: LearningMetrics) => void;
}

/**
 * Metrics tracked during simulation for learning analytics
 */
export interface LearningMetrics {
  componentId: string;
  timestamp: number;
  userAction: string; // e.g., "adjusted_angle", "pressed_play"
  parametersUsed: Record<string, number>;
  timeSpent: number; // seconds
  attemptsCount: number;
  correct?: boolean;
}

/**
 * Preset configurations for different difficulty levels
 */
export const DIFFICULTY_PRESETS: Record<DifficultyLevel, any> = {
  beginner: {
    showGrid: true,
    showValues: true,
    showLabels: true,
    simplifiedPhysics: true,
    maxParameters: 2,
  },
  intermediate: {
    showGrid: true,
    showValues: true,
    showLabels: true,
    simplifiedPhysics: false,
    maxParameters: 4,
  },
  advanced: {
    showGrid: true,
    showValues: true,
    showLabels: true,
    simplifiedPhysics: false,
    maxParameters: 6,
  },
  expert: {
    showGrid: true,
    showValues: true,
    showLabels: true,
    simplifiedPhysics: false,
    maxParameters: 10,
  },
};
