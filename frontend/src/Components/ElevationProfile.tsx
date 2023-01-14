// External Dependencies
import { useRef } from 'react';
import { Flex } from '@chakra-ui/react';

// Relative Dependencies
import LineChart from './LineChart';

function ElevationProfile() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Flex width="100%" height="35%" ref={containerRef} alignItems="center">
      <LineChart containerRef={containerRef} />
    </Flex>
  );
}

export default ElevationProfile;
