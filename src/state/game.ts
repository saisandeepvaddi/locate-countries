import { atom } from "jotai";
import { GeoJSONFeature } from "mapbox-gl";

export type CountryProperties = GeoJSONFeature["properties"];

export type CountryQuestion = {
  name: string;
  iso_3166_1: string;
  bbox: [number, number, number, number];
};

export enum RegionSet {
  ALL = "ALL",
  EUROPE = "EUROPE",
  ASIA = "ASIA",
  AMERICAS = "AMERICAS",
  AFRICA = "AFRICA",
  OCEANIA = "OCEANIA",
}

export interface GameState {
  isPlaying: boolean;
  attempts: number;
  maxAttempts: number;
  showMarkerOnlyOnClick: boolean;
  countryInQuestion: CountryQuestion | null;
  correctCountries: string[];
  errorCountries: string[];
  questionSet: RegionSet;
  clickedCountryProps: CountryProperties | null;
}

const initialGameState: GameState = {
  isPlaying: false,
  attempts: 0,
  maxAttempts: 1,
  showMarkerOnlyOnClick: true,
  countryInQuestion: null,
  correctCountries: [],
  errorCountries: [],
  questionSet: RegionSet.ALL,
  clickedCountryProps: null,
};

export const hoveredCountryIdAtom = atom<string | null>(null);

export const gameStateAtom = atom<GameState>(initialGameState);

export const playedCountriesAtom = atom((get) => {
  const gameState = get(gameStateAtom);
  return [...gameState.correctCountries, ...gameState.errorCountries];
});
