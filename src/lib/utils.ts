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

export const getCountriesBySet = memoize(
  (set: RegionSet, maxCount?: number) => {
    const countryObjects = Object.values(countries);

    let filteredCountries = [];
    if (set === RegionSet.ALL) {
      filteredCountries = countryObjects.filter(
        (country) => country.region !== "Antarctica",
      );
      if (maxCount) {
        return filteredCountries.slice(0, maxCount);
      }
      return filteredCountries;
    }

    filteredCountries = countryObjects.filter((country) => {
      return country.region.toLowerCase() === set.toLowerCase();
    });

    if (maxCount) {
      return filteredCountries.slice(0, maxCount);
    }

    return filteredCountries;
  },
);

export function prefersDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function getCountryByIso(iso: string) {
  return countries[iso];
}

// Some Chinese-claimed provinces are not able to be clicked on without some fixed zoom levels.
// Without zooming to these max zoom levels, clicking on them will click on China instead.
// For HK, going below zoom level 9 doesn't allow clicking
// For MO, going below zoom level 8 doesn't allow clicking
// For TW, going beyond zoom level 2 doesn't allow clicking
export const customMaxZoomsForCountry: Record<string, number> = {
  HK: 9,
  MO: 8,
  TW: 2,
};

export const getMaxZoomForCountry = (country: Country | string) => {
  const iso = typeof country === "string" ? country : country.iso_3166_1;
  return customMaxZoomsForCountry[iso] ?? undefined;
};
