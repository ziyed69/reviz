export type Question = {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  title: string;
  questions: Question[];
};
