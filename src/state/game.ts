import { atom } from 'jotai';
import { GeoJSONFeature } from 'mapbox-gl';
import { countries, Country } from '../lib/countries';

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
export const attemptsAtom = atom<number>(0);
export const maxAttemptsAtom = atom<number>(1);
export const showMarkerOnlyOnClickAtom = atom<boolean>(true);

export const countryInQuestionAtom = atom<CountryQuestion | null>(null);

export const correctCountriesAtom = atom<string[]>([]);
export const errorCountriesAtom = atom<string[]>([]);

export const playedCountriesAtom = atom<string[]>((get) => {
  return [...get(correctCountriesAtom), ...get(errorCountriesAtom)];
});

export enum RegionSet {
  ALL = 'ALL',
  EUROPE = 'EUROPE',
  ASIA = 'ASIA',
  AMERICAS = 'AMERICAS',
  AFRICA = 'AFRICA',
  OCEANIA = 'OCEANIA',
}

export const questionSetAtom = atom<RegionSet>(RegionSet.ALL);

export const availableCountriesBySet = atom<Country[]>((get) => {
  const set = get(questionSetAtom);
  const countryObjects = Object.values(countries);

  if (set === RegionSet.ALL) {
    return countryObjects;
  }

  return countryObjects.filter((country) => {
    return country.region.toLowerCase() === set.toLowerCase();
  });
});
