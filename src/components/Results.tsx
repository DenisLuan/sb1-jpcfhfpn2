import React, { useEffect, useState } from 'react';
import { Result, UserInfo } from '../types';
import { Heart, Star, Sparkles } from 'lucide-react';

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
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  // Mantenha os logs no console, mas não os exiba na UI
  const addLog = (message: string) => {
    console.log(`[LOG] ${message}`);
  };

  // Enviar dados via fetch/GET
  const sendDataWithFetch = async () => {
    try {
      addLog('Tentando enviar dados via fetch/GET');
      
      const params = new URLSearchParams();
      params.append('name', userInfo.name || 'sem_nome');
      params.append('email', userInfo.email || 'sem_email');
      params.append('resultType', result.type);
      params.append('resultTitle', result.title);
      params.append('method', 'fetch_get');
      params.append('timestamp', Date.now().toString());
      
      const response = await fetch(`https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*'
        }
      });
      
      if (response.ok) {
        addLog('Dados enviados com sucesso via fetch/GET');
        setSubmitted(true);
        return true;
      } else {
        addLog(`Erro no fetch/GET: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      addLog(`Erro no fetch/GET: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  };

  // Função para redirecionamento temporário (mantida como backup)
  const redirectToWebhook = () => {
    setRedirecting(true);
    
    // Iniciar countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          
          // Construir a URL com os parâmetros
          const params = new URLSearchParams();
          params.append('name', userInfo.name || 'sem_nome');
          params.append('email', userInfo.email || 'sem_email');
          params.append('resultType', result.type);
          params.append('resultTitle', result.title);
          params.append('description', result.description.substring(0, 100));
          params.append('method', 'redirect');
          params.append('timestamp', Date.now().toString());
          
          // URL de redirecionamento
          const webhookUrl = `https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774?${params.toString()}`;
          
          // URL de retorno (a mesma página atual)
          const returnUrl = window.location.href;
          
          // Construir URL final com retorno automático
          const finalUrl = `${webhookUrl}&returnUrl=${encodeURIComponent(returnUrl)}`;
          
          // Redirecionar para o webhook
          window.location.href = finalUrl;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  };

  // Tenta enviar automaticamente
  useEffect(() => {
    const sendData = async () => {
      addLog('Iniciando envio automático de dados');
      addLog(`UserInfo: ${JSON.stringify({name: userInfo.name, email: userInfo.email})}`);
      addLog(`Result: ${JSON.stringify({type: result.type, title: result.title})}`);
      
      // Tentar enviar via fetch/GET
      const fetchSuccess = await sendDataWithFetch();
      
      // Se falhar, tenta com redirecionamento automaticamente
      if (!fetchSuccess) {
        addLog('Fetch falhou, tentando redirecionamento');
        redirectToWebhook();
      }
    };
    
    // Pequeno delay antes de enviar
    const timer = setTimeout(() => {
      if (!submitted && !redirecting) {
        sendData();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Verificar se estamos retornando de um redirecionamento
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('fromWebhook')) {
      addLog('Retornando de redirecionamento para webhook');
      setSubmitted(true);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
      {redirecting ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-3">Redirecionando...</h2>
          <p className="text-gray-600 mb-2">
            Você será redirecionado em {countdown} segundo{countdown !== 1 ? 's' : ''}.
          </p>
          <p className="text-gray-500 text-sm">
            Você retornará automaticamente a esta página em instantes.
          </p>
        </div>
      ) : (
        <>
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

          {/* Confirmação de sucesso */}
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
        </>
      )}
    </div>
  );
}