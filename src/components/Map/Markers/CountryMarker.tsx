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
        <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2">
          <img
            alt={country.name}
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.iso_3166_1}.svg`}
            className="border-1 h-[20px] w-[30px] rounded-sm border-white"
          />
          <span className="rounded-lg bg-black px-2 py-1 text-xs font-bold text-white">
            {country.iso_3166_1}
          </span>
        </div>
      ) : (
        <div className="rounded-sm bg-black/50 px-2 py-[1/2] font-semibold text-white">
          {countryIso}
        </div>
      )}
    </Marker>
  );
}

export default CountryMarker;
