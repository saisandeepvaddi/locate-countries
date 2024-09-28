import { atom } from 'jotai';
import { GeoJSONFeature } from 'mapbox-gl';

export type CountryProperties = GeoJSONFeature['properties'];

export type CountryQuestion = {
  name: string;
  iso_3166_1: string;
  bbox: [number, number, number, number];
};

export const hoveredCountryPropsAtom = atom<CountryProperties | null>(null);
export const clickedCountryPropsAtom = atom<CountryProperties | null>(null);
export const hoveredCountryIdAtom = atom<string | null>(null);

export const isPlayingAtom = atom<boolean>(false);
export const countryInQuestionAtom = atom<CountryQuestion | null>(null);

export const correctCountriesAtom = atom<string[]>([]);
export const errorCountriesAtom = atom<string[]>([]);

export const playedCountriesAtom = atom<string[]>((get) => {
  return [...get(correctCountriesAtom), ...get(errorCountriesAtom)];
});
