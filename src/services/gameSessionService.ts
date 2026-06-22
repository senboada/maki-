import type { MathQuestion, OperationType, OperatorSymbol } from '../domain/math';
import type { GameRouteParams, PracticeGameType } from '../navigation';
import { storageClient, storageKeys } from '../storage';
import { createLocalId } from '../utils/id';
import { fail, ok, type ServiceResult } from './serviceTypes';
import { supabase } from './supabaseClient';

export type GameAnswerInput = {
  question: MathQuestion;
  selectedAnswer: number | null;
  isCorrect: boolean;
};

export type SaveGameSessionInput = {
  childId: string;
  gameType: PracticeGameType;
  params: GameRouteParams;
  totalQuestions: number;
  correctAnswers: number;
  answers: GameAnswerInput[];
  startedAt: string;
  finishedAt: string;
};

export type GameSessionHistoryItem = {
  id: string;
  childId: string;
  mode: GameRouteParams['mode'];
  gameType: PracticeGameType;
  operationType: OperationType | null;
  selectedNumber: number | null;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
};

type GameSessionRow = {
  id: string;
  child_id: string;
  mode: GameRouteParams['mode'];
  game_type: PracticeGameType;
  operation_type: OperationType | null;
  selected_number: number | null;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
  started_at: string;
  finished_at: string | null;
  created_at: string;
};

type LocalGameAnswerRow = {
  id: string;
  gameSessionId: string;
  operationType: OperationType;
  leftNumber: number;
  rightNumber: number;
  operatorSymbol: OperatorSymbol;
  questionText: string;
  correctAnswer: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  createdAt: string;
};

function mapSessionRow(row: GameSessionRow): GameSessionHistoryItem {
  return {
    id: row.id,
    childId: row.child_id,
    mode: row.mode,
    gameType: row.game_type,
    operationType: row.operation_type,
    selectedNumber: row.selected_number,
    totalQuestions: row.total_questions,
    correctAnswers: row.correct_answers,
    wrongAnswers: row.wrong_answers,
    score: row.score,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    createdAt: row.created_at
  };
}

function getWrongAnswerCount(answers: GameAnswerInput[]) {
  return answers.filter((answer) => !answer.isCorrect).length;
}

function getScore(correctAnswers: number, totalQuestions: number) {
  if (totalQuestions <= 0) {
    return 0;
  }

  return Math.round((correctAnswers / totalQuestions) * 100);
}

export const gameSessionService = {
  async saveGameSession(input: SaveGameSessionInput): Promise<ServiceResult<GameSessionHistoryItem>> {
    const wrongAnswers = getWrongAnswerCount(input.answers);
    const score = getScore(input.correctAnswers, input.totalQuestions);

    if (supabase) {
      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          child_id: input.childId,
          mode: input.params.mode,
          game_type: input.gameType,
          operation_type: input.params.operation ?? null,
          selected_number: input.params.selectedNumber ?? null,
          total_questions: input.totalQuestions,
          correct_answers: input.correctAnswers,
          wrong_answers: wrongAnswers,
          score,
          started_at: input.startedAt,
          finished_at: input.finishedAt
        })
        .select('id,child_id,mode,game_type,operation_type,selected_number,total_questions,correct_answers,wrong_answers,score,started_at,finished_at,created_at')
        .single();

      if (sessionError || !sessionData) {
        return fail(sessionError?.message ?? 'No se pudo guardar la sesion.');
      }

      const session = mapSessionRow(sessionData as GameSessionRow);

      if (input.answers.length > 0) {
        const { error: answersError } = await supabase
          .from('game_answers')
          .insert(input.answers.map((answer) => ({
            game_session_id: session.id,
            operation_type: answer.question.operation,
            left_number: answer.question.leftNumber,
            right_number: answer.question.rightNumber,
            operator_symbol: answer.question.operatorSymbol,
            question_text: answer.question.questionText,
            correct_answer: answer.question.correctAnswer,
            selected_answer: answer.selectedAnswer,
            is_correct: answer.isCorrect
          })));

        if (answersError) {
          return fail(answersError.message);
        }
      }

      return ok(session);
    }

    const now = new Date().toISOString();
    const session: GameSessionHistoryItem = {
      id: createLocalId('game-session'),
      childId: input.childId,
      mode: input.params.mode,
      gameType: input.gameType,
      operationType: input.params.operation ?? null,
      selectedNumber: input.params.selectedNumber ?? null,
      totalQuestions: input.totalQuestions,
      correctAnswers: input.correctAnswers,
      wrongAnswers,
      score,
      startedAt: input.startedAt,
      finishedAt: input.finishedAt,
      createdAt: now
    };
    const savedSessions = await storageClient.getJson<GameSessionHistoryItem[]>(storageKeys.gameSessions) ?? [];
    const savedAnswers = await storageClient.getJson<LocalGameAnswerRow[]>(storageKeys.gameAnswers) ?? [];
    const localAnswers = input.answers.map((answer) => ({
      id: createLocalId('game-answer'),
      gameSessionId: session.id,
      operationType: answer.question.operation,
      leftNumber: answer.question.leftNumber,
      rightNumber: answer.question.rightNumber,
      operatorSymbol: answer.question.operatorSymbol,
      questionText: answer.question.questionText,
      correctAnswer: answer.question.correctAnswer,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      createdAt: now
    }));

    await storageClient.setJson(storageKeys.gameSessions, [session, ...savedSessions]);
    await storageClient.setJson(storageKeys.gameAnswers, [...localAnswers, ...savedAnswers]);

    return ok(session);
  },

  async getGameHistory(childId: string): Promise<ServiceResult<GameSessionHistoryItem[]>> {
    if (supabase) {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('id,child_id,mode,game_type,operation_type,selected_number,total_questions,correct_answers,wrong_answers,score,started_at,finished_at,created_at')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (error) {
        return fail(error.message);
      }

      return ok((data as GameSessionRow[]).map(mapSessionRow));
    }

    const savedSessions = await storageClient.getJson<GameSessionHistoryItem[]>(storageKeys.gameSessions) ?? [];

    return ok(savedSessions.filter((session) => session.childId === childId));
  }
};
