import React, { useEffect, useState, useRef } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Função para enviar os dados via GET query params
  const sendViaGetRequest = () => {
    try {
      setIsSubmitting(true);
      
      // Construa as query params para o GET request
      const params = new URLSearchParams();
      params.append('name', userInfo.name);
      params.append('email', userInfo.email);
      params.append('resultType', result.type);
      params.append('resultTitle', result.title);
      params.append('resultDescription', result.description);
      
      // Construa a URL completa
      const webhookUrl = `https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774?${params.toString()}`;
      
      // Crie um elemento <img> invisível para fazer a requisição GET
      const img = document.createElement('img');
      img.style.display = 'none';
      img.src = webhookUrl;
      
      // Quando a imagem carregar ou falhar, consideramos enviado
      img.onload = img.onerror = () => {
        setSubmitted(true);
        setIsSubmitting(false);
        document.body.removeChild(img);
      };
      
      document.body.appendChild(img);
    } catch (error) {
      console.error("Erro no envio via GET:", error);
      setIsSubmitting(false);
    }
  };

  // Função para mostrar o iframe que fará o envio via formulário
  const showIframeForm = () => {
    setShowIframe(true);
  };

  // Função para enviar via formulário oculto que abre em nova aba
  const submitFormInNewTab = () => {
    try {
      if (formRef.current) {
        formRef.current.submit();
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
    }
  };

  // Tenta enviar automaticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!submitted) {
        sendViaGetRequest(); // Tenta primeiro o método GET
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

      {/* Status de envio */}
      {isSubmitting && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
          Enviando resultados...
        </div>
      )}

      {/* Confirmação de sucesso */}
      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          Resultados enviados com sucesso!
        </div>
      ) : (
        <div className="mb-6 space-y-2">
          <p className="text-gray-600">
            Se o envio automático falhar, tente um dos métodos alternativos:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={sendViaGetRequest}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              disabled={isSubmitting}
            >
              Enviar via GET
            </button>
            <button 
              onClick={submitFormInNewTab}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Formulário (nova aba)
            </button>
            <button 
              onClick={showIframeForm}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Método iframe
            </button>
          </div>
        </div>
      )}

      {/* iFrame para envio direto - só é exibido quando necessário */}
      {showIframe && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            O iframe abaixo é um método para enviar seus dados contornando limitações de CORS.
          </p>
          <iframe 
            src={`https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774?name=${encodeURIComponent(userInfo.name)}&email=${encodeURIComponent(userInfo.email)}&resultType=${encodeURIComponent(result.type)}`}
            style={{width: '100%', height: '60px', border: '1px solid #ddd', borderRadius: '4px'}}
            onLoad={() => setSubmitted(true)}
          />
        </div>
      )}

      {/* Formulário oculto para método de nova aba */}
      <form 
        ref={formRef}
        method="GET" 
        action="https://webhook.site/13769352-940d-4294-81b6-3506f9a3d774" 
        target="_blank"
        style={{display: 'none'}}
      >
        <input type="hidden" name="name" value={userInfo.name} />
        <input type="hidden" name="email" value={userInfo.email} />
        <input type="hidden" name="resultType" value={result.type} />
        <input type="hidden" name="resultTitle" value={result.title} />
        <input type="hidden" name="resultDescription" value={result.description} />
      </form>

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