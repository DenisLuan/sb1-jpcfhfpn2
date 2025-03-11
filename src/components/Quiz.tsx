import React from 'react';
import { Question } from '../types';
import { questions } from '../data';

interface QuizProps {
  onComplete: (answers: string[]) => void;
}

export function Quiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>([]);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 text-right">
          Questão {currentQuestion + 1} de {questions.length}
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">{question.text}</h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.value)}
            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition duration-200"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}