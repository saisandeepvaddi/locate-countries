import {
  attemptsAtom,
  correctCountriesAtom,
  CountryProperties,
  errorCountriesAtom,
  isPlayingAtom,
  maxAttemptsAtom,
} from "@/state/game";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
// import { LngLatLike } from 'mapbox-gl';
import { useCallback, useRef, useState } from "react";
import { LngLatLike, MapRef } from "react-map-gl";
import { toast } from "./use-toast";
import useCountries from "./useCountries";

function useGame() {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [attempts, setAttempts] = useAtom(attemptsAtom);
  const maxAttempts = useAtomValue(maxAttemptsAtom);
  const {
    selectRandomCountry,
    questionLocation,
    countries,
    playedCountries,
    countrySet,
  } = useCountries();
  const setCorrectCountries = useSetAtom(correctCountriesAtom);
  const setErrorCountries = useSetAtom(errorCountriesAtom);

  const mapRef = useRef<MapRef>(null);
  const [lastClickedCountry, setLastClickedCountry] = useState<string | null>(
    null,
  );
  const setMapRef = useCallback((ref: MapRef) => {
    mapRef.current = ref;
  }, []);

  const getMapRef = useCallback(() => mapRef.current, []);

  const resetGame = useCallback(() => {
    setAttempts(0);
    setCorrectCountries([]);
    setErrorCountries([]);
    selectRandomCountry();
  }, [
    selectRandomCountry,
    setAttempts,
    setCorrectCountries,
    setErrorCountries,
  ]);

  const shuffleQuestion = () => {
    selectRandomCountry();
  };

  const toggleGamePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      resetGame();
    }
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
  }, [questionLocation, mapRef, countries]);

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

        setCorrectCountries((prev) => {
          const updatedCorrectCountries = [
            ...prev,
            questionLocation.iso_3166_1,
          ];
          setTimeout(() => {
            selectRandomCountry();
            setAttempts(0);
          }, 0);
          return updatedCorrectCountries;
        });
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        toast({
          title: "Incorrect!",
          description: "Try again!",
          variant: "destructive",
        });
        if (nextAttempts >= maxAttempts) {
          toast({
            title: "Incorrect!",
            description: "Moving to the correct country...",
            variant: "destructive",
          });
          moveToCountry();
          setErrorCountries((prev) => {
            const updatedErrorCountries = [
              ...prev,
              questionLocation.iso_3166_1,
            ];
            setTimeout(() => {
              selectRandomCountry();
              setAttempts(0);
            }, 0);
            return updatedErrorCountries;
          });
        }
      }
    },
    [
      questionLocation,
      selectRandomCountry,
      setAttempts,
      setCorrectCountries,
      attempts,
      moveToCountry,
      setErrorCountries,
    ],
  );

  const onCountryClick = useCallback(
    (countryProps: CountryProperties) => {
      if (!countryProps) {
        console.error("No country props");
        return;
      }
      setLastClickedCountry(countryProps.iso_3166_1);
      checkAnswer(countryProps.iso_3166_1);
    },
    [checkAnswer],
  );

  return {
    attempts,
    isPlaying,
    setAttempts,
    resetGame,
    toggleGamePlay,
    startGame,
    endGame,
    questionLocation: questionLocation,
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
