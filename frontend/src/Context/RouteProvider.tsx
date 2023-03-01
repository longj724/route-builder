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

export type RouteType = {
  coordinates: Position[];
  selectedPoints: Point[];
  distance: number;
  elevationPoints: number[];
  elevationGainAndLoss: ElevationGainAndLoss;
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
};

type RouteContextType = {
  route: RouteType;
  setCoordinates: (newCoordinates: Position[]) => void;
  setSelectedPoints: (newPoints: Point[]) => void;
  setDistance: (distance: number) => void;
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
    console.log('in context selectedPoints are', newPoints);
    setRoute({
      ...route,
      selectedPoints: newPoints,
    });
  };

  const setDistance = (distance: number) => {
    console.log('in context distance is', distance);
    setRoute({
      ...route,
      distance: distance,
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
        setSelectedPoints,
        setDistance,
        updateRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export default RouteProvider;
