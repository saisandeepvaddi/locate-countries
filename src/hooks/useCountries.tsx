import { countries } from '@/lib/countries';
import {
  availableCountriesBySet,
  countryInQuestionAtom,
  playedCountriesAtom,
} from '@/state';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

function useCountries() {
  const [questionLocation, setQuestionLocation] = useAtom(
    countryInQuestionAtom
  );

  const playedCountries = useAtomValue(playedCountriesAtom);
  const countrySet = useAtomValue(availableCountriesBySet);

  const selectRandomCountry = useCallback(() => {
    const availableCountries = countrySet.filter(
      (country) => !playedCountries.includes(country.iso_3166_1)
    );
    const randomCountry =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];
    setQuestionLocation(randomCountry);
  }, [countrySet, setQuestionLocation, playedCountries]);

  return {
    selectRandomCountry,
    questionLocation,
    countrySet,
    countries,
  };
}

export default useCountries;
