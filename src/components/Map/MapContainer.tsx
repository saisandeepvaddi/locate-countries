'use client';
import useCountries from '@/hooks/useCountries';
import useGame from '@/hooks/useGame';
import { CountryPopupInfo } from '@/lib/types';
import { mapboxApiKeyAtom } from '@/state/settings';
import { useAtomValue, useSetAtom } from 'jotai';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useState } from 'react';
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
} from '../../state/game';
import MapboxKeyInput from '../Settings/MapboxKeyInput';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import CountryBoundariesLayer from './CountryBoundariesLayer';
import CountryPopup from './Markers/CountryPopup';
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
  const [popupInfo, setPopupInfo] = useState<CountryPopupInfo | null>(null);
  const mapboxApiKey = useAtomValue(mapboxApiKeyAtom);
  const { getCountryByIso } = useCountries();
  const setHoveredCountryProps = useCallback(
    (hoveredCountryProps: CountryProperties) => {
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
        setPopupInfo(null);
        setClickedCountryProperties(null);
        return;
      }

      const clickedCountryIso = event.features[0].properties?.iso_3166_1;
      if (!clickedCountryIso) {
        return;
      }
      setClickedCountryProperties(event.features[0].properties);
      const isPlayed = playedCountries.includes(clickedCountryIso);
      if (!isPlayed) {
        onCountryClick(event.features[0].properties);
      }
      if (isPlayed) {
        const { lat, lng } = event.lngLat;
        const countryInfo = getCountryByIso(clickedCountryIso);
        setPopupInfo({ country: countryInfo, latitude: lat, longitude: lng });
      }
      setLastClickedCountry(event.features[0].properties?.iso_3166_1 ?? null);
    },
    [
      setClickedCountryProperties,
      playedCountries,
      onCountryClick,
      setLastClickedCountry,
      getCountryByIso,
    ]
  );

  const onMouseLeave = useCallback(
    (event: MapMouseEvent) => {
      const map = event.target;
      map.getCanvasContainer().style.cursor = '';
      setHoveredCountryProperties(null);
    },
    [setHoveredCountryProperties]
  );

  // const apikey = import.meta.env.DEV
  //   ? import.meta.env.VITE_MAPBOX_TOKEN
  //   : mapboxApiKey;
  const apikey = mapboxApiKey;

  if (!apikey) {
    return (
      <Dialog modal defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Mapbox API key</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This free app uses{' '}
            <a
              href='https://www.mapbox.com/'
              target='_blank'
              rel='noreferrer noopener'
              className='underline'
            >
              Mapbox service
            </a>
            . I cannot pay for a Mapbox API beyond its allowed free-tier limits.
            Please get a free key and paste here.
          </DialogDescription>
          <MapboxKeyInput
            onApiKeyChange={() => {
              window.location.reload();
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Map
      id='map'
      ref={setMapRef}
      initialViewState={{
        latitude: 0,
        longitude: 20,
        zoom: 2,
        bearing: 0,
        pitch: 0,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapboxAccessToken={apikey}
      reuseMaps
      interactiveLayerIds={isPlaying ? ['country-boundaries'] : []}
      onMouseMove={onHover}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <ScaleControl />
      <NavigationControl position='bottom-right' />
      {popupInfo && (
        <CountryPopup
          popup={popupInfo}
          onClose={() => {
            setPopupInfo(null);
          }}
        />
      )}
      <PlayedCountryMarkers countryISOs={playedCountries} />
      <CountryBoundariesLayer />
    </Map>
  );
}
