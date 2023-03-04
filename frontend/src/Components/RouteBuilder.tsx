// External Dependencies
import { useEffect, useState } from 'react';
import Map, { MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Relative Dependencies
import Route from './Route';
import Points, { Point } from './Points';
import { useCreateRoute } from '../Hooks/useCreateRoute';

// Types
declare global {
  interface Window {
    MapboxDirections: any;
  }
}

type RouteBuilderProps = {
  mapCenter: Point;
};

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function RouteBuilder(props: RouteBuilderProps) {
  const { mapCenter } = props;
  const [viewState, setViewState] = useState({
    longitude: mapCenter.lng,
    latitude: mapCenter.lat,
    zoom: 14,
  });

  const { createRouteWithNewPoint } = useCreateRoute();

  useEffect(() => {
    setViewState({
      longitude: mapCenter.lng,
      latitude: mapCenter.lat,
      zoom: 15,
    });
  }, [mapCenter]);

  useEffect(() => {
    localStorage.removeItem('routes');
  }, []);

  const onMove = (event: ViewStateChangeEvent) => {
    setViewState(event.viewState);
  };

  const onClickMap = (event: MapLayerMouseEvent) => {
    const { lat, lng } = event.lngLat;
    const point = {
      lat,
      lng,
    };
    createRouteWithNewPoint(point);
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
