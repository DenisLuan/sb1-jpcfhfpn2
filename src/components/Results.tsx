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
  const [attemptCount, setAttemptCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Função para adicionar informações de debug
  const addDebugInfo = (info: string) => {
    console.log(`[DEBUG] ${info}`);
    setDebugInfo(prev => [...prev, info]);
  };

  // Função para criar um pixel de rastreamento garantido
  const sendViaPixelTracking = () => {
    try {
      addDebugInfo(`Tentativa ${attemptCount + 1}: Iniciando pixel tracking`);
      
      // Construir um objeto com todos os dados
      const data = {
        name: userInfo.name || 'sem_nome',
        email: userInfo.email || 'sem_email',
        resultType: result.type,
        resultTitle: result.title,
        resultDescription: result.description.substring(0, 100) // Truncando para evitar URLs muito longas
      };
      
      addDebugInfo(`Dados para envio: ${JSON.stringify(data)}`);
      
      // Converter o objeto em uma string de consulta
      const queryParams = Object.entries(data)
        .map(([key, value]) => {
          // Garantindo que não haja valores undefined/null e que todos sejam strings
          const safeValue = value === undefined || value === null ? '' : String(value);
          return `${encodeURIComponent(key)}=${encodeURIComponent(safeValue)}`;
        })
        .join('&');
      
      // Adicionar um timestamp para evitar cache
      const timestamp = Date.now();
      const fullUrl = `https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774?${queryParams}&_t=${timestamp}`;
      
      addDebugInfo(`URL completa: ${fullUrl.substring(0, 100)}...`);
      
      // Criar e inserir uma imagem de pixel de rastreamento
      const img = new Image();
      img.width = 1;
      img.height = 1;
      img.style.display = 'none';
      
      // Sucesso ao carregar a imagem
      img.onload = () => {
        addDebugInfo('Pixel carregado com sucesso!');
        setSubmitted(true);
        document.body.removeChild(img);
      };
      
      // Falha ao carregar a imagem
      img.onerror = () => {
        // Mesmo com erro, consideramos enviado, pois a requisição foi feita
        addDebugInfo('Erro ao carregar pixel, mas requisição foi enviada');
        setSubmitted(true);
        document.body.removeChild(img);
      };
      
      // Definir o src e adicionar ao documento
      img.src = fullUrl;
      document.body.appendChild(img);
      
      // Incrementar o contador de tentativas
      setAttemptCount(prev => prev + 1);
    } catch (error) {
      addDebugInfo(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Tenta alternativa com beacon API
  const sendViaBeacon = () => {
    try {
      addDebugInfo('Tentando envio via Beacon API');
      
      const data = {
        name: userInfo.name,
        email: userInfo.email,
        resultType: result.type,
        resultTitle: result.title
      };
      
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const success = navigator.sendBeacon('https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774', blob);
      
      if (success) {
        addDebugInfo('Beacon enviado com sucesso');
        setSubmitted(true);
      } else {
        addDebugInfo('Falha ao enviar via Beacon');
      }
    } catch (error) {
      addDebugInfo(`Erro no Beacon: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Tenta abrir o URL diretamente
  const openUrlDirectly = () => {
    try {
      addDebugInfo('Tentando abrir URL diretamente');
      
      const params = new URLSearchParams();
      params.append('name', userInfo.name);
      params.append('email', userInfo.email);
      params.append('resultType', result.type);
      params.append('resultTitle', result.title);
      
      const url = `https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774?${params.toString()}`;
      
      // Abre em uma nova aba
      window.open(url, '_blank');
      
      setSubmitted(true);
      addDebugInfo('URL aberta em nova aba');
    } catch (error) {
      addDebugInfo(`Erro ao abrir URL: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Tenta enviar automaticamente no carregamento
  useEffect(() => {
    addDebugInfo('Componente Results montado');
    addDebugInfo(`UserInfo: ${JSON.stringify(userInfo)}`);
    
    const timer = setTimeout(() => {
      if (!submitted) {
        sendViaPixelTracking();
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

      {/* Confirmação de sucesso */}
      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          Resultados enviados com sucesso!
        </div>
      ) : (
        <div className="mb-6 space-y-2">
          <p className="text-gray-600">
            Escolha um método para enviar seus resultados:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={sendViaPixelTracking}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Pixel Tracking
            </button>
            <button 
              onClick={sendViaBeacon}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Beacon API
            </button>
            <button 
              onClick={openUrlDirectly}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Abrir no Navegador
            </button>
          </div>
        </div>
      )}

      {/* Área de debug */}
      {debugInfo.length > 0 && (
        <div className="mt-4 mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg text-left">
          <p className="text-sm font-medium text-gray-700 mb-2">Logs de depuração:</p>
          <div className="max-h-40 overflow-y-auto text-xs font-mono">
            {debugInfo.map((log, index) => (
              <div key={index} className="py-1 border-b border-gray-100 text-gray-600">
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