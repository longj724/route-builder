// External Dependencies
import { useEffect, useState } from 'react';
import Map, { MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

// Relative Dependencies
import Route from './Route';
import Points, { Point } from './Points';
import { calculateElevationGainAndLoss, formatPoints } from '../Utils/utils';
import { useRoute, RouteType } from '../Context/RouteProvider';
import { useCreateRoute } from '../Hooks/useCreateRoute';

// Types
declare global {
  interface Window {
    MapboxDirections: any;
  }
}

type RouteBuilderProps = {
  mapCenter: Point;
  lastSelectedPoint: Point | null;
  setLastSelectedPoint: React.Dispatch<React.SetStateAction<Point | null>>;
};

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

function RouteBuilder(props: RouteBuilderProps) {
  const { mapCenter, lastSelectedPoint, setLastSelectedPoint } = props;
  const [viewState, setViewState] = useState({
    longitude: mapCenter.lng,
    latitude: mapCenter.lat,
    zoom: 14,
  });

  const { route, updateRoute } = useRoute();
  const { refetch } = useCreateRoute(lastSelectedPoint);

  useEffect(() => {
    setViewState({
      longitude: mapCenter.lng,
      latitude: mapCenter.lat,
      zoom: 15,
    });
  }, [mapCenter]);

  useEffect(() => {
    localStorage.removeItem('selectedPoints');
  }, []);

  const createRoute = async (point: Point) => {
    setLastSelectedPoint(point);
    if (route.selectedPoints.length === 0) {
      console.log('here');
      const newRoute: RouteType = {
        distance: 0,
        coordinates: [],
        selectedPoints: [point],
        elevationPoints: [],
        elevationGainAndLoss: {
          gain: 0,
          loss: 0,
        },
      };
      const asJSON = JSON.stringify([point]);
      localStorage.setItem('selectedPoints', asJSON);
      updateRoute(newRoute);
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
    </Map>
  );
}

export default RouteBuilder;
