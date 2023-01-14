// External dependencies
import React from 'react';
import Plot from 'react-plotly.js';

// Relative Dependencies
import { useRoute } from '../Context/RouteProvider';

// Types
type LineChartProps = {
  containerRef: React.RefObject<HTMLDivElement>;
};

function LineChart(props: LineChartProps) {
  const { containerRef } = props;
  const { route } = useRoute();

  const containerWidth = containerRef.current?.clientWidth;

  const yPoints = route.elevationPoints;
  const numXPoints = route.elevationPoints.length;
  const xInterval = route.distance / (numXPoints - 2);
  let xPoints = [0];

  for (let i = 1; i <= numXPoints; i++) {
    xPoints.push(i * xInterval);
  }

  return (
    <Plot
      data={[
        {
          x: xPoints,
          y: yPoints,
          type: 'scatter',
          mode: 'lines',
          marker: { color: 'blue', size: 20 },
          line: {
            color: 'red',
          },
        },
      ]}
      config={{
        displayModeBar: false,
      }}
      layout={{
        width: containerWidth,
        height: 240,
        title: 'Elevation Profile',
        xaxis: {
          title: 'Distance',
          ticksuffix: ' mi',
        },
        yaxis: {
          title: 'Elevation',
          ticksuffix: ' ft',
        },
      }}
      style={{ width: '100%' }}
    />
  );
}

export default LineChart;
