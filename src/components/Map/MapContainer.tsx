'use client';
import { useAtomValue, useSetAtom } from 'jotai';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback } from 'react';
import { Map, MapLib, MapMouseEvent } from 'react-map-gl';
import {
  clickedCountryPropsAtom,
  CountryProperties,
  hoveredCountryIdAtom,
  hoveredCountryPropsAtom,
  isPlayingAtom,
} from '../../state';
import CountryBoundariesLayer from './CountryBoundariesLayer';
import PlayedCountryMarkers from './PlayedCountryMarkers';

// import { prepareData } from '@/lib/prepare';
// window.v = prepareData();

export interface MapContainerProps {
  mapRef: React.RefObject<mapboxgl.Map>;
  onClick: (event: CountryProperties) => void;
}
export function MapContainer({ mapRef, onClick }: MapContainerProps) {
  const isPlaying = useAtomValue(isPlayingAtom);
  const setHoveredCountryProperties = useSetAtom(hoveredCountryPropsAtom);
  const setClickedCountryProperties = useSetAtom(clickedCountryPropsAtom);
  const setHoveredCountryId = useSetAtom(hoveredCountryIdAtom);

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

      // console.log(event.features[0].properties);

      setClickedCountryProperties(event.features[0].properties);
      onClick(event.features[0].properties);
    },
    [setClickedCountryProperties, onClick]
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
      //@ts-expect-error not good types from mapboxgl to react-map-gl
      ref={mapRef}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapLib={mapboxgl as unknown as MapLib<any>}
      initialViewState={{
        latitude: 0,
        longitude: 20,
        zoom: 2,
        bearing: 0,
        pitch: 0,
      }}
      style={{ width: '100vw', height: '100vh' }}
      // mapStyle={mapStyle}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      // {...mapProps}
      reuseMaps
      interactiveLayerIds={isPlaying ? ['country-boundaries'] : []}
      onMouseMove={onHover}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <PlayedCountryMarkers />
      <CountryBoundariesLayer />
    </Map>
  );
}
