import { useAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { MapContainer } from './components/Map/MapContainer';
import {
  countryInQuestionAtom,
  CountryProperties,
  isPlayingAtom,
  playedCountriesAtom,
} from './components/Map/state';
import { Alert } from './components/ui/alert';
import { Button } from './components/ui/button';
import { countries } from './lib/countries';

function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  const [currentCountry, setCurrentCountry] = useAtom(countryInQuestionAtom);
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [playedCountries, setPlayedCountries] = useAtom(playedCountriesAtom);
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
        zoom: 2,
        essential: true,
      });
    }
  }, [currentCountry]);

  const checkAnswer = useCallback(
    (clickedCountry: string) => {
      if (!currentCountry) {
        console.error('No country selected');
        return;
      }

      if (clickedCountry === currentCountry.iso_3166_1) {
        setMessage('Correct!');
        setTimeout(() => {
          setMessage('');
          selectRandomCountry();
          setAttempts(0);
          setPlayedCountries((prev) => [...prev, currentCountry.iso_3166_1]);
        }, 1000);
      } else {
        setAttempts((prev) => prev + 1);
        if (attempts >= 2) {
          setMessage('Moving to the correct country...');
          moveToCountry();
          selectRandomCountry();
          setPlayedCountries((prev) => [...prev, currentCountry.iso_3166_1]);
        } else {
          setMessage('Try again!');
        }
      }
    },
    [
      attempts,
      currentCountry,
      moveToCountry,
      selectRandomCountry,
      setPlayedCountries,
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
            {message && <Alert>{message}</Alert>}
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
    </div>
  );
}

export default App;
