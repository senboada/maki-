export const colors = {
  background: '#FFF6DD',
  backgroundAlt: '#EAF8F2',
  surface: '#FFFFFF',
  surfaceSoft: '#FFF0F3',
  text: '#334155',
  textMuted: '#64748B',
  primary: '#6EC6CA',
  primaryDark: '#168A93',
  secondary: '#FFB86B',
  secondaryDark: '#D96E22',
  mint: '#A8E6CF',
  coral: '#FF8B94',
  lavender: '#CDB4DB',
  sky: '#BDE0FE',
  banana: '#FFE066',
  success: '#62C370',
  warning: '#FFCF56',
  dangerSoft: '#FFCAD4',
  border: '#F2D8A7',
  shadow: '#8B6F47'
} as const;

export type AppColor = keyof typeof colors;
