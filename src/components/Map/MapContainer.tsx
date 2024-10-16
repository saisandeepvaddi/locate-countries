"use client";
import useCountries from "@/hooks/useCountries";
import useGame from "@/hooks/useGame";
import { MAX_FREE_LOADS } from "@/lib/constants";
import { CountryPopupInfo } from "@/lib/types";
import {
  lastUsedDateAtom,
  mapboxApiKeyAtom,
  pageLoadCountTodayAtom,
} from "@/state/settings";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useState } from "react";
import { Map, MapMouseEvent } from "react-map-gl";
import {
  clickedCountryPropsAtom,
  hoveredCountryIdAtom,
  isPlayingAtom,
  playedCountriesAtom,
} from "../../state/game";
import MapboxKeyInput from "../Settings/MapboxKeyInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CountryBoundariesLayer from "./CountryBoundariesLayer";
import CountryPopup from "./Markers/CountryPopup";
import PlayedCountryMarkers from "./PlayedCountryMarkers";

// import { prepareData } from '@/lib/prepare';
// window.v = prepareData();

const initialViewState = {
  latitude: 0,
  longitude: 20,
  zoom: 2,
  bearing: 0,
  pitch: 0,
};

const mapContainerStyle = { width: "100vw", height: "100vh" };
export function MapContainer() {
  const isPlaying = useAtomValue(isPlayingAtom);
  const setClickedCountryProperties = useSetAtom(clickedCountryPropsAtom);
  const [lastHoveredCountryId, setHoveredCountryId] =
    useAtom(hoveredCountryIdAtom);
  const { onCountryClick, setMapRef, setLastClickedCountry } = useGame();
  const playedCountries = useAtomValue(playedCountriesAtom);
  const [popupInfo, setPopupInfo] = useState<CountryPopupInfo | null>(null);
  const mapboxApiKey = useAtomValue(mapboxApiKeyAtom);
  const { getCountryByIso } = useCountries();
  const pageLoadCountToday = useAtomValue(pageLoadCountTodayAtom);

  const onHover = useCallback(
    (event: MapMouseEvent) => {
      const map = event.target;
      const features = event.features;
      if (!features || features.length === 0) {
        setHoveredCountryId(null);
        map.getCanvasContainer().style.cursor = "";
        return;
      }
      const newHoveredCountry = features[0].properties?.iso_3166_1;

      if (newHoveredCountry !== lastHoveredCountryId) {
        map.getCanvasContainer().style.cursor = "pointer";
        setHoveredCountryId(newHoveredCountry);
      }
    },
    [lastHoveredCountryId, setHoveredCountryId],
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
    ],
  );

  const handleMapLoad = useAtomCallback((get, set) => {
    const lastUsedDate = get(lastUsedDateAtom);
    const now = new Date();
    if (lastUsedDate && lastUsedDate.toDateString() !== now.toDateString()) {
      set(pageLoadCountTodayAtom, 1);
    } else {
      set(pageLoadCountTodayAtom, get(pageLoadCountTodayAtom) + 1);
    }
    set(lastUsedDateAtom, now);
  });

  const withinFreeLoads = pageLoadCountToday <= MAX_FREE_LOADS;
  const freeAPIKey = import.meta.env.VITE_MAPBOX_TOKEN ?? mapboxApiKey;

  const apikey = mapboxApiKey
    ? mapboxApiKey
    : withinFreeLoads || import.meta.env.MODE === "development"
      ? freeAPIKey
      : null;

  if (!apikey) {
    return (
      <Dialog modal defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Mapbox API key</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This free app uses{" "}
            <a
              href="https://www.mapbox.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
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
      id="map"
      ref={setMapRef}
      initialViewState={initialViewState}
      style={mapContainerStyle}
      mapboxAccessToken={apikey}
      // baseApiUrl={`${window.location.origin}/mapbox`}
      // reuseMaps
      interactiveLayerIds={
        isPlaying
          ? [
              "country-boundaries",
              "country-boundaries-hover",
              "country-boundaries-incorrect",
            ]
          : []
      }
      onMouseMove={onHover}
      // onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onLoad={handleMapLoad}
    >
      {/* <ScaleControl />
      <NavigationControl position='bottom-right' /> */}
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
