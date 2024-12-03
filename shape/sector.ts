import type { Path } from "../path/mod.ts";
import { DEGREE_TO_RADIAN } from "./math.ts";

const epsilon = 1e-12;

type SectorInitParams = {
  startAngle: number;
  endAngle: number;
  outerRadius: number;
  innerRadius?: number;
  outerCornerRadius?: number;
  innerCornerRadius?: number;
  padAngle?: number;
};

type Sector = {
  draw: (path: Path) => void;
};

type Point = {
  x: number;
  y: number;
};

/**
 * @param center The center of the arc
 * @param radius The radius of the arc
 * @param angle The angle, in **degrees**, of the point on the arc taken from coordinates (x, -y)
 * where x is the horizontal axis and y is the vertical axis in the SVG coordinate system.
 * @returns
 */
const pointOnArc = (
  center: Point,
  radius: number,
  angle: number,
): Point => {
  const radians = (90 - angle) * DEGREE_TO_RADIAN;
  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y - radius * Math.sin(radians),
  };
};

export const sector = (params: SectorInitParams): Sector => {
  const {
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    outerCornerRadius,
    innerCornerRadius,
    padAngle,
  } = params;
  return {
    draw: (path: Path) => {
      const angleSpan = Math.abs(endAngle - startAngle);
      if (!innerRadius && innerCornerRadius) {
        throw new Error("innerCornerRadius requires innerRadius.");
      }
      switch (true) {
        case angleSpan > 360 - epsilon: {
          // It's a circle or annulus
          path.circle(0, outerRadius, outerRadius * 2, true);
          if (innerRadius && innerRadius > epsilon) {
            if (innerRadius > outerRadius) {
              throw new Error(
                `innerRadius (${innerRadius}) is greater than outerRadius (${outerRadius})`,
              );
            }
            // It's an annulus
            path.circle(
              outerRadius - innerRadius,
              0,
              innerRadius * 2,
              false,
            );
          }
          break;
        }
        case !innerRadius && !outerCornerRadius: {
          // It's a slice with no rounded corners
          path.moveTo(0, -outerRadius);
          const startAnglePadded = startAngle + (padAngle ?? 0 / 2);
          const endAnglePadded = endAngle - (padAngle ?? 0 / 2);
          const startPoint = pointOnArc(
            { x: 0, y: -outerRadius },
            outerRadius,
            startAnglePadded,
          );
          path.lineTo(startPoint.x, startPoint.y);
          const sweep = angleSpan > 180 ? 1 : 0;
          const endPoint = pointOnArc(
            { x: 0, y: -outerRadius },
            outerRadius,
            endAnglePadded,
          );
          path.addRaw(
            `A${outerRadius},${outerRadius} 0 ${sweep}1${endPoint.x}${endPoint.y}`,
          );
          break;
        }
        case !innerRadius && outerCornerRadius !== undefined: {
          // It's a slice with rounded outer corners
          const offsetOuterRadius = outerRadius - outerCornerRadius;
          const startAnglePadded = startAngle + (padAngle ?? 0 / 2);
          const endAnglePadded = endAngle - (padAngle ?? 0 / 2);
          // Compute and move to the start point of the outer arc
          const outerBorderArcStart = pointOnArc(
            { x: 0, y: 0 },
            offsetOuterRadius,
            startAnglePadded + (padAngle ?? 0 / 2),
          );
          path.moveTo(outerBorderArcStart.x, outerBorderArcStart.y);

          // Compute the end and creates Arc for the top rounded corner
          const outerBorderAngle = 360 *
            (outerCornerRadius / (2 * Math.PI * outerRadius));
          const outerBorderArcEnd = pointOnArc(
            { x: 0, y: 0 },
            outerRadius,
            startAnglePadded + outerBorderAngle,
          );
          path.addRaw(
            `A${outerCornerRadius},${outerCornerRadius} 0 01${outerBorderArcEnd.x}${outerBorderArcEnd.y}`,
          );

          // Compute the end point of the main arc minus the border and creates the main arc
          const mainArcSweep = angleSpan > 180 + 2 * outerBorderAngle ? 1 : 0;
          const outerPaddedArcEnd = pointOnArc(
            { x: 0, y: 0 },
            outerRadius,
            endAnglePadded - outerBorderAngle,
          );
          path.addRaw(
            `A${outerRadius},${outerRadius} 0 ${mainArcSweep}1${outerPaddedArcEnd.x}${outerPaddedArcEnd.y}`,
          );

          // Compute the end point of the main arc including the border and creates the bottom rounded corner
          const outerArcEnd = pointOnArc(
            { x: 0, y: 0 },
            offsetOuterRadius,
            endAnglePadded,
          );
          path.addRaw(
            `A${outerCornerRadius},${outerCornerRadius} 0 01${outerArcEnd.x}${outerArcEnd.y}`,
          );
          break;
        }
        case innerRadius !== undefined && !outerCornerRadius &&
          !innerCornerRadius: {
          const startAnglePadded = startAngle + (padAngle ?? 0 / 2);
          const endAnglePadded = endAngle - (padAngle ?? 0 / 2);
          // It's an annular sector with no rounded corners
          const innerArcStart = pointOnArc(
            { x: 0, y: 0 },
            innerRadius,
            startAnglePadded,
          );
          const outerArcStart = pointOnArc(
            { x: 0, y: 0 },
            outerRadius,
            startAnglePadded,
          );
          path.moveTo(innerArcStart.x, innerArcStart.y);
          path.lineTo(outerArcStart.x, outerArcStart.y);
          const sweep = angleSpan > 180 ? 1 : 0;
          const outerArcEnd = pointOnArc(
            { x: 0, y: 0 },
            outerRadius,
            endAnglePadded,
          );
          path.addRaw(
            `A${outerRadius},${outerRadius} 0 ${sweep}1${outerArcEnd.x}${outerArcEnd.y}`,
          );
          const innerArcEnd = pointOnArc(
            { x: 0, y: 0 },
            innerRadius,
            endAnglePadded,
          );
          path.lineTo(innerArcEnd.x, innerArcEnd.y);
          path.addRaw(
            `A${innerRadius},${innerRadius} 0 ${sweep}0${innerArcStart.x}${innerArcStart.y}`,
          );
          break;
        }
        case innerRadius !== undefined && outerRadius !== undefined &&
          (innerCornerRadius !== undefined ||
            outerCornerRadius !== undefined): {
          const center: Point = { x: 0, y: 0 };
          // It's an annular sector with rounded corners
          const startAnglePadded = startAngle + (padAngle ?? 0 / 2);
          const endAnglePadded = endAngle - (padAngle ?? 0 / 2);

          const innerRadiusIncludingBorder = innerRadius +
            (innerCornerRadius ?? 0);
          const outerRadiusIncludingBorder = outerRadius -
            (outerCornerRadius ?? 0);
          // These already take into account the border
          const outerStart = pointOnArc(
            center,
            outerRadiusIncludingBorder,
            startAnglePadded,
          );
          const outerEnd = pointOnArc(
            center,
            outerRadiusIncludingBorder,
            endAnglePadded,
          );
          const innerStart = pointOnArc(
            center,
            innerRadiusIncludingBorder,
            startAnglePadded,
          );
          const innerEnd = pointOnArc(
            center,
            innerRadiusIncludingBorder,
            endAnglePadded,
          );

          const innerRoundingAngle = 360 *
            (innerCornerRadius ?? 0 / 2 * Math.PI * innerRadiusIncludingBorder);
          const outerRoundingAngle = 360 *
            (outerCornerRadius ?? 0 / 2 * Math.PI * outerRadiusIncludingBorder);

          const innerArcStart = pointOnArc(
            center,
            innerRadiusIncludingBorder,
            startAnglePadded + innerRoundingAngle,
          );
          const innerArcEnd = pointOnArc(
            center,
            innerRadiusIncludingBorder,
            endAnglePadded - innerRoundingAngle,
          );

          const outerArcStart = pointOnArc(
            center,
            outerRadiusIncludingBorder,
            startAnglePadded + outerRoundingAngle,
          );
          const outerArcEnd = pointOnArc(
            center,
            outerRadiusIncludingBorder,
            endAnglePadded - outerRoundingAngle,
          );
          const outerSweep = angleSpan > 180 + 2 * outerRoundingAngle ? 1 : 0;
          const innerSweep = angleSpan > 180 + 2 * innerRoundingAngle ? 1 : 0;
          path.moveTo(outerStart.x, outerStart.y);
          path.addRaw(
            `A${outerCornerRadius},${outerCornerRadius} 0 01${outerArcStart.x}${outerArcStart.y}`,
          );
          path.addRaw(
            `A${outerRadius},${outerRadius} 0 ${outerSweep}1${outerArcEnd.x}${outerArcEnd.y}`,
          );
          path.addRaw(
            `A${outerCornerRadius},${outerCornerRadius} 0 01${outerEnd.x}${outerEnd.y}`,
          );
          path.lineTo(innerEnd.x, innerEnd.y);
          path.addRaw(
            `A${innerCornerRadius},${innerCornerRadius} 0 01${innerArcEnd.x}${innerArcEnd.y}`,
          );
          path.addRaw(
            `A${innerRadius},${innerRadius} 0 ${innerSweep}0${innerArcStart.x}${innerArcStart.y}`,
          );
          path.addRaw(
            `A${innerCornerRadius},${innerCornerRadius} 0 01${innerStart.x}${innerStart.y}`,
          );
          break;
        }
      }
      path.closePath();
      return;
    },
  };
};
