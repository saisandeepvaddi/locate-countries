import { countries } from "@/lib/countries";
import {
  availableCountriesForActiveSet,
  countryInQuestionAtom,
  playedCountriesAtom,
} from "@/state/game";
import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";

function useCountries() {
  const [questionLocation, setQuestionLocation] = useAtom(
    countryInQuestionAtom,
  );

  const playedCountries = useAtomValue(playedCountriesAtom);
  const countrySet = useAtomValue(availableCountriesForActiveSet);

  const selectRandomCountry = useCallback(() => {
    const availableCountries = countrySet.filter(
      (country) => !playedCountries.includes(country.iso_3166_1),
    );
    const randomCountry =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];
    setQuestionLocation(randomCountry);
  }, [countrySet, setQuestionLocation, playedCountries]);

  const getCountryByIso = useCallback(
    (iso: string) => {
      return countries[iso];
    },
    [countries],
  );

  return {
    selectRandomCountry,
    questionLocation,
    countrySet,
    countries,
    playedCountries,
    getCountryByIso,
  };
}

export default useCountries;
