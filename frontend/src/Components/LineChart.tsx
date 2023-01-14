// External dependencies
import React from 'react';
import Plot from 'react-plotly.js';

// Relative Dependencies

// Types
type LineChartProps = {
  containerRef: React.RefObject<HTMLDivElement>;
};

function LineChart(props: LineChartProps) {
  const { containerRef } = props;
  const containerWidth = containerRef.current?.clientWidth;

  return (
    <Plot
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
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
