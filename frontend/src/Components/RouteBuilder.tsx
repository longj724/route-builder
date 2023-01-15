// External Dependencies
import { useEffect, useState } from 'react';
import Map, {
  GeolocateControl,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

// Relative Dependencies
import Route from './Route';
import Points, { Point } from './Points';
import { calculateElevationGainAndLoss, formatPoints } from '../utils/utils';
import { useRoute, RouteType } from '../Context/RouteProvider';

// Types
declare global {
  interface Window {
    MapboxDirections: any;
  }
}

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

function RouteBuilder() {
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

  const { route, setSelectedPoints, updateRoute } = useRoute();
  const { selectedPoints } = route;

  useEffect(() => {
    localStorage.removeItem('routes');
  }, []);

  const createRoute = async (point: Point) => {
    let newPoints = [...selectedPoints, point];

    if (newPoints.length > 1) {
      const formattedPoints = formatPoints(newPoints);

      axios
        .get(
          `https://api.geoapify.com/v1/routing?waypoints=${formattedPoints}&mode=walk&details=elevation&units=imperial&apiKey=${GEOAPIFY_KEY}`
        )
        .then(({ data }) => {
          console.log('data is', data);
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
          const cachedRoute = JSON.parse(
            localStorage.getItem('routes') as string
          );
          cachedRoute.push(newRoute);
          const asJSON = JSON.stringify(cachedRoute);
          localStorage.setItem('routes', asJSON);

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

  const onMove = (event: ViewStateChangeEvent) => {
    setViewState(event.viewState);
  };

  const onClickMap = (event: MapLayerMouseEvent) => {
    const { lat, lng } = event.lngLat;
    const point = {
      lat,
      lng,
    };
    createRoute(point);
  };

  return (
    <Map
      {...viewState}
      onMove={onMove}
      onClick={onClickMap}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={ACCESS_TOKEN}
    >
      <Points />
      <Route />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
      />
    </Map>
  );
}

export default RouteBuilder;
