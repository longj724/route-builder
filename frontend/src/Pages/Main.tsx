// External Dependencies
import { useState } from 'react';
import {
  Box,
  Flex,
  Input,
  IconButton,
  Button,
  Heading,
} from '@chakra-ui/react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { FaMountain } from 'react-icons/fa';
import { FaUndo } from 'react-icons/fa';

// Relative Dependencies
import RouteBuilder from '../Components/RouteBuilder';
import { useRoute, RouteType } from '../Context/RouteProvider';
import ElevationProfile from '../Components/ElevationProfile';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string;

function Main() {
  const [showElevationProfile, setShowElevationProfile] = useState(false);
  const { route, updateRoute } = useRoute();

  const getPrevRoute = () => {
    const routes = JSON.parse(localStorage.getItem('routes') as string);
    routes.pop();
    const asJSON = JSON.stringify(routes);
    localStorage.setItem('routes', asJSON);
    const prevRoute = routes[routes.length - 1];
    return prevRoute;
  };

  const clearRoute = () => {
    const emptyRoute: RouteType = {
      coordinates: [],
      distance: 0,
      elevation: 0,
      selectedPoints: [],
    };
    localStorage.removeItem('routes');
    updateRoute(emptyRoute);
  };

  const removeLastPoint = () => {
    const prevRoute = getPrevRoute();

    const newRoute: RouteType = {
      coordinates: prevRoute?.coordinates ?? [],
      distance: prevRoute?.distance ?? 0,
      elevation: prevRoute?.elevation ?? 0,
      selectedPoints: prevRoute?.selectedPoints ?? [],
    };

    updateRoute(newRoute);
  };

  const toggleElevationProfile = () => {
    setShowElevationProfile(!showElevationProfile);
  };

  return (
    <Flex width="100vw" height="100vh" direction="column">
      <Flex
        height="70px"
        alignItems="center"
        justifyContent="flex-end"
        backgroundColor="#112336"
      >
        <Flex gap="8px" mr="10px">
          <Button variant="solid" size="md">
            Login
          </Button>
          <Button variant="solid" size="md">
            Sign Up
          </Button>
        </Flex>
      </Flex>
      <Flex
        height={showElevationProfile ? '65%' : '100%'}
        width="100%"
        // direction="column"
      >
        <Box width="100%" position="relative">
          <RouteBuilder />
          <Flex
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            top="0"
            width="100%"
          >
            <AddressAutofill accessToken={ACCESS_TOKEN}>
              <Input
                height="30px"
                color="black"
                backgroundColor="white"
                ml={2}
                placeholder="Search for address"
                // autoComplete="street-address"
                type="text"
                name="address"
              />
            </AddressAutofill>
            <Flex
              justifyContent="center"
              alignItems="space-between"
              gap="8px"
              mr="50px"
              mt="10px"
            >
              <IconButton
                aria-label="icon"
                icon={<FaUndo />}
                size="md"
                onClick={removeLastPoint}
                disabled={route.selectedPoints.length < 1}
              />
              <Button variant="solid" size="md" onClick={clearRoute}>
                Clear Route
              </Button>
            </Flex>
          </Flex>
          <Box
            display="flex"
            gap="8px"
            pos="absolute"
            bottom={10}
            backgroundColor="white"
            padding="10px"
            left={2}
            borderRadius="5px"
          >
            <Heading>{route.distance} miles</Heading>
          </Box>
          <Flex
            pos="absolute"
            bottom={10}
            backgroundColor="white"
            right={2}
            borderRadius="5px"
          >
            <Flex
              direction="column"
              padding={2}
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              _hover={{ background: 'gray.200' }}
              borderBottomLeftRadius="5px"
              borderTopLeftRadius="5px"
              onClick={toggleElevationProfile}
            >
              <FaMountain />
              <Heading size="xs">View</Heading>
              <Heading size="xs">Elevation</Heading>
            </Flex>
            <Flex direction="column" padding={2}>
              <Heading size="md">50 ft gain</Heading>
              <Heading size="md">50 ft loss</Heading>
            </Flex>
          </Flex>
        </Box>
        {/* <Flex width="25%" flexDirection="column">
          <Heading size="xl" textAlign="center">
            My Routes
          </Heading>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          ></Flex>
        </Flex> */}
      </Flex>
      {showElevationProfile && <ElevationProfile />}
    </Flex>
  );
}

export default Main;
