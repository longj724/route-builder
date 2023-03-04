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

  const getMarkerColor = (index: number) => {
    if (index === 0) {
      return '#38A169';
    } else {
      return '#E53E3E';
    }
  };

  return (
    <>
      {selectedPoints.map(({ lat, lng }, index) => (
        <Marker
          color={getMarkerColor(index)}
          latitude={lat}
          longitude={lng}
          anchor="center"
          key={lat.toString() + lng.toString()}
        />
      ))}
    </>
  );
}

export default Points;
