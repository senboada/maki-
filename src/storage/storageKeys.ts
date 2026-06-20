const prefix = 'maki-plus';

export const storageKeys = {
  authSession: `${prefix}:auth-session`,
  parentProfile: `${prefix}:parent-profile`,
  childProfile: `${prefix}:child-profile`,
  gameSessions: `${prefix}:game-sessions`,
  gameAnswers: `${prefix}:game-answers`
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
