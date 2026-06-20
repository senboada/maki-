import type { MathQuestion, MathQuestionConfig, OperationType, OperatorSymbol, PracticeQuestionOptions } from './mathTypes';

const operations: OperationType[] = ['addition', 'subtraction', 'multiplication', 'division'];

const operatorByOperation: Record<OperationType, OperatorSymbol> = {
  addition: '+',
  subtraction: '-',
  multiplication: 'x',
  division: '/'
};

let questionCounter = 0;

function nextQuestionId() {
  questionCounter += 1;
  return `math-question-${Date.now()}-${questionCounter}`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[]) {
  return items[randomInt(0, items.length - 1)] as T;
}

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    const current = copy[index] as T;
    copy[index] = copy[swapIndex] as T;
    copy[swapIndex] = current;
  }

  return copy;
}

function clampOptionCount(value: number) {
  return Math.max(2, Math.min(4, value));
}

function createQuestion(operation: OperationType, leftNumber: number, rightNumber: number, correctAnswer: number, minOptions?: number, maxOptions?: number): MathQuestion {
  const operatorSymbol = operatorByOperation[operation];

  return {
    id: nextQuestionId(),
    operation,
    leftNumber,
    rightNumber,
    operatorSymbol,
    questionText: `${leftNumber} ${operatorSymbol} ${rightNumber}`,
    correctAnswer,
    options: generateAnswerOptions(correctAnswer, minOptions, maxOptions)
  };
}

function generateAddition(selectedNumber?: number, minOptions?: number, maxOptions?: number) {
  const fixedNumber = selectedNumber ?? randomInt(1, 20);
  const otherNumber = randomInt(1, 20);
  const selectedOnLeft = Math.random() >= 0.5;
  const leftNumber = selectedOnLeft ? fixedNumber : otherNumber;
  const rightNumber = selectedOnLeft ? otherNumber : fixedNumber;

  return createQuestion('addition', leftNumber, rightNumber, leftNumber + rightNumber, minOptions, maxOptions);
}

function generateSubtraction(selectedNumber?: number, minOptions?: number, maxOptions?: number) {
  const subtrahend = selectedNumber ?? randomInt(1, 20);
  const minuend = randomInt(subtrahend + 1, 99);

  return createQuestion('subtraction', minuend, subtrahend, minuend - subtrahend, minOptions, maxOptions);
}

function generateMultiplication(selectedNumber?: number, minOptions?: number, maxOptions?: number) {
  const fixedNumber = selectedNumber ?? randomInt(1, 10);
  const factor = randomInt(1, 10);
  const selectedOnLeft = Math.random() >= 0.5;
  const leftNumber = selectedOnLeft ? fixedNumber : factor;
  const rightNumber = selectedOnLeft ? factor : fixedNumber;

  return createQuestion('multiplication', leftNumber, rightNumber, leftNumber * rightNumber, minOptions, maxOptions);
}

function generateDivision(selectedNumber?: number, minOptions?: number, maxOptions?: number) {
  const divisor = selectedNumber ?? randomInt(1, 10);
  const maxQuotient = Math.max(2, Math.floor(99 / divisor));
  const quotient = randomInt(2, maxQuotient);
  const dividend = divisor * quotient;

  return createQuestion('division', dividend, divisor, quotient, minOptions, maxOptions);
}

export function generateMathQuestion(config: MathQuestionConfig = {}): MathQuestion {
  const operation = config.operation ?? pickRandom(operations);

  switch (operation) {
    case 'addition':
      return generateAddition(config.selectedNumber, config.minOptions, config.maxOptions);
    case 'subtraction':
      return generateSubtraction(config.selectedNumber, config.minOptions, config.maxOptions);
    case 'multiplication':
      return generateMultiplication(config.selectedNumber, config.minOptions, config.maxOptions);
    case 'division':
      return generateDivision(config.selectedNumber, config.minOptions, config.maxOptions);
  }
}

export function generatePracticeQuestions(operation: OperationType, selectedNumber: number, count: number, options: PracticeQuestionOptions = {}) {
  validatePracticeInput(operation, selectedNumber, count);

  if (operation === 'multiplication') {
    return generateMultiplicationPracticeQuestions(selectedNumber, count, options);
  }

  return Array.from({ length: count }, () =>
    generateMathQuestion({
      operation,
      selectedNumber,
      minOptions: options.minOptions,
      maxOptions: options.maxOptions
    })
  );
}

export function generateRandomMixedQuestions(count: number, options: PracticeQuestionOptions = {}) {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('Question count must be a positive integer.');
  }

  return Array.from({ length: count }, () =>
    generateMathQuestion({
      minOptions: options.minOptions,
      maxOptions: options.maxOptions
    })
  );
}

export function generateAnswerOptions(correctAnswer: number, minOptions = 4, maxOptions = 4) {
  const minCount = clampOptionCount(minOptions);
  const maxCount = clampOptionCount(Math.max(minCount, maxOptions));
  const targetCount = randomInt(minCount, maxCount);
  const options = new Set<number>([correctAnswer]);
  const maxAttempts = 80;
  let attempts = 0;

  while (options.size < targetCount && attempts < maxAttempts) {
    attempts += 1;
    const distance = randomInt(1, Math.max(4, Math.ceil(Math.abs(correctAnswer) * 0.25) + 3));
    const direction = Math.random() >= 0.5 ? 1 : -1;
    const candidate = correctAnswer + distance * direction;

    if (candidate >= 0 && candidate !== correctAnswer) {
      options.add(candidate);
    }
  }

  let fallback = 0;

  while (options.size < targetCount) {
    if (fallback !== correctAnswer) {
      options.add(fallback);
    }

    fallback += 1;
  }

  return shuffle([...options]);
}

function generateMultiplicationPracticeQuestions(selectedNumber: number, count: number, options: PracticeQuestionOptions) {
  const shuffledFactors = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  return Array.from({ length: count }, (_, index) => {
    const factor = shuffledFactors[index % shuffledFactors.length] as number;
    const selectedOnLeft = Math.random() >= 0.5;
    const leftNumber = selectedOnLeft ? selectedNumber : factor;
    const rightNumber = selectedOnLeft ? factor : selectedNumber;

    return createQuestion(
      'multiplication',
      leftNumber,
      rightNumber,
      leftNumber * rightNumber,
      options.minOptions,
      options.maxOptions
    );
  });
}

function validatePracticeInput(operation: OperationType, selectedNumber: number, count: number) {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('Question count must be a positive integer.');
  }

  if (!Number.isInteger(selectedNumber) || selectedNumber <= 0) {
    throw new Error('Selected number must be a positive integer.');
  }

  if ((operation === 'multiplication' || operation === 'division') && selectedNumber > 10) {
    throw new Error('Multiplication and division practice numbers must be between 1 and 10.');
  }

  if ((operation === 'addition' || operation === 'subtraction') && selectedNumber > 20) {
    throw new Error('Addition and subtraction practice numbers must be between 1 and 20.');
  }
}
