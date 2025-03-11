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

// URL do webhook
const WEBHOOK_URL = 'https://webhook.site/ec3d02de-4f8f-412a-a5c4-1fa6b5b71425';

export function Results({ result, onRestart, userInfo }: ResultsProps) {
  const Icon = icons[result.type];
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Função para adicionar logs que serão visíveis no console E no componente
  const addLog = (message: string) => {
    console.log(`[WEBHOOK_LOG] ${message}`);
    setLogMessages(prev => [...prev, message]);
  };

  // Função para enviar via axios com logs detalhados
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
      
      addLog(`Preparando envio de dados: ${JSON.stringify(payload)}`);
      
      // Configurando Axios com timeout mais longo e headers completos
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'axios/quiz-app'
        },
        timeout: 15000, // 15 segundos de timeout
      };
      
      addLog(`Enviando para ${WEBHOOK_URL} com config: ${JSON.stringify(axiosConfig)}`);
      
      // Tentando enviar com Axios
      try {
        const response = await axios.post(WEBHOOK_URL, payload, axiosConfig);
        
        addLog(`Resposta recebida: Status ${response.status}`);
        addLog(`Headers de resposta: ${JSON.stringify(response.headers)}`);
        
        if (response.data) {
          addLog(`Corpo da resposta: ${JSON.stringify(response.data)}`);
        }
        
        if (response.status >= 200 && response.status < 300) {
          setSubmitted(true);
          addLog('Envio bem-sucedido!');
        } else {
          throw new Error(`Status inesperado: ${response.status}`);
        }
      } catch (axiosError: any) {
        // Detalhando os erros do Axios
        if (axiosError.response) {
          // O servidor respondeu com um status fora do intervalo 2xx
          addLog(`Erro de resposta: Status ${axiosError.response.status}`);
          addLog(`Dados de erro: ${JSON.stringify(axiosError.response.data)}`);
          setError(`Erro do servidor: ${axiosError.response.status}`);
        } else if (axiosError.request) {
          // A requisição foi feita mas não houve resposta
          addLog('Nenhuma resposta recebida do servidor');
          setError('O servidor não respondeu. Verifique sua conexão.');
        } else {
          // Erro ao configurar a requisição
          addLog(`Erro de configuração: ${axiosError.message}`);
          setError(`Erro ao preparar a requisição: ${axiosError.message}`);
        }
        
        throw axiosError; // Re-throw para ser capturado pelo catch exterior
      }
    } catch (error: any) {
      console.error('Erro completo:', error);
      addLog(`Erro geral: ${error.message}`);
      
      // Mensagem amigável para o usuário
      setError(`Falha ao enviar os resultados. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para tentar novamente
  const handleRetry = () => {
    setLogMessages([]);
    addLog('Tentando novamente...');
    sendResultsToWebhook();
  };

  // Enviar os dados quando o componente montar, com um atraso
  useEffect(() => {
    addLog('Componente Results montado');
    addLog(`UserInfo: ${JSON.stringify(userInfo)}`);
    addLog(`Result: ${JSON.stringify(result)}`);
    
    const timer = setTimeout(() => {
      if (!submitted) {
        addLog('Iniciando envio automático após delay');
        sendResultsToWebhook();
      }
    }, 1000); // Delay maior (1 segundo) para garantir que tudo está pronto
    
    return () => {
      clearTimeout(timer);
      addLog('Componente desmontado, timer limpo');
    };
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

      {/* Área de logs (visível apenas em desenvolvimento) */}
      {logMessages.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
          <h3 className="font-bold mb-2">Logs de depuração:</h3>
          <div className="max-h-40 overflow-y-auto text-xs font-mono">
            {logMessages.map((log, index) => (
              <div key={index} className="py-1 border-b border-gray-200">
                {log}
              </div>
            ))}
          </div>
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