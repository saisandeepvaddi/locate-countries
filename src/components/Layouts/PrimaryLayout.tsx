import { MapProvider } from 'react-map-gl';
import { GameStateTopBanner } from '../Game/GameStateTopBanner';
import { MapContainer } from '../Map/MapContainer';

function PrimaryLayout() {
  return (
    <MapProvider>
      <GameStateTopBanner />
      <MapContainer />
      {/* <TestMapContainer /> */}
    </MapProvider>
  );
}

export default PrimaryLayout;
