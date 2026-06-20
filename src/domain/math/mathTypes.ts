export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type OperatorSymbol = '+' | '-' | 'x' | '/';

export type MathQuestion = {
  id: string;
  operation: OperationType;
  leftNumber: number;
  rightNumber: number;
  operatorSymbol: OperatorSymbol;
  questionText: string;
  correctAnswer: number;
  options: number[];
};

export type MathQuestionConfig = {
  operation?: OperationType;
  selectedNumber?: number;
  minOptions?: number;
  maxOptions?: number;
};

export type PracticeQuestionOptions = {
  minOptions?: number;
  maxOptions?: number;
};
