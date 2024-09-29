import useCountries from '@/hooks/useCountries';
import { Country } from '@/lib/countries';
import { correctCountriesAtom, errorCountriesAtom } from '@/state';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { Marker, Popup } from 'react-map-gl';

function PlayedCountryMarkers(): JSX.Element {
  const playedCountries = useAtomValue(correctCountriesAtom);
  const errorCountries = useAtomValue(errorCountriesAtom);
  const { countries } = useCountries();
  const [popupInfo, setPopupInfo] = useState<Country | null>(null);

  const getCoords = (country: Country) => {
    const latitude = (country.bbox[1] + country.bbox[3]) / 2;
    const longitude = (country.bbox[0] + country.bbox[2]) / 2;
    return { latitude, longitude };
  };

  const markers = useMemo(() => {
    const pinCountries = [...playedCountries, ...errorCountries];

    return pinCountries.map((countryIso) => {
      const country = countries[countryIso];
      if (!country) {
        return null;
      }
      const { latitude, longitude } = getCoords(country);
      return (
        <Marker
          key={country.iso_3166_1}
          latitude={latitude}
          longitude={longitude}
          anchor='bottom'
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(country);
          }}
        >
          <span className='absolute top-0 left-0 text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded-lg'>
            {country.iso_3166_1}
          </span>
        </Marker>
      );
    });
  }, [countries, playedCountries, errorCountries]);

  return (
    <>
      {markers}
      {popupInfo && (
        <Popup
          latitude={getCoords(popupInfo).latitude}
          longitude={getCoords(popupInfo).longitude}
          onClose={() => setPopupInfo(null)}
        >
          <p>{popupInfo.name}</p>
          <p>{popupInfo.iso_3166_1}</p>
          <p>{popupInfo.region}</p>
        </Popup>
      )}
    </>
  );
}

export default PlayedCountryMarkers;
