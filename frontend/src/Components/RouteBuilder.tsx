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
import { formatPoints } from '../utils/utils';
import { useRoute, RouteType } from '../Context/RouteProvider';

// Types
declare global {
  interface Window {
    MapboxDirections: any;
  }
}

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function RouteBuilder() {
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

  const { route, setSelectedPoints, updateRoute } = useRoute();
  const { selectedPoints } = route;

  // const [points, setPoints] = useState<Point[] | []>([]);
  // const [curRouteCoordinates, setCurRouteCoordinates] = useState<Position[]>(
  //   []
  // );
  // const [curRouteDistance, setCurRouteDistance] = useState<number | undefined>(
  //   undefined
  // );

  useEffect(() => {
    localStorage.removeItem('routes');
  }, []);

  const createRoute = (points: Point[]) => {
    if (points.length > 1) {
      const formattedPoints = formatPoints(points);

      axios
        .get(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${formattedPoints}?geometries=geojson&access_token=${ACCESS_TOKEN}`
        )
        .then((res) => {
          console.log('res is', res);
          const { coordinates } = res.data.routes[0].geometry;
          const { distance } = res.data.routes[0];

          const distanceInMiles = distance * 0.000621371192;
          const roundedDistance = Math.round(distanceInMiles * 100) / 100;

          const newRoute: RouteType = {
            distance: roundedDistance,
            coordinates: coordinates,
            selectedPoints: points,
            elevation: route.elevation,
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
        selectedPoints: points,
        elevation: 0,
      };

      const asJSON = JSON.stringify([newRoute]);
      localStorage.setItem('routes', asJSON);
      setSelectedPoints(points);
    }
  };

  const onMove = (event: ViewStateChangeEvent) => {
    setViewState(event.viewState);
  };

  const onClick = (event: MapLayerMouseEvent) => {
    console.log('event is', event);
    const { lat, lng } = event.lngLat;
    const point = {
      lat,
      lng,
    };
    const newPoints = [...selectedPoints, point];
    createRoute(newPoints);
  };

  return (
    <Map
      {...viewState}
      onMove={onMove}
      onClick={onClick}
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
