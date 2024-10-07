'use client';
import useGame from '@/hooks/useGame';
import { useAtomValue, useSetAtom } from 'jotai';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback } from 'react';
import {
  Map,
  MapMouseEvent,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl';
import {
  clickedCountryPropsAtom,
  CountryProperties,
  hoveredCountryIdAtom,
  hoveredCountryPropsAtom,
  isPlayingAtom,
  playedCountriesAtom,
} from '../../state';
import CountryBoundariesLayer from './CountryBoundariesLayer';
import PlayedCountryMarkers from './PlayedCountryMarkers';

// import { prepareData } from '@/lib/prepare';
// window.v = prepareData();

export function MapContainer() {
  const isPlaying = useAtomValue(isPlayingAtom);
  const setHoveredCountryProperties = useSetAtom(hoveredCountryPropsAtom);
  const setClickedCountryProperties = useSetAtom(clickedCountryPropsAtom);
  const setHoveredCountryId = useSetAtom(hoveredCountryIdAtom);
  const { onCountryClick, setMapRef } = useGame();
  const { setLastClickedCountry } = useGame();
  const playedCountries = useAtomValue(playedCountriesAtom);

  const setHoveredCountryProps = useCallback(
    (hoveredCountryProps: CountryProperties) => {
      // setHoveredCountryProperties(hoveredCountryProps);
      setHoveredCountryId(hoveredCountryProps?.iso_3166_1 ?? null);
    },
    [setHoveredCountryId]
  );

  const onHover = useCallback(
    (event: MapMouseEvent) => {
      const map = event.target;
      const features = event.features;
      if (!features || features.length === 0) {
        setHoveredCountryProperties(null);
        setHoveredCountryId(null);
        return;
      }
      const featureId = features[0].id as string;
      const countryHovered = features[0].properties?.iso_3166_1;
      if (
        countryHovered &&
        countryHovered !== features[0].properties?.iso_3166_1
      ) {
        map.setFeatureState(
          {
            source: 'country-boundaries',
            sourceLayer: 'country_boundaries',
            id: featureId,
          },
          {
            hover: false,
          }
        );
      }
      map.getCanvasContainer().style.cursor = 'pointer';
      map.setFeatureState(
        {
          source: 'country-boundaries',
          sourceLayer: 'country_boundaries',
          id: featureId,
        },
        {
          hover: true,
        }
      );
      setHoveredCountryProps(features[0].properties);
    },
    [setHoveredCountryId, setHoveredCountryProperties, setHoveredCountryProps]
  );

  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      if (!event.features || event.features.length === 0) {
        setClickedCountryProperties(null);
        return;
      }

      const clickedCountryIso = event.features[0].properties?.iso_3166_1;
      if (!clickedCountryIso) {
        return;
      }
      setClickedCountryProperties(event.features[0].properties);
      if (!playedCountries.includes(clickedCountryIso)) {
        onCountryClick(event.features[0].properties);
      }
      setLastClickedCountry(event.features[0].properties?.iso_3166_1 ?? null);
    },
    [setClickedCountryProperties, onCountryClick, playedCountries]
  );

  const onMouseLeave = useCallback(
    (event: MapMouseEvent) => {
      const map = event.target;
      map.getCanvasContainer().style.cursor = '';
      setHoveredCountryProperties(null);
    },
    [setHoveredCountryProperties]
  );

  return (
    <Map
      id='map'
      ref={setMapRef}
      // mapLib={mapboxgl as unknown as MapLib<any>}
      initialViewState={{
        latitude: 0,
        longitude: 20,
        zoom: 2,
        bearing: 0,
        pitch: 0,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      reuseMaps
      interactiveLayerIds={isPlaying ? ['country-boundaries'] : []}
      onMouseMove={onHover}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <ScaleControl />
      <NavigationControl position='bottom-right' />
      <PlayedCountryMarkers countryISOs={playedCountries} />
      <CountryBoundariesLayer />
    </Map>
  );
}
