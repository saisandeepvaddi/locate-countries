'use client';
import { useAtom } from 'jotai';
import debounce from 'lodash/debounce';
import mapboxgl from 'mapbox-gl';
import { useCallback, useMemo, useState } from 'react';
import Map, { Layer, MapLib, MapMouseEvent, MapProps, Source } from 'react-map-gl';
import { MapStyle } from 'react-map-gl/dist/esm/types';
import { clickedCountryPropsAtom, CountryProperties, hoveredCountryPropsAtom } from './state';


export function MapContainer() {
  const [hoveredCountryProperties, setHoveredCountryProperties] = useAtom(hoveredCountryPropsAtom);
  const [clickedCountryProperties, setClickedCountryProperties] = useAtom(clickedCountryPropsAtom);
  const [hoveredPolygonId, setHoveredPolygonId] = useState<string | null>(null);
  const mapProps: MapProps = useMemo(() => {
    const mapStyle: MapStyle = {
      version: 8,
      sources: {},
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: { 'background-color': '#f0f0f0' }
        }
      ]
    };
    const props: MapProps = {
    mapLib: mapboxgl as unknown as MapLib<any>,
    initialViewState: {
      longitude: 0,
      latitude: 20,
      zoom: 2
    },
    style: { width: '100vw', height: '100vh' },
    mapStyle,
    mapboxAccessToken: import.meta.env.VITE_MAPBOX_TOKEN,
  } as unknown as MapProps;
  return props;
  }, []);


  const setHoveredCountryProps = useCallback(
    debounce((hoveredCountryProps: CountryProperties) => {
      setHoveredCountryProperties(hoveredCountryProps);
    }, 100),
    []
  );

  const onHover = useCallback((event: MapMouseEvent) => {
    const map = event.target;
    const features = event.features;
    if(!features || features.length === 0) {
      setHoveredCountryProperties(null);
      return;
    }
    const featureId = features[0].id as string;
    setHoveredPolygonId(featureId);
    const countryHovered = features[0].properties?.iso_3166_1;
    if(countryHovered && countryHovered !== features[0].properties?.iso_3166_1) {
      map.setFeatureState({
        source: 'country-boundaries',
        sourceLayer: 'country_boundaries',
        id: featureId
      }, {
        hover: false
      })
    }
    map.getCanvasContainer().style.cursor = 'pointer';
    map.setFeatureState({
      source: 'country-boundaries',
      sourceLayer: 'country_boundaries',
      id: featureId
    }, {
      hover: true
    });
    setHoveredCountryProps(features[0].properties)
  }, [setHoveredCountryProperties, setHoveredCountryProps]);

  const onClick = useCallback((event: MapMouseEvent ) => {
    if(!event.features || event.features.length === 0) {
      setClickedCountryProperties(null);
      return;
    }

    setClickedCountryProperties(event.features[0].properties);  
  }, [setClickedCountryProperties]);

  const onMouseLeave = useCallback((event: MapMouseEvent) => {
    const map = event.target;
    map.getCanvasContainer().style.cursor = '';
    setHoveredCountryProperties(null);
    setHoveredPolygonId(null);

  }, [setHoveredCountryProperties]);



  return (
    <Map
      {...mapProps}
      reuseMaps
      interactiveLayerIds={['country-boundaries']}
      onMouseMove={onHover}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Source
        id="country-boundaries"
        type="vector"
        url="mapbox://mapbox.country-boundaries-v1"
      >
        <Layer
          id="country-boundaries"
          type="fill"
          source-layer="country_boundaries"
          paint={{
            'fill-color': [
              'case',
              ['boolean', ['==', ['get', 'iso_3166_1'], hoveredCountryProperties?.iso_3166_1 ?? null], 0],
              '#627BC1',
              '#CCCCCC' 
            ],           
            'fill-outline-color': '#000000'
          }}
        />
      </Source>
    </Map>
  );
}