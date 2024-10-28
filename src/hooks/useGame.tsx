import { Button } from "@/components/ui/button";
import { countries, Country } from "@/lib/countries";
import { getCountriesBySet, getCountryByIso } from "@/lib/utils";
import {
  CountryProperties,
  GameState,
  gameStateAtom,
  initialGameState,
  RegionSet,
} from "@/state/game";
import { useAtom } from "jotai";
import { useCallback, useRef, useState } from "react";
import { LngLatLike, MapRef } from "react-map-gl";
import { toast } from "./use-toast";

function useGame() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const { countryInQuestion, correctCountries, errorCountries } = gameState;

  const playedCountries = [...correctCountries, ...errorCountries];

  // useEffect(() => {
  //   if (!gameState.isPlaying) {
  //     return;
  //   }
  //   if (gameState.questionSet === RegionSet.CUSTOM) {
  //     return;
  //   }
  //   console.log("Restarting with questionSet:", gameState.questionSet);
  //   const questionBank = getCountriesBySet(gameState.questionSet);
  //   replayWithFixedCountries(gameState.questionSet, questionBank);
  // }, [gameState.questionSet]);

  const getRandomCountry = useCallback((state: GameState = gameState) => {
    const playedCountries = [
      ...state.correctCountries,
      ...state.errorCountries,
    ];

    const availableCountries = state.questionBank.filter((country) => {
      const isMacaoPlayed = playedCountries.includes("MO");
      const isHongKongPlayed = playedCountries.includes("HK");
      const isTaiwanPlayed = playedCountries.includes("TW");

      // Mapbox selection for China includes macau, hong kong, and taiwan
      // But, there's different bounding boxes for MO, HK, and TW as well
      // So, if china played first, we'll be unable to click on MO, HK, or TW
      // So allow china selection only if MO, HK, and TW have been played
      if (country.iso_3166_1 === "CN") {
        return isMacaoPlayed && isHongKongPlayed && isTaiwanPlayed;
      }

      return !playedCountries.includes(country.iso_3166_1);
    });

    // This commented code is here just to test china & its claimed provinces. Don't remove it yet.
    // availableCountries = [
    //   state.questionBank.find((c) => c.iso_3166_1 === "TW"),
    //   state.questionBank.find((c) => c.iso_3166_1 === "MO"),
    //   state.questionBank.find((c) => c.iso_3166_1 === "HK"),
    //   state.questionBank.find((c) => c.iso_3166_1 === "IN"),
    // ]
    //   .filter(Boolean)
    //   .filter(
    //     (c) => !playedCountries.includes((c as Country).iso_3166_1),
    //   ) as Country[];

    const randomCountry =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];

    return randomCountry;
  }, []);

  const mapRef = useRef<MapRef>(null);
  const [lastClickedCountry, setLastClickedCountry] = useState<string | null>(
    null,
  );

  const setMapRef = useCallback((ref: MapRef) => {
    mapRef.current = ref;
  }, []);

  const getMapRef = useCallback(() => mapRef.current, []);

  const resetGame = useCallback(() => {
    const gameSet = gameState.questionSet;
    const newState = { ...initialGameState };
    newState.questionSet =
      gameSet === RegionSet.CUSTOM ? RegionSet.ALL : gameSet;
    newState.questionBank = getCountriesBySet(newState.questionSet);
    newState.countryInQuestion = getRandomCountry(newState);
    newState.isPlaying = true;
    setGameState(newState);
  }, [getRandomCountry, setGameState]);

  const replayWithFixedCountries = useCallback(
    (region: RegionSet, countries: string[] | Country[]) => {
      if (countries.length === 0) {
        toast({
          title: "No countries selected",
          description: "Please select at least one country",
          variant: "destructive",
        });
        return;
      }
      const newState = { ...initialGameState };
      newState.questionSet = region;
      if (typeof countries[0] === "string") {
        newState.questionBank = (countries as string[]).map((iso) =>
          getCountryByIso(iso),
        );
      } else {
        newState.questionBank = countries as Country[];
      }
      newState.countryInQuestion = getRandomCountry(newState);
      newState.isPlaying = true;
      setGameState(newState);
    },
    [getRandomCountry, setGameState],
  );

  const replayWithRegionSet = useCallback(
    (region: RegionSet) => {
      const countries = getCountriesBySet(region);
      replayWithFixedCountries(region, countries);
    },
    [replayWithFixedCountries],
  );

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
        nextState.questionBank.length;

      if (isGameOver) {
        nextState.isPlaying = false;
        setGameState(nextState);
        const { dismiss } = toast({
          title: "Game Over!",
          description: "You've played all the countries!",
          variant: "default",
          action: (
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  resetGame();
                  dismiss();
                }}
              >
                Play Again
              </Button>
              {nextState.errorCountries.length > 0 && (
                <Button
                  onClick={() => {
                    replayWithFixedCountries(
                      RegionSet.CUSTOM,
                      nextState.errorCountries,
                    );
                    dismiss();
                  }}
                >
                  Replay with wrong choices
                </Button>
              )}
            </div>
          ),
        });
      } else {
        setGameState(nextState);
      }
    },
    [countryInQuestion, gameState, moveToCountry, setGameState],
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
    replayWithFixedCountries,
    replayWithRegionSet,
    resetGame,
    toggleGamePlay,
    countryInQuestion,
    mapRef,
    getMapRef,
    setMapRef,
    onCountryClick,
    playedCountries,
    lastClickedCountry,
    setLastClickedCountry,
  };
}

export default useGame;
