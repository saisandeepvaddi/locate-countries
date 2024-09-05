import { atom } from 'jotai';
import { GeoJSONFeature } from 'mapbox-gl';

export type CountryProperties = GeoJSONFeature['properties'];

export const hoveredCountryPropsAtom = atom<CountryProperties | null>(null);
export const clickedCountryPropsAtom = atom<CountryProperties | null>(null);
