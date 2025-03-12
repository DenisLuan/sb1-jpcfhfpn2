import React from 'react';
import { UserForm } from './components/UserForm';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { UserInfo } from './types';
import { results } from './data';

function App() {
  const [step, setStep] = React.useState<'form' | 'quiz' | 'results'>('form');
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [result, setResult] = React.useState<typeof results[keyof typeof results] | null>(null);

  const handleUserSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setStep('quiz');
  };

  const handleQuizComplete = (answers: string[]) => {
    // Calcula a resposta mais frequente
    const counts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequent = Object.entries(counts).reduce((a, b) =>
      (counts[a[0]] > counts[b[0]] ? a : b)
    )[0] as keyof typeof results;

    setResult(results[mostFrequent]);
    setStep('results');
  };

  const handleRestart = () => {
    setStep('form');
    setUserInfo(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {step === 'form' && <UserForm onSubmit={handleUserSubmit} />}
        {step === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
        {step === 'results' && result && userInfo && (
          <Results 
            result={result} 
            onRestart={handleRestart}
            userInfo={userInfo}
          />
        )}
      </div>
    </div>
  );
}

export default App;
