// External Dependencies
import { forwardRef, useEffect } from 'react';
import Map, {
  MapLayerMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Relative Dependencies
import Route from './Route';
import Points from './Points';
import { useCreateRoute } from '../Hooks/useCreateRoute';
import { useRoute } from '../Context/RouteProvider';

// Types
declare global {
  interface Window {
    MapboxDirections: any;
  }
}

type RouteBuilderProps = {};

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const RouteBuilder = forwardRef<MapRef, RouteBuilderProps>((_, ref) => {
  const { setMapViewInfo, route } = useRoute();
  const { createRouteWithNewPoint } = useCreateRoute();

  useEffect(() => {
    localStorage.removeItem('routes');
  }, []);

  const onMove = (event: ViewStateChangeEvent) => {
    setMapViewInfo({
      latitude: event.viewState.latitude,
      longitude: event.viewState.longitude,
      zoom: event.viewState.zoom,
    });
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
      ref={ref}
      {...route.mapViewInfo}
      onMove={onMove}
      onClick={onClickMap}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={ACCESS_TOKEN}
      preserveDrawingBuffer={true}
    >
      <Points />
      <Route />
    </Map>
  );
});

export default RouteBuilder;
