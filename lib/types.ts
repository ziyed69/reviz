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

export type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

export type CourseContext = {
  title: string;
  text: string;
};
