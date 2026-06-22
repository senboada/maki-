import { useCallback, useRef } from 'react';

import type { MathQuestion } from '../../domain/math';
import type { GameRouteParams, PracticeGameType } from '../../navigation';
import { gameSessionService, type GameAnswerInput } from '../../services';
import { useProfiles } from '../../providers';

type UseGameSessionRecorderOptions = {
  gameType: PracticeGameType;
  params: GameRouteParams;
  totalQuestions: number;
};

type FinishSessionInput = {
  correctAnswers: number;
};

export function useGameSessionRecorder({ gameType, params, totalQuestions }: UseGameSessionRecorderOptions) {
  const { childProfile } = useProfiles();
  const answersRef = useRef<GameAnswerInput[]>([]);
  const startedAtRef = useRef(new Date().toISOString());
  const savedRef = useRef(false);

  const recordAnswer = useCallback((question: MathQuestion | undefined, selectedAnswer: number | null, isCorrect: boolean) => {
    if (!question || savedRef.current) {
      return;
    }

    answersRef.current = [...answersRef.current, { question, selectedAnswer, isCorrect }];
  }, []);

  const finishSession = useCallback(async ({ correctAnswers }: FinishSessionInput) => {
    if (savedRef.current || !childProfile) {
      return;
    }

    savedRef.current = true;

    const result = await gameSessionService.saveGameSession({
      childId: childProfile.id,
      gameType,
      params,
      totalQuestions,
      correctAnswers,
      answers: answersRef.current,
      startedAt: startedAtRef.current,
      finishedAt: new Date().toISOString()
    });

    if (result.error) {
      savedRef.current = false;
      console.warn('Maki+ progress was not saved:', result.error);
    }
  }, [childProfile, gameType, params, totalQuestions]);

  const resetRecorder = useCallback(() => {
    answersRef.current = [];
    startedAtRef.current = new Date().toISOString();
    savedRef.current = false;
  }, []);

  return {
    recordAnswer,
    finishSession,
    resetRecorder
  };
}
