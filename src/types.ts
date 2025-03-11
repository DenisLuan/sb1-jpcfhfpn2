export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    value: 'A' | 'B' | 'C';
  }[];
}

export interface Result {
  type: 'A' | 'B' | 'C';
  title: string;
  description: string;
  cta: string;
}

export interface UserInfo {
  name: string;
  email: string;
}