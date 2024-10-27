import { Country } from "@/lib/countries";
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
  CUSTOM = "CUSTOM",
}

export interface GameState {
  isPlaying: boolean;
  attempts: number;
  maxAttempts: number;
  showMarkerOnlyOnClick: boolean;
  countryInQuestion: CountryQuestion | null;
  questionBank: Country[];
  correctCountries: string[];
  errorCountries: string[];
  questionSet: RegionSet;
}

export const initialGameState: GameState = {
  isPlaying: false,
  attempts: 0,
  maxAttempts: 1,
  showMarkerOnlyOnClick: true,
  countryInQuestion: null,
  questionBank: [],
  correctCountries: [],
  errorCountries: [],
  questionSet: RegionSet.ALL,
};

export const hoveredCountryIdAtom = atom<string | null>(null);

export const gameStateAtom = atom<GameState>(initialGameState);
