import { RegionSet } from "@/state/game";
import { clsx, type ClassValue } from "clsx";
import { memoize } from "lodash";
import { twMerge } from "tailwind-merge";
import { countries, Country } from "./countries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCoords(country: Country) {
  const latitude = (country.bbox[1] + country.bbox[3]) / 2;
  const longitude = (country.bbox[0] + country.bbox[2]) / 2;
  return { latitude, longitude };
}

export const getCountriesBySet = memoize((set: RegionSet) => {
  const countryObjects = Object.values(countries);

  if (set === RegionSet.ALL) {
    return countryObjects.filter((country) => country.region !== "Antarctica");
  }

  return countryObjects.filter((country) => {
    return country.region.toLowerCase() === set.toLowerCase();
  });
});

export function prefersDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function getCountryByIso(iso: string) {
  return countries[iso];
}
