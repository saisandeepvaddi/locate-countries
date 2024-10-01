import useCountries from '@/hooks/useCountries';
import { Country } from '@/lib/countries';
import { correctCountriesAtom, errorCountriesAtom } from '@/state';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { Marker, Popup } from 'react-map-gl';

function PlayedCountryMarkers() {
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
          <div className='flex items-center gap-2 p-2 bg-white/50 rounded-lg'>
            <img
              alt={country.name}
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.iso_3166_1}.svg`}
              className='h-[20px] w-[30px] border-white border-1 rounded-sm'
            />
            <span className='text-xs font-bold bg-black text-white px-2 py-1 rounded-lg'>
              {country.iso_3166_1}
            </span>
          </div>
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
          className='p-2 rounded-lg'
        >
          <p className='text-lg flex gap-1 items-center'>
            <img
              alt={popupInfo.name}
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${popupInfo.iso_3166_1}.svg`}
              className='h-[20px] w-[30px] border-white border-1 rounded-sm'
            />
            <span className='font-bold'>{popupInfo.name}</span>
            <span className='text-sm text-slate-400'>
              ({popupInfo.iso_3166_1})
            </span>
          </p>
          <p className='mt-2'>
            <a
              href={`https://simple.wikipedia.org/wiki/${popupInfo.name}`}
              target='_blank'
              className='text-sm text-blue-600 underline'
            >
              Wikipedia
            </a>
          </p>
        </Popup>
      )}
    </>
  );
}

export default PlayedCountryMarkers;
