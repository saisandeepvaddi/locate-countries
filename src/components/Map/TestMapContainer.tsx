import { layerThemes } from '@/lib/themes';
import { themeAtom } from '@/state/settings';
import { useAtomValue } from 'jotai';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
const token = import.meta.env.VITE_MAPBOX_TOKEN;

mapboxgl.accessToken = token;
function TestMapContainer(): JSX.Element {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const selectedTheme = useAtomValue(themeAtom);
  const layerTheme = layerThemes[selectedTheme] ?? layerThemes.light;

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Initialize map only once
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    mapboxgl.accessToken = token;
    if (!token) {
      console.error('No Mapbox token found');
      return;
    }
    map.current = new mapboxgl.Map({
      // accessToken: token,
      container: mapContainer.current,
      style: undefined, // 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
      projection: 'mercator',
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add source for country boundaries
      map.current.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      // Add base country layer
      map.current.addLayer({
        id: 'country-boundaries',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': layerTheme.default,
          'fill-outline-color': layerTheme.border,
        },
      });

      // Add hover layer
      map.current.addLayer({
        id: 'country-boundaries-hover',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': layerTheme.hovered,
          'fill-opacity': 0.25,
        },
        filter: ['==', 'iso_3166_1', ''],
      });

      // Handle mousemove event
      map.current.on('mousemove', 'country-boundaries', (e) => {
        if (e.features && e.features.length > 0) {
          const newHoveredCountry = e.features[0].properties?.iso_3166_1;
          if (newHoveredCountry !== hoveredCountryId) {
            setHoveredCountryId(newHoveredCountry);
            map.current?.setFilter('country-boundaries-hover', [
              '==',
              'iso_3166_1',
              newHoveredCountry,
            ]);
          }
        }
      });

      // Handle mouseout event
      map.current.on('mouseout', 'country-boundaries', () => {
        setHoveredCountryId(null);
        map.current?.setFilter('country-boundaries-hover', [
          '==',
          'iso_3166_1',
          '',
        ]);
      });
    });

    // return () => {
    //   map.current?.remove();
    // };
  }, [hoveredCountryId, layerTheme]);

  return (
    <div
      ref={mapContainer}
      style={{ position: 'absolute', width: '100vw', height: '100vh' }}
    />
  );
}

export default TestMapContainer;
