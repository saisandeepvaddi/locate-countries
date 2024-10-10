import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Country } from './countries';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCoords(country: Country) {
  const latitude = (country.bbox[1] + country.bbox[3]) / 2;
  const longitude = (country.bbox[0] + country.bbox[2]) / 2;
  return { latitude, longitude };
}
