import useCountries from "@/hooks/useCountries";
import { Country } from "@/lib/countries";
import { getCoords } from "@/lib/utils";
import { Marker } from "react-map-gl";

interface CountryMarkerProps {
  countryIso: string;
  onClick: (country: Country) => void;
  type?: "normal" | "fancy";
}

function CountryMarker({
  countryIso,
  onClick,
  type = "normal",
}: CountryMarkerProps) {
  const { getCountryByIso } = useCountries();
  const country = getCountryByIso(countryIso);
  if (!country) {
    return null;
  }
  const { latitude, longitude } = getCoords(country);
  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(country);
      }}
    >
      {type === "fancy" ? (
        <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
          <img
            alt={country.name}
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.iso_3166_1}.svg`}
            className="h-[20px] w-[30px] border-white border-1 rounded-sm"
          />
          <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded-lg">
            {country.iso_3166_1}
          </span>
        </div>
      ) : (
        <div className="px-2 py-[1/2] rounded-sm bg-black/50 text-white font-semibold">
          {countryIso}
        </div>
      )}
    </Marker>
  );
}

export default CountryMarker;
