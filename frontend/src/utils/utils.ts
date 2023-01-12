// External Dependencies

// Relataive Dependencies
import { Point } from '../Components/Points';

export function formatPoints(points: Point[]): String {
  let formattedPoints = '';
  points.forEach((point, index) => {
    formattedPoints += point.lng;
    formattedPoints += ',';
    formattedPoints += point.lat;

    if (index !== points.length - 1) formattedPoints += ';';
  });
  return formattedPoints;
}
