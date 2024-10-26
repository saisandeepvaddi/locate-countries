import { CountryProperties, gameStateAtom } from "@/state/game";
import { useAtom } from "jotai";
import { useCallback, useRef, useState } from "react";
import { LngLatLike, MapRef } from "react-map-gl";
import { toast } from "./use-toast";
import useCountries from "./useCountries";

function useGame() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const {
    selectRandomCountry,
    questionLocation,
    countries,
    playedCountries,
    countrySet,
  } = useCountries();

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
    setGameState((state) => ({
      ...state,
      isPlaying: !state.isPlaying,
    }));
    if (!gameState.isPlaying) {
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
    if (!questionLocation) {
      console.error("No country selected");
      return;
    }
    const map = mapRef?.current?.getMap?.();
    if (!map) {
      console.error("No map found");
      return;
    }
    const countryData = Object.values(countries).find(
      (c) => c.iso_3166_1 === questionLocation.iso_3166_1,
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
  }, [questionLocation, countries]);

  const checkAnswer = useCallback(
    (clickedCountry: string) => {
      if (!questionLocation) {
        console.error("No country selected");
        return;
      }

      if (clickedCountry === questionLocation.iso_3166_1) {
        toast({
          title: "Correct!",
          description: "You found the country!",
          variant: "default",
        });

        setGameState((state) => ({
          ...state,
          correctCountries: [
            ...state.correctCountries,
            questionLocation.iso_3166_1,
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
              questionLocation.iso_3166_1,
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
      questionLocation,
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

  return {
    ...gameState,
    setAttempts: (attempts: number) =>
      setGameState((state) => ({ ...state, attempts })),
    resetGame,
    toggleGamePlay,
    startGame,
    endGame,
    questionLocation,
    shuffleQuestion,
    mapRef,
    getMapRef,
    setMapRef,
    onCountryClick,
    playedLocations: playedCountries,
    availableLocations: countrySet,
    lastClickedCountry,
    setLastClickedCountry,
  };
}

export default useGame;
