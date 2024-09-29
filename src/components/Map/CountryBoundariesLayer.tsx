import { useAtomValue } from 'jotai';
import { Layer, Source } from 'react-map-gl';
import {
  correctCountriesAtom,
  errorCountriesAtom,
  hoveredCountryIdAtom,
} from '../../state';

function CountryBoundariesLayer(): JSX.Element {
  const hoveredCountryId = useAtomValue(hoveredCountryIdAtom);
  const playedCountries = useAtomValue(correctCountriesAtom);
  const errorCountries = useAtomValue(errorCountriesAtom);
  return (
    <Source
      id='country-boundaries'
      type='vector'
      url='mapbox://mapbox.country-boundaries-v1'
    >
      <Layer
        id='country-boundaries'
        type='fill'
        source-layer='country_boundaries'
        paint={{
          'fill-color': [
            'case',
            ['in', ['get', 'iso_3166_1'], ['literal', errorCountries]],
            '#d90429', // Red color for error countries
            ['in', ['get', 'iso_3166_1'], ['literal', playedCountries]],
            '#2a9d8f', // Green color for correct countries
            [
              'boolean',
              ['==', ['get', 'iso_3166_1'], hoveredCountryId ?? null],
              0,
            ],
            '#212529', // Hovered country color
            '#CCCCCC', // Default color
          ],
          'fill-outline-color': '#000000',
        }}
      />
    </Source>
  );
}

export default CountryBoundariesLayer;
