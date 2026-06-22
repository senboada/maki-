import { generateMathQuestion, generatePracticeQuestions, generateRandomMixedQuestions, type MathQuestion } from '../../domain/math';
import type { GameRouteParams, PracticeGameType } from '../../navigation';

export const defaultGameQuestionCount = 5;

export function createGameQuestions(params: GameRouteParams, count = defaultGameQuestionCount): MathQuestion[] {
  if (params.mode === 'practice') {
    if (!params.operation || !params.selectedNumber) {
      throw new Error('Practice mode requires operation and selectedNumber.');
    }

    return generatePracticeQuestions(params.operation, params.selectedNumber, count);
  }

  return generateRandomMixedQuestions(count);
}

export function createUniqueAnswerGameQuestions(params: GameRouteParams, count = defaultGameQuestionCount): MathQuestion[] {
  const questions: MathQuestion[] = [];
  const usedAnswers = new Set<number>();
  const maxAttempts = count * 60;
  let attempts = 0;

  while (questions.length < count && attempts < maxAttempts) {
    attempts += 1;
    const question = params.mode === 'practice'
      ? generateMathQuestion({ operation: params.operation, selectedNumber: params.selectedNumber })
      : generateMathQuestion();

    if (!usedAnswers.has(question.correctAnswer)) {
      questions.push(question);
      usedAnswers.add(question.correctAnswer);
    }
  }

  if (questions.length < count) {
    const fallbackQuestions = createGameQuestions(params, count * 2);

    for (const question of fallbackQuestions) {
      if (questions.length >= count) {
        break;
      }

      if (!usedAnswers.has(question.correctAnswer)) {
        questions.push(question);
        usedAnswers.add(question.correctAnswer);
      }
    }
  }

  return questions;
}

export function navigateToGame(
  navigation: {
    navigate: (screen: 'TreasureGame' | 'MatchPairsGame' | 'PasswordGame' | 'MazeGame', params: GameRouteParams) => void;
  },
  gameType: PracticeGameType,
  params: GameRouteParams
) {
  switch (gameType) {
    case 'treasure':
      navigation.navigate('TreasureGame', params);
      break;
    case 'match_pairs':
      navigation.navigate('MatchPairsGame', params);
      break;
    case 'password':
      navigation.navigate('PasswordGame', params);
      break;
    case 'maze':
      navigation.navigate('MazeGame', params);
      break;
  }
}

export function getGameIntro(params: GameRouteParams) {
  if (params.mode === 'practice') {
    return 'Practica enfocada';
  }

  return 'Operaciones mixtas';
}
