import { countries } from "@/lib/countries";
import { getCountriesBySet } from "@/lib/utils";
import { CountryProperties, gameStateAtom } from "@/state/game";
import { useAtom } from "jotai";
import { useCallback, useRef, useState } from "react";
import { LngLatLike, MapRef } from "react-map-gl";
import { toast } from "./use-toast";

function useGame() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const { questionSet, countryInQuestion, correctCountries, errorCountries } =
    gameState;

  const selectRandomCountry = useCallback(() => {
    const playedCountries = [...correctCountries, ...errorCountries];
    const availableCountries = getCountriesBySet(questionSet).filter(
      (country) => !playedCountries.includes(country.iso_3166_1),
    );
    const randomCountry =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];
    setGameState((state) => ({ ...state, countryInQuestion: randomCountry }));
  }, [setGameState]);

  const mapRef = useRef<MapRef>(null);
  const [lastClickedCountry, setLastClickedCountry] = useState<string | null>(
    null,
  );

  const setMapRef = useCallback((ref: MapRef) => {
    mapRef.current = ref;
  }, []);

  const getMapRef = useCallback(() => mapRef.current, []);

  const resetGame = useCallback(() => {
    setGameState((state) => ({
      ...state,
      attempts: 0,
      correctCountries: [],
      errorCountries: [],
    }));
    selectRandomCountry();
  }, [selectRandomCountry, setGameState]);

  const shuffleQuestion = () => {
    selectRandomCountry();
  };

  const toggleGamePlay = () => {
    const willPlay = !gameState.isPlaying;
    setGameState((state) => ({
      ...state,
      isPlaying: willPlay,
    }));
    if (willPlay) {
      resetGame();
    }
  };

  const startGame = () => {
    setGameState((state) => ({
      ...state,
      isPlaying: true,
    }));
  };

  const endGame = (autoRestart: boolean = false) => {
    setGameState((state) => ({
      ...state,
      isPlaying: false,
    }));
    if (autoRestart) {
      resetGame();
    }
  };

  const moveToCountry = useCallback(() => {
    if (!countryInQuestion) {
      console.error("No country selected");
      return;
    }
    const map = mapRef?.current?.getMap?.();
    if (!map) {
      console.error("No map found");
      return;
    }
    const countryData = Object.values(countries).find(
      (c) => c.iso_3166_1 === countryInQuestion.iso_3166_1,
    );

    if (countryData && map) {
      const [minLng, minLat, maxLng, maxLat] = countryData.bbox;
      const center = [
        (minLng + maxLng) / 2,
        (minLat + maxLat) / 2,
      ] as LngLatLike;
      map.flyTo({
        center,
        zoom: map.getZoom(),
        essential: true,
      });
    }
  }, [countryInQuestion, countries]);

  const checkAnswer = useCallback(
    (clickedCountry: string) => {
      if (!countryInQuestion) {
        console.error("No country selected");
        return;
      }

      if (clickedCountry === countryInQuestion.iso_3166_1) {
        toast({
          title: "Correct!",
          description: "You found the country!",
          variant: "default",
        });

        setGameState((state) => ({
          ...state,
          correctCountries: [
            ...state.correctCountries,
            countryInQuestion.iso_3166_1,
          ],
          attempts: 0,
        }));
        setTimeout(() => {
          selectRandomCountry();
        }, 0);
      } else {
        const nextAttempts = gameState.attempts + 1;
        setGameState((state) => ({
          ...state,
          attempts: nextAttempts,
        }));

        toast({
          title: "Incorrect!",
          description: "Try again!",
          variant: "destructive",
        });

        if (nextAttempts >= gameState.maxAttempts) {
          toast({
            title: "Incorrect!",
            description: "Moving to the correct country...",
            variant: "destructive",
          });
          moveToCountry();
          setGameState((state) => ({
            ...state,
            errorCountries: [
              ...state.errorCountries,
              countryInQuestion.iso_3166_1,
            ],
            attempts: 0,
          }));
          setTimeout(() => {
            selectRandomCountry();
          }, 0);
        }
      }
    },
    [
      countryInQuestion,
      gameState.attempts,
      gameState.maxAttempts,
      selectRandomCountry,
      moveToCountry,
      setGameState,
    ],
  );

  const onCountryClick = useCallback(
    (countryProps: CountryProperties) => {
      if (!countryProps) {
        console.error("No country props");
        return;
      }
      setLastClickedCountry(countryProps.iso_3166_1);
      setGameState((state) => ({
        ...state,
        clickedCountryProps: countryProps,
      }));
      checkAnswer(countryProps.iso_3166_1);
    },
    [checkAnswer, setGameState],
  );

  const playedCountries = [...correctCountries, ...errorCountries];

  return {
    ...gameState,
    setAttempts: (attempts: number) =>
      setGameState((state) => ({ ...state, attempts })),
    resetGame,
    toggleGamePlay,
    startGame,
    endGame,
    countryInQuestion,
    shuffleQuestion,
    mapRef,
    getMapRef,
    setMapRef,
    onCountryClick,
    playedCountries,
    availableLocations: getCountriesBySet(questionSet),
    lastClickedCountry,
    setLastClickedCountry,
    selectRandomCountry,
    checkAnswer,
  };
}

export default useGame;
