// External Dependencies
import React, { ReactElement, useRef } from 'react';
import { Marker } from 'react-map-gl';
import { Box, Button } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Relative Dependencies
import { useRoute } from '../Context/RouteProvider';

// Types
export type Point = {
  lat: number;
  lng: number;
};

interface Refs {
  [key: number]: HTMLButtonElement;
}

function Points(): ReactElement {
  const { selectedPoints } = useRoute().route;

  const markerRefs = useRef<Refs | null>({});

  const handleMarkerRefs = (index: number) => (ref: HTMLButtonElement) => {
    if (markerRefs.current) {
      markerRefs.current[index] = ref;
    }
  };

  const getMarkerColor = (index: number) => {
    if (index === 0) {
      return '#38A169';
    } else {
      return '#E53E3E';
    }
  };

  const displayGoogleMapsButton = (buttonIndex: number) => {
    if (markerRefs.current) {
      markerRefs.current[buttonIndex].style.display = 'initial';
    }
  };

  const hideGoogleMapsButton = (buttonIndex: number) => {
    if (markerRefs.current) {
      markerRefs.current[buttonIndex].style.display = 'none';
    }
  };

  const handleGoogleMapButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    lat: number,
    lng: number
  ) => {
    event.stopPropagation();
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      '_blank'
    );
  };

  return (
    <>
      {selectedPoints.map(({ lat, lng }, index) => (
        <Marker
          latitude={lat}
          longitude={lng}
          anchor="bottom"
          key={`${lat}+${lng}`}
        >
          <Box
            width="100px"
            height="100px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="end"
            gap={2}
            onMouseEnter={() => displayGoogleMapsButton(index)}
            onMouseLeave={() => hideGoogleMapsButton(index)}
          >
            <Button
              onClick={(event) => handleGoogleMapButtonClick(event, lat, lng)}
              colorScheme="blue"
              ref={handleMarkerRefs(index)}
              display="none"
            >
              View in Google Maps
            </Button>
            <FaMapMarkerAlt size={36} color={getMarkerColor(index)} />
          </Box>
        </Marker>
      ))}
    </>
  );
}

export default Points;
