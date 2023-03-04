// External Dependencies
import axios from 'axios';
import { useQuery } from 'react-query';

// Relative Dependencies
import { RouteType, useRoute } from '../Context/RouteProvider';
import { Point } from '../Components/Points';
import { calculateElevationGainAndLoss, formatPoints } from '../Utils/utils';

const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

export const useCreateRoute = (newPoint: Point | null) => {
  const { route, updateRoute } = useRoute();

  let newPoints: Point[] = [];

  if (newPoint === null) {
    newPoints = route.selectedPoints;
  } else if (
    route.selectedPoints.length === 1 &&
    route.selectedPoints[0].lat === newPoint?.lat &&
    route.selectedPoints[0].lng === newPoint?.lng
  ) {
    console.log('in second branch');
    newPoints = route.selectedPoints;
  } else {
    console.log('in third branch');
    newPoints = [...route.selectedPoints, newPoint];
  }

  return useQuery(
    ['create-route', newPoints],
    () => {
      const formattedPoints = formatPoints(newPoints);

      console.log('formatted points are', formattedPoints);

      axios
        .get(
          `https://api.geoapify.com/v1/routing?waypoints=${formattedPoints}&mode=walk&details=elevation&units=imperial&apiKey=${GEOAPIFY_KEY}`
        )
        .then(({ data }) => {
          console.log('data from the call is', data);
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

          const newPoints = route.selectedPoints;

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
          // console.log('setting the local storage');
          // const cachedRoute = JSON.parse(
          //   localStorage.getItem('selectedPoints') as string
          // );
          // cachedRoute.push(newPoint);
          // const asJSON = JSON.stringify(cachedRoute);
          // localStorage.setItem('selectedPoints', asJSON);

          updateRoute(newRoute);
        });
    },
    {
      enabled: newPoints.length > 1,
    }
  );
};
