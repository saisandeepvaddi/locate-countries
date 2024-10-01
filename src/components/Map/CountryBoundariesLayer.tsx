import { useAtomValue } from 'jotai';
import { Layer, Source } from 'react-map-gl';
import {
  correctCountriesAtom,
  errorCountriesAtom,
  hoveredCountryIdAtom,
  layerThemeAtom,
} from '../../state';

function CountryBoundariesLayer() {
  const hoveredCountryId = useAtomValue(hoveredCountryIdAtom);
  const playedCountries = useAtomValue(correctCountriesAtom);
  const errorCountries = useAtomValue(errorCountriesAtom);
  const layerTheme = useAtomValue(layerThemeAtom);
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
            layerTheme.error, // Red color for error countries
            ['in', ['get', 'iso_3166_1'], ['literal', playedCountries]],
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
        }}
      />
    </Source>
  );
}

export default CountryBoundariesLayer;
