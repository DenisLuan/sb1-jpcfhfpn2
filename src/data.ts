import { Question, Result } from './types';

export const questions: Question[] = [
  {
    id: 1,
    text: 'Como você reage quando recebe um elogio?',
    options: [
      { text: 'Agradeço e acredito que mereço.', value: 'A' },
      { text: 'Fico desconfortável, mas aceito.', value: 'B' },
      { text: 'Acho que a pessoa está sendo educada, mas não acredito.', value: 'C' },
    ],
  },
  {
    id: 2,
    text: 'Quando comete um erro, qual é sua primeira reação?',
    options: [
      { text: 'Entendo que errar faz parte e sigo em frente.', value: 'A' },
      { text: 'Fico frustrada, mas tento melhorar.', value: 'B' },
      { text: 'Me sinto incapaz e me culpo por muito tempo.', value: 'C' },
    ],
  },
  {
    id: 3,
    text: 'Como você se sente ao se olhar no espelho?',
    options: [
      { text: 'Gosto do que vejo e me cuido com carinho.', value: 'A' },
      { text: 'Tem dias bons e ruins, mas tento me aceitar.', value: 'B' },
      { text: 'Evito me olhar ou sempre vejo algo errado.', value: 'C' },
    ],
  },
  {
    id: 4,
    text: 'Quando alguém te critica, o que acontece?',
    options: [
      { text: 'Analiso se faz sentido e sigo minha vida.', value: 'A' },
      { text: 'Fico chateada, mas tento melhorar.', value: 'B' },
      { text: 'Fico arrasada e repenso tudo que faço.', value: 'C' },
    ],
  },
  {
    id: 5,
    text: 'Você se compara com outras pessoas nas redes sociais?',
    options: [
      { text: 'Não, cada um tem sua jornada.', value: 'A' },
      { text: 'Às vezes, mas tento me lembrar do meu valor.', value: 'B' },
      { text: 'Sim, e sempre me sinto inferior.', value: 'C' },
    ],
  },
  {
    id: 6,
    text: 'O que você sente sobre o seu futuro?',
    options: [
      { text: 'Estou confiante e sei que sou capaz de realizar meus sonhos.', value: 'A' },
      { text: 'Tenho dúvidas, mas sigo tentando.', value: 'B' },
      { text: 'Tenho medo e acho que não sou suficiente.', value: 'C' },
    ],
  },
];

export const results: Record<string, Result> = {
  A: {
    type: 'A',
    title: 'Autoestima Blindada!',
    description: 'Parabéns! Você tem uma autoestima forte e saudável. Mas manter essa força é essencial!',
    cta: 'Que tal fortalecer ainda mais sua confiança com 3 encontros transformadores com Criss Paiva?',
  },
  B: {
    type: 'B',
    title: 'Autoestima oscilante!',
    description: 'Você tem bons momentos, mas às vezes a insegurança aparece.',
    cta: 'Que tal aprender a blindar de vez sua autoestima? Nos 3 encontros com Criss Paiva, você vai descobrir como ser inabalável!',
  },
  C: {
    type: 'C',
    title: 'Autoestima Abalada!',
    description: 'É hora de mudar isso! Sua autoestima precisa de atenção e cuidado. Mas você não precisa passar por isso sozinha.',
    cta: 'Nos 3 encontros com Criss Paiva, você vai aprender a recuperar sua autoconfiança e se sentir incrível novamente!',
  },
};