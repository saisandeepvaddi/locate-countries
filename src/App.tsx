import { useToast } from '@/hooks/use-toast';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer } from './components/Map/MapContainer';
import {
  correctCountriesAtom,
  countryInQuestionAtom,
  CountryProperties,
  errorCountriesAtom,
  isPlayingAtom,
  playedCountriesAtom,
} from './components/Map/state';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { countries } from './lib/countries';
function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const { toast } = useToast();

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

  const resetGame = useCallback(() => {
    setCorrectCountries([]);
    setErrorCountries([]);
    selectRandomCountry();
  }, [selectRandomCountry, setCorrectCountries, setErrorCountries]);

  useEffect(() => {
    if (playedCountries.length === 5) {
      resetGame();
    }
  }, [playedCountries, resetGame]);

  const moveToCountry = useCallback(() => {
    if (!currentCountry) {
      console.error('No country selected');
      return;
    }
    const countryData = Object.values(countries).find(
      (c) => c.iso_3166_1 === currentCountry.iso_3166_1
    );
    if (countryData && mapRef.current) {
      const [minLng, minLat] = countryData.bbox;
      mapRef.current.flyTo({
        center: [minLng, minLat],
        zoom: mapRef.current.getZoom() + 1,
        essential: true,
      });
      setTimeout(() => {
        mapRef.current?.zoomTo(2);
      }, 1000);
    }
  }, [currentCountry]);

  const checkAnswer = useCallback(
    (clickedCountry: string) => {
      if (!currentCountry) {
        console.error('No country selected');
        return;
      }

      if (clickedCountry === currentCountry.iso_3166_1) {
        toast({
          title: 'Correct!',
          description: 'You found the country!',
          variant: 'default',
        });
        setTimeout(() => {
          selectRandomCountry();
          setAttempts(0);
          setCorrectCountries((prev) => [...prev, currentCountry.iso_3166_1]);
        }, 1000);
      } else {
        setAttempts((prev) => prev + 1);
        toast({
          title: 'Incorrect!',
          description: 'Try again!',
          variant: 'destructive',
        });
        if (attempts >= 2) {
          toast({
            title: 'Incorrect!',
            description: 'Moving to the correct country...',
            variant: 'destructive',
          });
          moveToCountry();
          setErrorCountries((prev) => [...prev, currentCountry.iso_3166_1]);
          selectRandomCountry();
        }
      }
    },
    [
      attempts,
      currentCountry,
      moveToCountry,
      selectRandomCountry,
      setCorrectCountries,
      setErrorCountries,
      toast,
    ]
  );

  const onClick = useCallback(
    (countryProps: CountryProperties) => {
      if (!countryProps) {
        console.error('No country props');
        return;
      }
      checkAnswer(countryProps.iso_3166_1);
    },
    [checkAnswer]
  );

  return (
    <div className='h-screen w-screen'>
      <div>
        {isPlaying && (
          <div className='game-question'>
            <h2>Find this country:</h2>
            <p>{currentCountry?.name}</p>
            {/* {message && <Alert variant={'destructive'}>{message}</Alert>} */}
          </div>
        )}
        <Button
          onClick={() => {
            const previousIsPlaying = isPlaying;
            setIsPlaying(!isPlaying);
            if (!previousIsPlaying) {
              selectRandomCountry();
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={() => selectRandomCountry()}>Shuffle</Button>
      </div>
      <MapContainer mapRef={mapRef} onClick={onClick} />
      <Toaster />
    </div>
  );
}

export default App;
