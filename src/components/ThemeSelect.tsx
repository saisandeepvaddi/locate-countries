import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { AvailableThemes, layerThemes } from '../lib/themes';
import { layerThemeAtom } from '../state';

export function ThemeSelect() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  const [selectedTheme, setSelectedTheme] = useState<AvailableThemes>(
    prefersDarkMode ? AvailableThemes.NIGHT : AvailableThemes.DAY
  );
  const setTheme = useSetAtom(layerThemeAtom);
  return (
    <Select
      value={selectedTheme}
      onValueChange={(value) => {
        setSelectedTheme(value as AvailableThemes);
        setTheme(layerThemes[value as AvailableThemes]);
      }}
    >
      <SelectTrigger className='w-[280px] bg-slate-950 text-white'>
        <SelectValue placeholder='Theme' />
      </SelectTrigger>
      <SelectContent className='bg-slate-950 text-white'>
        {Object.values(AvailableThemes).map((theme) => (
          <SelectItem key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
