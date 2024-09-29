export interface LayerTheme {
  error: string;
  correct: string;
  hovered: string;
  default: string;
  border: string;
}

const defaultLayerTheme: LayerTheme = {
  error: '#d90429',
  correct: '#2a9d8f',
  hovered: '#212529',
  default: '#CCCCCC',
  border: '#000000',
};

const nightLayerTheme: LayerTheme = {
  error: '#d90429',
  correct: '#2a9d8f',
  hovered: '#212529',
  default: '#000000',
  border: '#FFFFFF',
};

const dayLayerTheme: LayerTheme = {
  error: '#d90429',
  correct: '#2a9d8f',
  hovered: '#212529',
  default: '#CCCCCC',
  border: '#000000',
};

export enum AvailableThemes {
  DEFAULT = 'default',
  NIGHT = 'night',
  DAY = 'day',
}

export const layerThemes: Record<AvailableThemes, LayerTheme> = {
  [AvailableThemes.DEFAULT]: defaultLayerTheme,
  [AvailableThemes.NIGHT]: nightLayerTheme,
  [AvailableThemes.DAY]: dayLayerTheme,
};
