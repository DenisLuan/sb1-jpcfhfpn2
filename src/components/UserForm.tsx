import React, { useEffect, useState } from 'react';
import { UserInfo } from '../types';

interface UserFormProps {
  onSubmit: (info: UserInfo) => void;
}

export function UserForm({ onSubmit }: UserFormProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fone, setFone] = useState('');
  // Indica se existem parâmetros na URL
  const [hasUrlParams, setHasUrlParams] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nomeParam = params.get('nome');
    const emailParam = params.get('email');
    const foneParam = params.get('fone');

    // Se existir pelo menos um parâmetro, salvamos, mas NÃO chamamos onSubmit ainda
    if (nomeParam || emailParam || foneParam) {
      setHasUrlParams(true);
      setNome(nomeParam || '');
      setEmail(emailParam || '');
      setFone(foneParam || '');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: nome,
      email: email,
      phone: fone,
    });
  };

  // Se já temos parâmetros, podemos criar uma função para
  // enviar diretamente quando o usuário clicar no botão
  const handleStartWithParams = () => {
    onSubmit({
      name: nome,
      email: email,
      phone: fone,
    });
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Como está sua autoestima?</h2>
      <p className="mb-6">
        Descubra com este teste rápido! Primeiro, nos diga um pouco sobre você.
      </p>

      {/* Se existir parâmetros na URL, mostra layout sem campos */}
      {hasUrlParams ? (
        <div className="text-center">
          <p className="mb-4">
            <strong>Nome:</strong> {nome || 'N/A'} <br />
            <strong>Email:</strong> {email || 'N/A'} <br />
            <strong>Telefone:</strong> {fone || 'N/A'}
          </p>
          <button
            onClick={handleStartWithParams}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
          >
            Começar o Teste
          </button>
        </div>
      ) : (
        // Caso contrário, exibe o formulário normalmente
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium" htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            className="block w-full mb-4 border rounded p-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label className="block mb-2 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="block w-full mb-4 border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 font-medium" htmlFor="fone">
            Telefone (opcional)
          </label>
          <input
            id="fone"
            type="text"
            className="block w-full mb-4 border rounded p-2"
            value={fone}
            onChange={(e) => setFone(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
          >
            Começar o Teste
          </button>
        </form>
      )}
    </div>
  );
}
