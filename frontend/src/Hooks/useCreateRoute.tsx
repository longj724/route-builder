// External Dependencies
import axios from 'axios';

// Relative Dependencies
import { useRoute, RouteType } from '../Context/RouteProvider';
import { Point } from '../Components/Points';
import { calculateElevationGainAndLoss, formatPoints } from '../Utils/utils';

const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

export const useCreateRoute = (): {
  createRouteWithNewPoint: (newPoint: Point) => void;
  createRouteWithoutLastPoint: () => void;
} => {
  const { route, updateRoute, setSelectedPoints } = useRoute();
  const { selectedPoints } = route;

  const createRoute = async (newPoints: Point[]) => {
    // let newPoints = [...selectedPoints, point];

    if (newPoints.length > 1) {
      const formattedPoints = formatPoints(newPoints);

      axios
        .get(
          `https://api.geoapify.com/v1/routing?waypoints=${formattedPoints}&mode=walk&details=elevation&units=imperial&apiKey=${GEOAPIFY_KEY}`
        )
        .then(({ data }) => {
          let { coordinates } = data.features[0].geometry;
          const { distance } = data.features[0].properties;
          let { legs } = data.features[0].properties;

          let elevationPoints: number[] = [];
          legs.forEach((leg: any) => {
            elevationPoints.push(leg.elevation);
          });

          // Flatten arrays
          coordinates = coordinates.flat(1);
          elevationPoints = elevationPoints.flat(1);

          // Convert elevation points to ft
          elevationPoints = elevationPoints.map(
            (point: number) => point * 3.28084
          );
          const elevationGainAndLoss =
            calculateElevationGainAndLoss(elevationPoints);
          const roundedDistance = Math.round(distance * 100) / 100;

          // Update first and last point
          const newFirstPoint: Point = {
            lat: coordinates[0][1],
            lng: coordinates[0][0],
          };

          const newLastPoint: Point = {
            lat: coordinates[coordinates.length - 1][1],
            lng: coordinates[coordinates.length - 1][0],
          };

          newPoints[0] = newFirstPoint;
          newPoints[newPoints.length - 1] = newLastPoint;

          const newRoute: RouteType = {
            distance: roundedDistance,
            coordinates: coordinates,
            selectedPoints: newPoints,
            elevationPoints,
            elevationGainAndLoss,
          };

          // Update local storage cache
          if (localStorage.getItem('routes')) {
            const cachedRoute = JSON.parse(
              localStorage.getItem('routes') as string
            );
            cachedRoute.push(newRoute);
            const asJSON = JSON.stringify(cachedRoute);
            localStorage.setItem('routes', asJSON);
          }

          updateRoute(newRoute);
        });
    } else {
      const newRoute: RouteType = {
        distance: 0,
        coordinates: [],
        selectedPoints: newPoints,
        elevationPoints: [],
        elevationGainAndLoss: {
          gain: 0,
          loss: 0,
        },
      };

      const asJSON = JSON.stringify([newRoute]);
      localStorage.setItem('routes', asJSON);
      setSelectedPoints(newPoints);
    }
  };

  const createRouteWithNewPoint = (newPoint: Point) => {
    const newPoints = [...selectedPoints, newPoint];
    createRoute(newPoints);
  };

  const createRouteWithoutLastPoint = () => {
    const newPoints = selectedPoints;
    newPoints.pop();
    createRoute(newPoints);
  };

  return {
    createRouteWithNewPoint: createRouteWithNewPoint,
    createRouteWithoutLastPoint: createRouteWithoutLastPoint,
  };
};
