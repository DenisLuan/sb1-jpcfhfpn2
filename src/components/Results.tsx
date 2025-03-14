import React, { useEffect, useState } from 'react';
import { Result, UserInfo } from '../types';
import { Heart, Star, Sparkles } from 'lucide-react';

interface ResultsProps {
  result: Result;
  onRestart: () => void;
  userInfo: UserInfo;  // userInfo inicial
}

const icons = {
  A: Star,
  B: Sparkles,
  C: Heart,
};

export function Results({ result, onRestart, userInfo }: ResultsProps) {
  // Mantém localmente as infos de userInfo,
  // para podermos sobrescrevê-las com as da URL, se existirem
  const [localUserInfo, setLocalUserInfo] = useState<UserInfo>(userInfo);
  const [submitted, setSubmitted] = useState(false);

  // Mantenha os logs no console, mas não os exiba na UI
  const addLog = (message: string) => {
    console.log(`[LOG] ${message}`);
  };

  // Lê parâmetros da URL e, se existirem, sobrescreve o state local
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nomeParam = params.get('nome');
    const emailParam = params.get('email');
    const foneParam = params.get('fone');

    addLog(`Parâmetros da URL - nome: ${nomeParam}, email: ${emailParam}, fone: ${foneParam}`);

    // Atualiza localUserInfo apenas se o parâmetro existir
    setLocalUserInfo((prev) => ({
      ...prev,
      name: nomeParam || prev.name,
      email: emailParam || prev.email,
      // Se você tiver um campo phone no seu UserInfo, pode sobrescrever aqui:
      phone: foneParam || prev.phone,
    }));
  }, []);

  // Enviar dados via fetch/GET
  const sendDataWithFetch = async (info: UserInfo) => {
    try {
      addLog('Tentando enviar dados via fetch/GET');

      const params = new URLSearchParams();
      params.append('name', info.name || 'sem_nome');
      params.append('email', info.email || 'sem_email');
      params.append('resultType', result.type);
      params.append('resultTitle', result.title);
      params.append('method', 'fetch_get');
      params.append('timestamp', Date.now().toString());

      const response = await fetch(
        `https://endpoint-criss-production.up.railway.app/webhook?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*'
          }
        }
      );

      if (response.ok) {
        addLog('Dados enviados com sucesso via fetch/GET');
        setSubmitted(true);
        return true;
      } else {
        addLog(`Erro no fetch/GET: ${response.status} ${response.statusText}`);
        setSubmitted(true);
        return false;
      }
    } catch (error) {
      addLog(`Erro no fetch/GET: ${error instanceof Error ? error.message : String(error)}`);
      setSubmitted(true);
      return false;
    }
  };

  // Tenta enviar automaticamente os dados
  useEffect(() => {
    const sendData = async () => {
      addLog('Iniciando envio automático de dados');
      addLog(`UserInfo (local): ${JSON.stringify(localUserInfo)}`);
      addLog(`Result: ${JSON.stringify({ type: result.type, title: result.title })}`);

      await sendDataWithFetch(localUserInfo);
    };

    const timer = setTimeout(() => {
      if (!submitted) {
        sendData();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [submitted, result, localUserInfo]);

  // Verificar se estamos retornando de um redirecionamento
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('fromWebhook')) {
      addLog('Retornando de redirecionamento para webhook');
      setSubmitted(true);
    }
  }, []);

  const Icon = icons[result.type];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
      <Icon className="w-16 h-16 text-pink-500 mx-auto mb-6" />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {localUserInfo.name}, {result.title.toLowerCase()}
        </h2>
        <p className="text-gray-500">{localUserInfo.email}</p>
      </div>

      <p className="text-lg text-gray-600 mb-8">{result.description}</p>

      <div className="bg-pink-50 p-6 rounded-lg mb-8">
        <p className="text-lg text-pink-800">{result.cta}</p>
      </div>

      <div className="space-y-4">
        <a
          href="#"
          className="block w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition duration-200"
          onClick={(e) => {
            e.preventDefault();
            // Adicione aqui o tratamento do link CTA
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
