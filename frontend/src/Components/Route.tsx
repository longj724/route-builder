// External Dependencies
import { useEffect, useState, ReactElement } from 'react';
import { Source, Layer, LineLayer } from 'react-map-gl';

// Relative Dependencies
import { useRoute } from '../Context/RouteProvider';

function Route(): ReactElement {
  const { coordinates } = useRoute().route;

  const lineStyle: LineLayer = {
    id: 'line',
    type: 'line',
    layout: {
      'line-cap': 'butt',
    },
    paint: {
      'line-width': 5,
      'line-color': '#007cbf',
    },
  };

  const [geoJSONFeature, setGeoJSONFeature] = useState<
    GeoJSON.Feature | undefined
  >(undefined);

  useEffect(() => {
    const newFeature: GeoJSON.Feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coordinates,
      },
      properties: {},
    };

    setGeoJSONFeature(newFeature);
  }, [coordinates]);

  return (
    <>
      <Source type="geojson" data={geoJSONFeature} id="some-random-id">
        <Layer {...lineStyle} />
      </Source>
    </>
  );
}

export default Route;
