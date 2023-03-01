// External Dependencies
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  CloseButton,
  Flex,
  Input,
  IconButton,
  Button,
  Heading,
  Tooltip,
  useDisclosure,
  MenuList,
  MenuButton,
  MenuItem,
  Menu,
  MenuGroup,
  calc,
} from '@chakra-ui/react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { FaMountain, FaUndo, FaSave } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';

// Relative Dependencies
import RouteBuilder from '../Components/RouteBuilder';
import { useRoute, RouteType } from '../Context/RouteProvider';
import ElevationProfile from '../Components/ElevationProfile';
import { Point } from '../Components/Points';
import LoginModal from '../Components/LoginModal';
import { auth, signOutOfProfile } from '../Firebase';
import MyRoutes from '../Components/MyRoutes';
import { createOrUpdateRoute } from '../Utils/dbOperations';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string;

function Main() {
  const [mapCenter, setMapCenter] = useState<Point>({
    lat: 40.712776,
    lng: -74.005974,
  });
  const [showElevationProfile, setShowElevationProfile] = useState(false);
  const [showRoutesPanel, setShowRoutesPanel] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [selectedRouteID, setSelectedRouteID] = useState('');

  const { route, updateRoute } = useRoute();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

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
      elevationPoints: [],
      selectedPoints: [],
      elevationGainAndLoss: {
        gain: 0,
        loss: 0,
      },
    };
    localStorage.removeItem('routes');
    updateRoute(emptyRoute);
  };

  const removeLastPoint = () => {
    const prevRoute = getPrevRoute();

    const newRoute: RouteType = {
      coordinates: prevRoute?.coordinates ?? [],
      distance: prevRoute?.distance ?? 0,
      elevationPoints: prevRoute?.elevation ?? [],
      selectedPoints: prevRoute?.selectedPoints ?? [],
      elevationGainAndLoss: prevRoute?.elevationGainAndLoss ?? {
        gain: 0,
        loss: 0,
      },
    };

    updateRoute(newRoute);
  };

  const toggleElevationProfile = () => {
    setShowElevationProfile(!showElevationProfile);
  };

  const selectAddress = (event: any) => {
    const { coordinates } = event.features[0].geometry;

    const newMapCenter: Point = {
      lat: coordinates[1],
      lng: coordinates[0],
    };
    setMapCenter(newMapCenter);
  };

  console.log('auth is', auth);

  const logout = async () => {
    const signOutSuccessful = await signOutOfProfile();
    if (signOutSuccessful) {
      if (showRoutesPanel) setShowRoutesPanel(false);
      setUser(null);
    }
  };

  const saveRoute = async () => {
    await createOrUpdateRoute('sample route name', route, '');
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
          {user === null ? (
            <Button variant="solid" size="sm" onClick={onOpen}>
              Login
            </Button>
          ) : (
            <Flex gap={3} alignItems="center">
              <Button variant="solid" size="sm" onClick={logout}>
                Logout
              </Button>
              <Menu>
                <MenuButton
                  as={Avatar}
                  colorScheme="pink"
                  _hover={{ cursor: 'pointer' }}
                  height="40px"
                  width="40px"
                />
                <MenuList>
                  <MenuGroup title="Profile">
                    <MenuItem
                      onClick={() => setShowRoutesPanel(!showRoutesPanel)}
                    >
                      My Routes
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>
        <LoginModal onClose={onClose} isOpen={isOpen} setUser={setUser} />
      </Flex>
      <Flex height={showElevationProfile ? '65%' : '100%'} width="100%">
        <Box width="100%" position="relative">
          <RouteBuilder mapCenter={mapCenter} />
          <Flex
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            top="0"
            width="100%"
          >
            <AddressAutofill
              accessToken={ACCESS_TOKEN}
              browserAutofillEnabled={false}
              onRetrieve={selectAddress}
            >
              <Input
                height="30px"
                color="black"
                backgroundColor="white"
                ml={2}
                placeholder="Search for address"
                type="text"
                name="address"
              />
            </AddressAutofill>
            <Flex
              justifyContent="center"
              alignItems="space-between"
              gap="8px"
              mr={2}
              mt="10px"
            >
              <Tooltip label="Remove last point">
                <IconButton
                  aria-label="icon"
                  icon={<FaUndo />}
                  size="md"
                  onClick={removeLastPoint}
                  disabled={route.selectedPoints.length < 1}
                  colorScheme="blue"
                />
              </Tooltip>
              {user !== null && (
                <Tooltip label="Save Route">
                  <IconButton
                    aria-label="icon"
                    colorScheme="blue"
                    disabled={route.selectedPoints.length < 1}
                    icon={<FaSave />}
                    onClick={saveRoute}
                    size="md"
                  />
                </Tooltip>
              )}

              <Button
                variant="solid"
                size="md"
                onClick={clearRoute}
                colorScheme="blue"
              >
                Clear Route
              </Button>
              {user !== null && (
                <Button
                  variant="solid"
                  size="md"
                  colorScheme="blue"
                  onClick={() => setShowRoutesPanel(!showRoutesPanel)}
                >
                  My Routes
                </Button>
              )}
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
            <Tooltip label="View Elevation Profile" placement="top">
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
            </Tooltip>

            <Flex direction="column" padding={2}>
              <Heading size="md">
                {route.elevationGainAndLoss.gain} ft of gain
              </Heading>
              <Heading size="md">
                {route.elevationGainAndLoss.loss} ft of loss
              </Heading>
            </Flex>
          </Flex>
        </Box>
        {showRoutesPanel && (
          <Flex
            width="25%"
            minWidth="300px"
            flexDirection="column"
            overflow="scroll"
            height="calc(100vh - 70px)"
          >
            <Flex justifyContent="center">
              <Heading size="xl" textAlign="center" marginLeft="auto">
                My Routes
              </Heading>
              <CloseButton
                aria-label="icon"
                onClick={() => setShowRoutesPanel(false)}
                alignSelf="center"
                marginLeft="auto"
                marginRight={2}
                size="sm"
              />
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <MyRoutes />
            </Flex>
          </Flex>
        )}
      </Flex>
      {showElevationProfile && <ElevationProfile />}
    </Flex>
  );
}

export default Main;
