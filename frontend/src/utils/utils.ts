// External Dependencies

// Relative Dependencies
import { Point } from '../Components/Points';

// Types
export type ElevationGainAndLoss = {
  gain: number;
  loss: number;
};

export function formatPoints(points: Point[]): String {
  let formattedPoints = '';
  points.forEach((point, index) => {
    formattedPoints += point.lat;
    formattedPoints += ',';
    formattedPoints += point.lng;

    if (index !== points.length - 1) formattedPoints += '|';
  });
  return formattedPoints;
}

export function calculateElevationGainAndLoss(
  elevation_points: number[]
): ElevationGainAndLoss {
  let gain = 0;
  let loss = 0;

  for (let i = 1; i < elevation_points.length; i++) {
    const diff = elevation_points[i] - elevation_points[i - 1];

    if (diff > 0) {
      gain += diff;
    } else if (diff < 0) {
      loss += Math.abs(diff);
    }
  }

  gain = Math.round(gain);
  loss = Math.round(loss);

  const gainAndLoss = {
    gain,
    loss,
  };

  return gainAndLoss;
}
