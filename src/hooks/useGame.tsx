import { countries, Country } from "@/lib/countries";
import { getCountriesBySet } from "@/lib/utils";
import { CountryProperties, GameState, gameStateAtom } from "@/state/game";
import { useAtom } from "jotai";
import { useCallback, useMemo, useRef, useState } from "react";
import { LngLatLike, MapRef } from "react-map-gl";
import { toast } from "./use-toast";

function useGame() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const { questionSet, countryInQuestion, correctCountries, errorCountries } =
    gameState;

  const playedCountries = [...correctCountries, ...errorCountries];

  const getRandomCountry = useCallback((state: GameState = gameState) => {
    const playedCountries = [
      ...state.correctCountries,
      ...state.errorCountries,
    ];
    const availableCountries = getCountriesBySet(state.questionSet).filter(
      (country) => !playedCountries.includes(country.iso_3166_1),
    );
    const randomCountry =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];
    return randomCountry;
  }, []);

  const selectRandomCountry = useCallback(() => {
    const randomCountry = getRandomCountry(gameState);
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

  const countriesInSet = useMemo(
    () => getCountriesBySet(questionSet),
    [questionSet],
  );

  const moveToCountry = useCallback(
    (country: Country) => {
      if (!country) {
        console.error("No country selected");
        return;
      }
      const map = mapRef?.current?.getMap?.();
      if (!map) {
        console.error("No map found");
        return;
      }

      if (country && map) {
        const [minLng, minLat, maxLng, maxLat] = country.bbox;
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
    },
    [countryInQuestion, countries],
  );

  const checkAnswer = useCallback(
    (clickedCountry: string) => {
      if (!countryInQuestion) {
        console.error("No country selected");
        return;
      }

      const isCorrect = clickedCountry === countryInQuestion.iso_3166_1;

      const nextState = { ...gameState };
      nextState.attempts = nextState.attempts + 1;
      if (isCorrect) {
        nextState.correctCountries = [
          ...nextState.correctCountries,
          countryInQuestion.iso_3166_1,
        ];

        nextState.attempts = 0;
        toast({
          title: "Correct!",
          description: "You found the country!",
          variant: "default",
        });
        nextState.countryInQuestion = getRandomCountry(nextState);
      } else if (nextState.attempts < nextState.maxAttempts) {
        nextState.attempts += 1;
        toast({
          title: "Incorrect!",
          description: "Try again!",
          variant: "destructive",
        });
      } else {
        nextState.errorCountries = [
          ...nextState.errorCountries,
          countryInQuestion.iso_3166_1,
        ];
        nextState.attempts = 0;
        nextState.countryInQuestion = getRandomCountry(nextState);
        toast({
          title: "Incorrect!",
          description: "Moving to next country",
          variant: "destructive",
        });
        moveToCountry(countryInQuestion as Country);
      }
      const isGameOver =
        nextState.correctCountries.length + nextState.errorCountries.length ===
        countriesInSet.length;
      nextState.isPlaying = !isGameOver;
      setGameState(nextState);
    },
    [
      countryInQuestion,
      gameState,
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

      checkAnswer(countryProps.iso_3166_1);
    },
    [checkAnswer, setGameState],
  );

  return {
    ...gameState,
    resetGame,
    toggleGamePlay,
    countryInQuestion,
    mapRef,
    getMapRef,
    setMapRef,
    onCountryClick,
    playedCountries,
    availableLocations: getCountriesBySet(questionSet),
    lastClickedCountry,
    setLastClickedCountry,
  };
}

export default useGame;
