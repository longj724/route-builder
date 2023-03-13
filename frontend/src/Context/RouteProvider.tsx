// External Dependencies
import { useContext, createContext, useState } from 'react';
import { Position } from 'geojson';

// Relative Dependencies
import { Point } from '../Components/Points';
import { ElevationGainAndLoss } from '../Utils/utils';

// Types
type RouteProviderProps = {
  children: React.ReactNode;
};

export type MapViewInfo = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type RouteType = {
  coordinates: Position[];
  selectedPoints: Point[];
  distance: number;
  elevationPoints: number[];
  elevationGainAndLoss: ElevationGainAndLoss;
  mapViewInfo: MapViewInfo;
};

const defaultRoute: RouteType = {
  coordinates: [],
  selectedPoints: [],
  distance: 0,
  elevationPoints: [],
  elevationGainAndLoss: {
    gain: 0,
    loss: 0,
  },
  mapViewInfo: {
    latitude: 40.712776,
    longitude: -74.005974,
    zoom: 15,
  },
};

type RouteContextType = {
  route: RouteType;
  setCoordinates: (newCoordinates: Position[]) => void;
  setDistance: (distance: number) => void;
  setMapViewInfo: (newMapViewInfo: MapViewInfo) => void;
  setSelectedPoints: (newPoints: Point[]) => void;
  updateRoute: (route: RouteType) => void;
};

const RouteContext = createContext<RouteContextType | null>(null);

export function useRoute(): RouteContextType {
  return useContext(RouteContext) as RouteContextType;
}

function RouteProvider({ children }: RouteProviderProps) {
  const [route, setRoute] = useState<RouteType>(defaultRoute);

  const setCoordinates = (newCoordinates: Position[]) => {
    setRoute({
      ...route,
      coordinates: newCoordinates,
    });
  };

  const setSelectedPoints = (newPoints: Point[]) => {
    setRoute({
      ...route,
      selectedPoints: newPoints,
    });
  };

  const setDistance = (distance: number) => {
    setRoute({
      ...route,
      distance: distance,
    });
  };

  const setMapViewInfo = (newMapViewInfo: MapViewInfo) => {
    setRoute({
      ...route,
      mapViewInfo: newMapViewInfo,
    });
  };

  const updateRoute = (newRoute: RouteType) => {
    setRoute(newRoute);
  };

  return (
    <RouteContext.Provider
      value={{
        route: route,
        setCoordinates,
        setDistance,
        setMapViewInfo,
        setSelectedPoints,
        updateRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export default RouteProvider;
