import Svg, { Path } from 'react-native-svg';

export type DrawPoint = {
  x: number;
  y: number;
};

type DrawPathProps = {
  points: DrawPoint[];
  color?: string;
  strokeWidth?: number;
};

export function DrawPath({ color = '#168A93', points, strokeWidth = 8 }: DrawPathProps) {
  const path = points.length > 0
    ? points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
    : '';

  return (
    <Svg pointerEvents="none" style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}>
      {path ? <Path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} /> : null}
    </Svg>
  );
}
