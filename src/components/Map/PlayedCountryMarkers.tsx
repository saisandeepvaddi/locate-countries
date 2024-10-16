import { Country } from "@/lib/countries";
import { CountryPopupInfo } from "@/lib/types";
import { useMemo, useState } from "react";
import CountryMarker from "./Markers/CountryMarker";
import CountryPopup from "./Markers/CountryPopup";

interface PlayedCountryMarkersProps {
  countryISOs: string[];
  showMarker?: boolean;
  showPopup?: boolean;
}

function PlayedCountryMarkers({
  countryISOs,
  showMarker = true,
  showPopup = false,
}: PlayedCountryMarkersProps) {
  const [popupInfo, setPopupInfo] = useState<CountryPopupInfo | null>(null);

  const markers = useMemo(() => {
    return countryISOs.map((countryIso) => {
      return (
        <CountryMarker
          key={countryIso}
          countryIso={countryIso}
          onClick={(country: Country) => {
            setPopupInfo({ country });
          }}
          type="normal"
        />
      );
    });
  }, [countryISOs]);

  return (
    <>
      {showMarker && markers}
      {showPopup && popupInfo && (
        <CountryPopup popup={popupInfo} onClose={() => setPopupInfo(null)} />
      )}
    </>
  );
}

export default PlayedCountryMarkers;
