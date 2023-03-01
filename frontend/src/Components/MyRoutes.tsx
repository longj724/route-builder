// External Dependencies
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  ButtonGroup,
  CardFooter,
  Divider,
  Button,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore/lite';

// Relative Dependencies
import { auth } from '../Firebase';
import { getAllRoutes } from '../Utils/dbOperations';
import { useRoute, RouteType } from '../Context/RouteProvider';

function MyRoutes() {
  const [userRoutes, setUserRoutes] = useState<DocumentData[] | null>(null);
  const { updateRoute } = useRoute();

  const loadRoutes = useCallback(async () => {
    const routes = await getAllRoutes();
    setUserRoutes(routes);
  }, [setUserRoutes]);

  useEffect(() => {
    if (auth.currentUser) {
      loadRoutes();
    }
  }, [loadRoutes]);

  const selectRoute = (route: DocumentData) => {
    const coordinates = route.coordinates.map(
      (coord: { lat: number; lng: number }) => [coord.lng, coord.lat]
    );

    const routeData: RouteType = {
      distance: route.distance,
      elevationGainAndLoss: {
        gain: route.elevationData.gain,
        loss: route.elevationData.loss,
      },
      elevationPoints: route.elevationPoints,
      coordinates,
      selectedPoints: route.selectedPoints,
    };
    updateRoute(routeData);
  };

  const userRouteComponents = userRoutes?.map((route) => (
    <Card maxW="sm" key={route.id}>
      <CardBody>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{route.name}</Heading>
          <Heading size="sm">Distance: {route.distance} miles</Heading>
          <Heading size="sm">
            Elevation Gain: {route.elevationData.gain} ft, Elevation Loss:{' '}
            {route.elevationData.loss}
          </Heading>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => selectRoute(route)}
          >
            View
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Delete
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  ));

  return <>{userRouteComponents}</>;
}

export default MyRoutes;
