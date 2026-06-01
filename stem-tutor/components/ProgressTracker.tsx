import React from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  percentage: number;
}

interface ProgressTrackerProps {
  studentName: string;
  level: number;
  progress: number;
  totalPoints: number;
  achievements: Achievement[];
}

/**
 * ProgressTracker - Voortgang en behaalde doelen tonen
 * 
 * Gebruikt voor:
 * - Voortgang visueel maken
 * - Motivatie verhogen
 * - Behaalde doelen tonen
 * - Level-up systeem
 * 
 * @example
 * <ProgressTracker
 *   studentName="Janssen"
 *   level={3}
 *   progress={65}
 *   totalPoints={250}
 *   achievements={[
 *     {
 *       id: 'proc',
 *       title: 'Procenten meester',
 *       description: 'Alle procenten-oefeningen voltooid',
 *       completed: true,
 *       percentage: 100
 *     }
 *   ]}
 * />
 */
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  studentName,
  level,
  progress,
  totalPoints,
  achievements
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">{studentName}</h2>
        <p className="text-gray-600">Level {level}</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">Voortgang:</span>
          <span className="text-lg font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded">
        <p className="text-sm text-gray-600 mb-1">Totale Punten</p>
        <p className="text-3xl font-bold text-orange-600">{totalPoints} 🏆</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-700 mb-4">Behaalde vaardigheden</h3>
        <div className="space-y-3">
          {achievements.map(achievement => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">
                    {achievement.completed ? '✅' : '🔒'} {achievement.title}
                  </p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              {!achievement.completed && (
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${achievement.percentage}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
