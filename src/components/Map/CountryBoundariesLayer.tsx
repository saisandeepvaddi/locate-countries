import { useAtomValue } from 'jotai';
import { Layer, Source } from 'react-map-gl';
import {
  correctCountriesAtom,
  errorCountriesAtom,
  hoveredCountryIdAtom,
  layerThemeAtom,
  playedCountriesAtom,
} from '../../state';

function CountryBoundariesLayer() {
  const hoveredCountryId = useAtomValue(hoveredCountryIdAtom);
  const correctCountries = useAtomValue(correctCountriesAtom);
  const errorCountries = useAtomValue(errorCountriesAtom);
  const playedCountries = useAtomValue(playedCountriesAtom);
  const layerTheme = useAtomValue(layerThemeAtom);
  const lastPlayedCountry = playedCountries[playedCountries.length - 1];
  return (
    <Source
      id='country-boundaries'
      type='vector'
      url='mapbox://mapbox.country-boundaries-v1'
    >
      <Layer
        id='background'
        type='background'
        paint={{
          'background-color': layerTheme.ocean,
        }}
      />
      <Layer
        id='country-boundaries'
        type='fill'
        source-layer='country_boundaries'
        paint={{
          'fill-color': [
            'case',
            ['in', ['get', 'iso_3166_1'], ['literal', errorCountries]],
            layerTheme.error, // Red color for error countries
            ['in', ['get', 'iso_3166_1'], ['literal', correctCountries]],
            layerTheme.correct, // Green color for correct countries
            [
              'boolean',
              ['==', ['get', 'iso_3166_1'], hoveredCountryId ?? null],
              0,
            ],
            layerTheme.hovered, // Hovered country color
            layerTheme.default, // Default color
          ],
          'fill-outline-color': layerTheme.border,
          'fill-opacity': [
            'case',
            ['==', ['get', 'iso_3166_1'], lastPlayedCountry],
            0.9,
            ['in', ['get', 'iso_3166_1'], ['literal', playedCountries]],
            0.25,
            1,
          ],
        }}
      />
    </Source>
  );
}

export default CountryBoundariesLayer;
