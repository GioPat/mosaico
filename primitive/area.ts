import type { Path } from "../path/mod.ts";
import { isEqual, type Point } from "./point.ts";

/**
 * AreaParams is an object literal containing the following properties:
 */
type AreaParams = {
  startingPoints: Point[];
  endingPoints: Point[];
};

type Area = {
  draw: (path: Path) => void;
};

export const area = (params: AreaParams): Area => {
  const { startingPoints, endingPoints } = params;
  return {
    draw: (path: Path) => {
      let lastPoint = endingPoints[0];
      path.moveTo(startingPoints[0].x, endingPoints[0].y);
      for (let i = 1; i < endingPoints.length; i++) {
        if (!isEqual(lastPoint, endingPoints[i])) {
          path.lineTo(endingPoints[i].x, endingPoints[i].y);
          lastPoint = endingPoints[i];
        }
      }
      path.lineTo(endingPoints[endingPoints.length - 1].x, startingPoints[startingPoints.length - 1].y);
      for (let i = startingPoints.length - 1; i >= 0; i--) {
        if (!isEqual(startingPoints[i], lastPoint)) {
          path.lineTo(startingPoints[i].x, startingPoints[i].y);
          lastPoint = startingPoints[i];
        }
      }
      path.closePath();
    },
  };
};
