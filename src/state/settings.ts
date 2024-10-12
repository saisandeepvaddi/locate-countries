import { atomWithStorage } from 'jotai/utils';
import { Theme } from '../lib/themes';

export const layerThemeAtom = atomWithStorage<Theme>('theme', Theme.light);
