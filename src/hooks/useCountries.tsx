import { countries } from '@/lib/countries';
import {
  correctCountriesAtom,
  countryInQuestionAtom,
  errorCountriesAtom,
  playedCountriesAtom,
} from '@/state';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';

function useCountries() {
  const [currentCountry, setCurrentCountry] = useAtom(countryInQuestionAtom);
  const [attempts, setAttempts] = useState<number>(0);
  const setCorrectCountries = useSetAtom(correctCountriesAtom);
  const setErrorCountries = useSetAtom(errorCountriesAtom);
  const playedCountries = useAtomValue(playedCountriesAtom);

  const selectRandomCountry = useCallback(() => {
    const countryKeys = Object.keys(countries);
    const availableCountries = countryKeys.filter(
      (key) => !playedCountries.includes(key)
    );
    const randomKey =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];
    setCurrentCountry(countries[randomKey]);
    setAttempts(0);
  }, [setCurrentCountry, setAttempts, playedCountries]);

  return {
    selectRandomCountry,
    currentCountry,
  };
}

export default useCountries;
