import { atomWithStorage } from 'jotai/utils';
import { AvailableThemes } from '../lib/themes';

export const layerThemeAtom = atomWithStorage<AvailableThemes>(
  'theme',
  AvailableThemes.light
);
