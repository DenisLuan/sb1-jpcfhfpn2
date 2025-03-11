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
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Função para enviar os dados através do proxy
  const sendResultsToWebhook = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Preparando os dados
      const payload = {
        name: userInfo.name,
        email: userInfo.email,
        result: {
          type: result.type,
          title: result.title,
          description: result.description
        }
      };
      
      console.log("Payload para envio:", payload);
      
      // Se estiver rodando no Railway, use a URL relativa para o proxy
      // Nota: ajuste a URL abaixo conforme a configuração do seu servidor proxy
      const proxyUrl = '/api/webhook';
      
      console.log(`Enviando para o proxy: ${proxyUrl}`);
      
      // Envio através do proxy
      const response = await axios.post(proxyUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Resposta do proxy:", response.data);
      
      // Guardar informações de debug
      setDebugInfo({
        sentPayload: payload,
        receivedResponse: response.data
      });
      
      setSubmitted(true);
    } catch (error: any) {
      console.error("Erro ao enviar para o proxy:", error);
      
      // Informações detalhadas do erro para debug
      const errorDetails = {
        message: error.message
      };
      
      if (error.response) {
        errorDetails.status = error.response.status;
        errorDetails.data = error.response.data;
      }
      
      console.error("Detalhes do erro:", errorDetails);
      setDebugInfo(errorDetails);
      
      // Mensagem amigável para o usuário
      setError(`Erro ao enviar resultados. Por favor, tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para envio alternativo direto (sem proxy)
  const sendDirectToWebhook = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const payload = {
        name: userInfo.name,
        email: userInfo.email,
        result: {
          type: result.type,
          title: result.title,
          description: result.description
        }
      };
      
      console.log("Tentando envio direto para o webhook...");
      
      const response = await axios.post(
        'https://webhook.site/ec3d02de-4f8f-412a-a5c4-1fa6b5b71425', 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log("Resposta do envio direto:", response);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Erro no envio direto:", error);
      // Se falhar o envio direto, mostrar o erro mas não atualizar o estado de erro na interface
      // para não confundir o usuário
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enviar os dados quando o componente montar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!submitted) {
        sendResultsToWebhook();
      }
    }, 1000);
    
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
          <div className="mt-2 flex space-x-2">
            <button 
              onClick={() => sendResultsToWebhook()}
              disabled={isSubmitting}
              className="px-3 py-1 bg-red-100 rounded"
            >
              Tentar via proxy
            </button>
            <button 
              onClick={() => sendDirectToWebhook()}
              disabled={isSubmitting}
              className="px-3 py-1 bg-red-100 rounded"
            >
              Tentar direto
            </button>
          </div>
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

      {/* Área para informações de debug - visível apenas em ambiente de desenvolvimento */}
      {debugInfo && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-40 text-xs">
          <p className="font-bold mb-2">Debug Info:</p>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}

      <div className="space-y-4 mt-6">
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