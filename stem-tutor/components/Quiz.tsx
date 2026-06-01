import React, { useState } from 'react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

/**
 * Quiz - Interactieve vragen met feedback
 * 
 * Gebruikt voor:
 * - Kennis testen
 * - Direct feedback geven
 * - Socratische methode (hints)
 * 
 * @example
 * <Quiz
 *   title="Rekenen met procenten"
 *   questions={[
 *     {
 *       id: '1',
 *       question: 'Wat is 25% van €200?',
 *       options: ['€25', '€50', '€75', '€100'],
 *       correctAnswer: 1,
 *       explanation: '25% van €200 = 0.25 × 200 = €50',
 *       hint: 'Deel €200 door 4'
 *     }
 *   ]}
 * />
 */
export const Quiz: React.FC<QuizProps> = ({ title, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleAnswer = (answerIndex: number) => {
    if (!answered) {
      setSelectedAnswer(answerIndex);
      setAnswered(true);
      if (answerIndex === question.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setShowHint(false);
    } else {
      setCompleted(true);
      onComplete?.(score + (isCorrect ? 1 : 0));
    }
  };

  if (completed) {
    const finalScore = score + (isCorrect ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz compleet! 🎉</h2>
        <p className="text-4xl font-bold text-green-600 mb-4">{percentage}%</p>
        <p className="text-gray-700 mb-4">
          Je hebt {finalScore} van {questions.length} vragen correct beantwoord.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Quiz opnieuw doen
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-sm text-gray-600 mb-6">
        Vraag {currentQuestion + 1} van {questions.length}
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={answered}
              className={`w-full text-left p-4 rounded border-2 transition ${
                answered
                  ? index === question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : index === selectedAnswer
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {answered && (
        <div className={`p-4 rounded mb-4 ${isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
          <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '✅ Correct!' : '❌ Niet correct.'}
          </p>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}

      {answered && question.hint && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="text-blue-600 underline mb-4"
        >
          💡 Hint weergeven
        </button>
      )}

      {showHint && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
          <p className="text-gray-700">{question.hint}</p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
        >
          {currentQuestion === questions.length - 1 ? 'Resultaten zien' : 'Volgende vraag'}
        </button>
      )}
    </div>
  );
};
