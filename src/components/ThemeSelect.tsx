import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { layerThemeAtom } from '@/state/settings';
import { useAtom } from 'jotai';
import { AvailableThemes } from '../lib/themes';

export function ThemeSelect() {
  const [selectedTheme, setSelectedTheme] = useAtom(layerThemeAtom);
  return (
    <Select
      value={selectedTheme}
      onValueChange={(value) => {
        setSelectedTheme(value as AvailableThemes);
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
