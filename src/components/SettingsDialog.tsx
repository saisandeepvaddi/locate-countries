'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Theme } from '@/lib/themes';
import { layerThemeAtom } from '@/state/settings';
import { useAtom } from 'jotai';
import { InfoIcon, Laptop, Moon, Settings, Sun } from 'lucide-react';
import { useState } from 'react';

export default function SettingsDialog() {
  const [theme, setTheme] = useAtom(layerThemeAtom);
  const [apiKey, setApiKey] = useState('');

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
    // Here you would typically apply the theme to your application
    console.log(`Theme changed to: ${value}`);
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSave = () => {
    // Here you would typically save the settings
    console.log('Settings saved:', { theme, apiKey });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='text-white bg-transparent'>
          <Settings className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='theme' className='text-right'>
              Theme
            </Label>
            <Select onValueChange={handleThemeChange} value={theme}>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Select a theme' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='light'>
                  <div className='flex items-center gap-2'>
                    <Sun className='h-4 w-4' />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value='dark'>
                  <div className='flex items-center gap-2'>
                    <Moon className='h-4 w-4' />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value='system'>
                  <div className='flex items-center gap-2'>
                    <Laptop className='h-4 w-4' />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='apiKey' className='text-right'>
              Mapbox API Key
            </Label>
            <Input
              id='apiKey'
              value={apiKey}
              onChange={handleApiKeyChange}
              className='col-span-3'
              type='password'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-2'>
            <div className='col-span-1'></div>
            <p className='text-xs text-slate-400 col-span-3 flex items-center gap-2'>
              <InfoIcon className='h-4 w-4' />
              <a
                href='https://www.mapbox.com/account/access-tokens/'
                target='_blank'
                className='underline'
                rel='noreferrer noopener'
              >
                Get your Mapbox API key from here
              </a>
            </p>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
