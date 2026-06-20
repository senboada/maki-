import { generatePracticeQuestions, generateRandomMixedQuestions } from '../src/domain/math';
import type { MathQuestion, OperationType } from '../src/domain/math';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function validateQuestion(question: MathQuestion) {
  assert(question.options.includes(question.correctAnswer), `${question.questionText} is missing correct answer option.`);
  assert(new Set(question.options).size === question.options.length, `${question.questionText} has duplicated options.`);
  assert(question.options.length >= 2 && question.options.length <= 4, `${question.questionText} has invalid option count.`);

  switch (question.operation) {
    case 'addition':
      assert(question.leftNumber + question.rightNumber === question.correctAnswer, `${question.questionText} has invalid addition answer.`);
      break;
    case 'subtraction':
      assert(question.leftNumber > question.rightNumber, `${question.questionText} subtraction should avoid negatives.`);
      assert(question.leftNumber - question.rightNumber === question.correctAnswer, `${question.questionText} has invalid subtraction answer.`);
      break;
    case 'multiplication':
      assert(question.leftNumber * question.rightNumber === question.correctAnswer, `${question.questionText} has invalid multiplication answer.`);
      break;
    case 'division':
      assert(question.leftNumber > question.rightNumber, `${question.questionText} division dividend should be greater than divisor.`);
      assert(question.leftNumber < 100, `${question.questionText} division dividend should be below 100.`);
      assert(question.leftNumber % question.rightNumber === 0, `${question.questionText} division should be exact.`);
      assert(question.leftNumber / question.rightNumber === question.correctAnswer, `${question.questionText} has invalid division answer.`);
      break;
  }
}

function validatePractice(operation: OperationType, selectedNumber: number) {
  const questions = generatePracticeQuestions(operation, selectedNumber, 20);

  questions.forEach((question) => {
    validateQuestion(question);

    switch (operation) {
      case 'addition':
        assert(
          question.leftNumber === selectedNumber || question.rightNumber === selectedNumber,
          `${question.questionText} should include selected number as addend.`
        );
        break;
      case 'subtraction':
        assert(question.rightNumber === selectedNumber, `${question.questionText} should use selected number as subtrahend.`);
        break;
      case 'multiplication':
        assert(
          question.leftNumber === selectedNumber || question.rightNumber === selectedNumber,
          `${question.questionText} should include selected multiplication table.`
        );
        break;
      case 'division':
        assert(question.rightNumber === selectedNumber, `${question.questionText} should use selected number as divisor.`);
        break;
    }
  });
}

validatePractice('addition', 8);
validatePractice('subtraction', 7);
validatePractice('multiplication', 7);
validatePractice('division', 5);

generateRandomMixedQuestions(60).forEach(validateQuestion);

console.log('Math generator checks passed.');
