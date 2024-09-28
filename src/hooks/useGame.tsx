import {
  correctCountriesAtom,
  errorCountriesAtom,
  isPlayingAtom,
} from '@/state';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import useCountries from './useCountries';

function useGame() {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [attempts, setAttempts] = useState<number>(0);
  const { selectRandomCountry, currentCountry } = useCountries();
  const setCorrectCountries = useSetAtom(correctCountriesAtom);
  const setErrorCountries = useSetAtom(errorCountriesAtom);

  const resetGame = useCallback(() => {
    setAttempts(0);
    setCorrectCountries([]);
    setErrorCountries([]);
    selectRandomCountry();
  }, [selectRandomCountry, setCorrectCountries, setErrorCountries]);

  const shuffleQuestion = () => {
    selectRandomCountry();
  };

  const toggleGamePlay = () => {
    setIsPlaying(!isPlaying);
    resetGame();
  };

  const startGame = () => {
    setIsPlaying(true);
  };

  const endGame = (autoRestart: boolean = false) => {
    setIsPlaying(false);
    if (autoRestart) {
      resetGame();
    }
  };

  return {
    attempts,
    isPlaying,
    setAttempts,
    resetGame,
    toggleGamePlay,
    startGame,
    endGame,
    questionLocation: currentCountry,
    shuffleQuestion,
  };
}

export default useGame;
