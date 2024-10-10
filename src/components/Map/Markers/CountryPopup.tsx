import { CountryPopupInfo } from '@/lib/types';
import { getCoords } from '@/lib/utils';
import { Popup } from 'react-map-gl';

interface CountryPopupProps {
  popup: CountryPopupInfo;
  onClose: () => void;
}

function CountryPopup({ popup, onClose }: CountryPopupProps) {
  const { latitude, longitude } = getCoords(popup.country);
  const _latitude = popup.latitude ?? latitude;
  const _longitude = popup.longitude ?? longitude;

  return (
    <Popup
      latitude={_latitude}
      longitude={_longitude}
      onClose={onClose}
      className='p-2 rounded-lg'
      closeOnClick={false}
      closeButton
      anchor='bottom'
      style={{
        maxWidth: '200px',
      }}
    >
      <p className='text-lg flex gap-1 items-center'>
        <img
          alt={popup.country.name}
          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${popup.country.iso_3166_1}.svg`}
          className='h-[20px] w-[30px] border-white border-1 rounded-sm'
        />
        <span className='font-bold'>{popup.country.name}</span>
        <span className='text-sm text-slate-400'>
          ({popup.country.iso_3166_1})
        </span>
      </p>
      <p className='mt-2'>
        <a
          href={`https://simple.wikipedia.org/wiki/${popup.country.name}`}
          target='_blank'
          className='text-sm text-blue-600 underline'
        >
          Wikipedia
        </a>
      </p>
    </Popup>
  );
}

export default CountryPopup;
