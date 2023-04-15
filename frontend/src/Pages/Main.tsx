// External Dependencies
import { useEffect, useState, useRef } from 'react';
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
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { AddressAutofill } from '@mapbox/search-js-react';
import {
  FaBicycle,
  FaMountain,
  FaRunning,
  FaSave,
  FaUndo,
} from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import { onAuthStateChanged } from 'firebase/auth';
import { MapRef } from 'react-map-gl';

// Relative Dependencies
import RouteBuilder from '../Components/RouteBuilder';
import MyRoutes from '../Components/MyRoutes';
import RouteNameModal from '../Components/RouteNameModal';
import LoginModal from '../Components/LoginModal';
import ElevationProfile from '../Components/ElevationProfile';
import { useRoute, RouteType, MapViewInfo } from '../Context/RouteProvider';
import { auth, signOutOfProfile } from '../Firebase';
import { createOrUpdateRoute, uploadRouteImage } from '../Utils/dbOperations';
import { ActivityType } from '../Utils/utils';
import { useCreateRoute } from '../Hooks/useCreateRoute';
import { useScreenshot } from '../Hooks/useScreenshot';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string;

function Main() {
  const [showElevationProfile, setShowElevationProfile] = useState(false);
  const [showRoutesPanel, setShowRoutesPanel] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [selectedRouteID, setSelectedRouteID] = useState('');
  const [routeName, setRouteName] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('RUNNING');

  const spinnerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef>(null!);
  const [, takeScreenShot] = useScreenshot();
  const toast = useToast();
  const { createRouteWithoutLastPoint } = useCreateRoute(activityType);
  const { route, updateRoute, setMapViewInfo } = useRoute();
  const {
    isOpen: isOpenLoginModal,
    onOpen: onOpenLoginModal,
    onClose: onCloseLoginModal,
  } = useDisclosure();
  const {
    isOpen: isOpenNameModal,
    onOpen: onOpenNameModal,
    onClose: onCloseNameModal,
  } = useDisclosure();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const moveMapToBrowserLocation = () => {
    if (spinnerRef?.current) {
      spinnerRef.current.style.display = 'inherit';
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const newMapViewInfo: MapViewInfo = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          zoom: 15,
        };
        setMapViewInfo(newMapViewInfo);
        if (spinnerRef?.current) {
          spinnerRef.current.style.display = 'none';
        }
      });
    }
  };

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
      mapViewInfo: route.mapViewInfo,
    };
    localStorage.removeItem('routes');
    updateRoute(emptyRoute);
  };

  const removeLastPoint = () => {
    // Check if route is cached
    if (localStorage.getItem('routes')) {
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
        mapViewInfo: route.mapViewInfo,
      };

      updateRoute(newRoute);
    } else {
      createRouteWithoutLastPoint();
    }
  };

  const toggleElevationProfile = () => {
    setShowElevationProfile(!showElevationProfile);
  };

  const selectAddress = (event: any) => {
    const { coordinates } = event.features[0].geometry;

    const newMapViewInfo: MapViewInfo = {
      latitude: coordinates[1],
      longitude: coordinates[0],
      zoom: 15,
    };
    setMapViewInfo(newMapViewInfo);
  };

  const logout = async () => {
    const signOutSuccessful: boolean = await signOutOfProfile();
    if (signOutSuccessful) {
      if (showRoutesPanel) setShowRoutesPanel(false);
      setUser(null);
    }
  };

  const saveRoute = async () => {
    // Have to do this to fix weird TypeScript error
    if (typeof takeScreenShot === 'function') {
      const base64Image = await takeScreenShot(mapRef.current.getCanvas());
      const { imageURL, imagePath } = await uploadRouteImage(
        base64Image as string
      );
      const response = await createOrUpdateRoute(
        routeName,
        route,
        imagePath,
        imageURL,
        selectedRouteID
      );
      if (response) {
        toast({
          title: 'Route Saved',
          status: 'success',
          duration: 2000,
          position: 'bottom-left',
        });
      }
      onCloseNameModal();
    } else {
      toast({
        title: 'Error Saving Route',
        status: 'error',
        duration: 2000,
        position: 'bottom-left',
      });
    }
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
            <Button variant="solid" size="sm" onClick={onOpenLoginModal}>
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
                  <MenuGroup
                    title={`Profile - ${auth?.currentUser?.displayName}`}
                  >
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
        <LoginModal
          onClose={onCloseLoginModal}
          isOpen={isOpenLoginModal}
          setUser={setUser}
        />
        <RouteNameModal
          isOpen={isOpenNameModal}
          onClose={onCloseNameModal}
          routeName={routeName}
          saveRoute={saveRoute}
          setRouteName={setRouteName}
        />
      </Flex>
      <Flex height={showElevationProfile ? '65%' : '100%'} width="100%">
        <Box width="100%" position="relative">
          <RouteBuilder ref={mapRef} activityType={activityType} />
          <Flex
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            top="0"
            width="100%"
          >
            <Flex gap={3}>
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
              <Tooltip label="Get Current Location">
                <IconButton
                  aria-label="icon"
                  icon={<BiCurrentLocation />}
                  size="sm"
                  colorScheme="blue"
                  onClick={moveMapToBrowserLocation}
                />
              </Tooltip>
              <Flex
                alignItems="center"
                backgroundColor="blue.500"
                borderRadius="5px"
                display="none"
                padding={1}
                ref={spinnerRef}
              >
                <Spinner color="white" />
              </Flex>
            </Flex>
            <Flex
              justifyContent="center"
              alignItems="space-between"
              gap="8px"
              mr={2}
              mt="10px"
            >
              <Tooltip label="Activity - Running">
                <IconButton
                  aria-label="icon"
                  icon={<FaRunning />}
                  size="md"
                  onClick={() => setActivityType('RUNNING')}
                  colorScheme={
                    activityType === 'RUNNING' ? 'blue' : 'blackAlpha'
                  }
                />
              </Tooltip>
              <Tooltip label="Activity - Biking">
                <IconButton
                  aria-label="icon"
                  icon={<FaBicycle />}
                  size="md"
                  onClick={() => setActivityType('CYCLING')}
                  colorScheme={
                    activityType === 'CYCLING' ? 'blue' : 'blackAlpha'
                  }
                />
              </Tooltip>
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
                    onClick={onOpenNameModal}
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
              <Heading size="xl" textAlign="center" marginLeft="auto" mt={1.5}>
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
              <MyRoutes
                clearRoute={clearRoute}
                setSelectedRouteID={setSelectedRouteID}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
      {showElevationProfile && <ElevationProfile />}
    </Flex>
  );
}

export default Main;
