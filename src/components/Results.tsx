import React, { useEffect, useState } from 'react';
import { Result, UserInfo } from '../types';
import { Heart, Star, Sparkles } from 'lucide-react';
import axios from 'axios';

interface ResultsProps {
  result: Result;
  onRestart: () => void;
  userInfo: UserInfo;
}

const icons = {
  A: Star,
  B: Sparkles,
  C: Heart,
};

export function Results({ result, onRestart, userInfo }: ResultsProps) {
  const Icon = icons[result.type];
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para enviar via axios
  const sendResultsToWebhook = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = {
        name: userInfo.name,
        email: userInfo.email,
        result: {
          type: result.type,
          title: result.title,
          description: result.description
        }
      };
      
      console.log("Sending data to webhook:", data);
      
      // Usando axios em vez de fetch
      const response = await axios.post(
        'https://webhook.site/ec3d02de-4f8f-412a-a5c4-1fa6b5b71425', 
        data, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log("Webhook response:", response);
      
      if (response.status >= 200 && response.status < 300) {
        setSubmitted(true);
        console.log('Results sent successfully');
      } else {
        setError(`Erro ao enviar: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending results:', error);
      // Mensagem de erro mais amigável para o usuário
      setError(`Erro de conexão. Por favor, verifique sua internet e tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tentar novamente quando o usuário clicar no botão
  const handleRetry = () => {
    sendResultsToWebhook();
  };

  // Enviar os dados quando o componente montar
  useEffect(() => {
    // Pequeno delay para garantir que tudo está pronto
    const timer = setTimeout(() => {
      if (!submitted) {
        sendResultsToWebhook();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
      <Icon className="w-16 h-16 text-pink-500 mx-auto mb-6" />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {userInfo.name}, {result.title.toLowerCase()}
        </h2>
        <p className="text-gray-500">{userInfo.email}</p>
      </div>
      
      <p className="text-lg text-gray-600 mb-8">{result.description}</p>
      
      <div className="bg-pink-50 p-6 rounded-lg mb-8">
        <p className="text-lg text-pink-800">{result.cta}</p>
      </div>

      {/* Mostrar erros se houver */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error} 
          <button 
            onClick={handleRetry}
            disabled={isSubmitting}
            className="ml-2 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Mostrar status de envio */}
      {isSubmitting && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
          Enviando resultados...
        </div>
      )}

      {/* Mostrar confirmação de sucesso */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          Resultados enviados com sucesso!
        </div>
      )}

      <div className="space-y-4">
        <a
          href="#"
          className="block w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition duration-200"
          onClick={(e) => {
            e.preventDefault();
            // Add your CTA link handling here
          }}
        >
          Garantir Minha Vaga
        </a>
        
        <button
          onClick={onRestart}
          className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-200"
        >
          Refazer o Teste
        </button>
      </div>
    </div>
  );
}