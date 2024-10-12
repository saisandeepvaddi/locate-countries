import { prefersDarkMode } from './utils';

export interface LayerTheme {
  error: string;
  correct: string;
  hovered: string;
  default: string;
  border: string;
  ocean: string;
}

// const defaultLayerTheme: LayerTheme = {
//   error: '#d90429',
//   correct: '#2a9d8f',
//   hovered: '#212529',
//   default: '#faf9f9',
//   border: '#1f1f1f',
//   ocean: '#D8EBF2',
// };

const nightLayerTheme: LayerTheme = {
  error: '#d90429',
  correct: '#2a9d8f',
  hovered: '#BFA18F',
  default: '#1f1f1f',
  border: '#DBDBDB',
  ocean: '#131316',
};

const dayLayerTheme: LayerTheme = {
  error: '#FB5012',
  correct: '#69DC9E',
  hovered: '#BFA18F',
  default: '#F2F2F0',
  border: '#734124',
  ocean: '#96C6D9',
};

export enum Theme {
  system = 'system',
  dark = 'dark',
  light = 'light',
}

export const layerThemes: Record<Theme, LayerTheme> = {
  [Theme.system]: prefersDarkMode() ? nightLayerTheme : dayLayerTheme,
  [Theme.dark]: nightLayerTheme,
  [Theme.light]: dayLayerTheme,
};
