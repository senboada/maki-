import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { OperationType } from '../../domain/math';
import type { PracticeGameType } from '../../navigation';
import { colors } from '../../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const operationContent: Record<OperationType, { title: string; helper: string; icon: IconName; color: string }> = {
  addition: {
    title: 'Sumar',
    helper: 'El numero elegido aparecera como parte de la suma.',
    icon: 'plus-circle-outline',
    color: colors.sky
  },
  subtraction: {
    title: 'Restar',
    helper: 'El numero elegido sera el que quitamos.',
    icon: 'minus-circle-outline',
    color: colors.surfaceSoft
  },
  multiplication: {
    title: 'Multiplicar',
    helper: 'Practica la tabla del numero elegido.',
    icon: 'close-circle-outline',
    color: colors.banana
  },
  division: {
    title: 'Dividir',
    helper: 'El numero elegido sera el divisor y todo dara exacto.',
    icon: 'division',
    color: colors.mint
  }
};

export const gameContent: Record<PracticeGameType, { title: string; helper: string; icon: IconName; color: string }> = {
  treasure: {
    title: 'Tesoro',
    helper: 'Elige el camino con la respuesta correcta.',
    icon: 'treasure-chest-outline',
    color: colors.secondary
  },
  match_pairs: {
    title: 'Parejas',
    helper: 'Une cada operacion con su respuesta.',
    icon: 'cards-heart-outline',
    color: colors.lavender
  },
  password: {
    title: 'Clave secreta',
    helper: 'Escribe el resultado como una contrasena.',
    icon: 'lock-open-variant-outline',
    color: colors.sky
  },
  maze: {
    title: 'Laberinto',
    helper: 'Traza el camino hacia la respuesta correcta.',
    icon: 'map-outline',
    color: colors.mint
  }
};

export const operations = Object.keys(operationContent) as OperationType[];
export const practiceGames = Object.keys(gameContent) as PracticeGameType[];

export function getPracticeNumberRange(operation: OperationType) {
  return operation === 'addition' || operation === 'subtraction'
    ? Array.from({ length: 20 }, (_, index) => index + 1)
    : Array.from({ length: 10 }, (_, index) => index + 1);
}
