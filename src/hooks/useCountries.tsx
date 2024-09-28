import { countries } from '@/lib/countries';
import { countryInQuestionAtom, playedCountriesAtom } from '@/state';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

function useCountries() {
  const [currentCountry, setCurrentCountry] = useAtom(countryInQuestionAtom);

  const playedCountries = useAtomValue(playedCountriesAtom);

  const selectRandomCountry = useCallback(() => {
    const countryKeys = Object.keys(countries);
    console.log(countryKeys.length);
    const availableCountries = countryKeys.filter(
      (key) => !playedCountries.includes(key)
    );
    const randomKey =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];
    setCurrentCountry(countries[randomKey]);
  }, [setCurrentCountry, playedCountries]);

  return {
    selectRandomCountry,
    currentCountry,
  };
}

export default useCountries;
