// External Dependencies
import { ReactElement } from 'react';
import { Marker } from 'react-map-gl';

// Relative Dependencies
import { useRoute } from '../Context/RouteProvider';

// Types
export type Point = {
  lat: number;
  lng: number;
};

function Points(): ReactElement {
  const { selectedPoints } = useRoute().route;

  return (
    <>
      {selectedPoints.map(({ lat, lng }) => (
        <Marker latitude={lat} longitude={lng} anchor="bottom" />
      ))}
    </>
  );
}

export default Points;
