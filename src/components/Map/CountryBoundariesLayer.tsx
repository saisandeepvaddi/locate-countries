import { useAtomValue } from 'jotai';
import { Layer, Source } from 'react-map-gl';
import { hoveredCountryIdAtom } from './state';

function CountryBoundariesLayer(): JSX.Element {
  const hoveredCountryId = useAtomValue(hoveredCountryIdAtom);
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
            [
              'boolean',
              ['==', ['get', 'iso_3166_1'], hoveredCountryId ?? null],
              0,
            ],
            '#627BC1',
            '#CCCCCC',
          ],
          'fill-outline-color': '#000000',
        }}
      />
    </Source>
  );
}

export default CountryBoundariesLayer;
