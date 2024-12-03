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
const pointOnArc = (center: Point, radius: number, angle: number): Point => {
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
          const startPoint = pointOnArc({ x: 0, y: -outerRadius }, outerRadius, startAnglePadded);
          path.lineTo(startPoint.x, startPoint.y);
          const sweep = angleSpan > 180;
          const endPoint = pointOnArc({ x: 0, y: -outerRadius }, outerRadius, endAnglePadded);
          path.arcRaw(outerRadius, outerRadius, 0, sweep, true, endPoint.x, endPoint.y);
          path.arcRaw(outerRadius, outerRadius, 0, sweep, true, endPoint.x, endPoint.y);
          break;
        }
        case !innerRadius && outerCornerRadius !== undefined: {
          // It's a slice with rounded outer corners
          const center: Point = { x: 0, y: -outerRadius };
          const actualCornerOuterRadius = Math.min(outerRadius / 2, outerCornerRadius);
          const outerRadiusIncludingBorder = outerRadius - actualCornerOuterRadius;
          const startAnglePadded = startAngle + (padAngle ?? 0 / 2);
          const endAnglePadded = endAngle - (padAngle ?? 0 / 2);

          const outerRoundingAngle = 360 * ((actualCornerOuterRadius ?? 0) / (2 * Math.PI * outerRadius));
          const outerArcStart = pointOnArc(center, outerRadius, startAnglePadded + outerRoundingAngle);
          const outerArcEnd = pointOnArc(center, outerRadius, endAnglePadded - outerRoundingAngle);

          const outerStart = pointOnArc(center, outerRadiusIncludingBorder, startAnglePadded);
          const outerEnd = pointOnArc(center, outerRadiusIncludingBorder, endAnglePadded);

          const outerSweep = angleSpan > 180 + 2 * outerRoundingAngle;
          path.moveTo(0, -outerRadius);
          path.lineTo(outerStart.x, outerStart.y);
          path.arcRaw(
            actualCornerOuterRadius,
            actualCornerOuterRadius,
            0,
            false,
            true,
            outerArcStart.x,
            outerArcStart.y,
          );
          path.arcRaw(outerRadius, outerRadius, 0, outerSweep, true, outerArcEnd.x, outerArcEnd.y);
          path.arcRaw(actualCornerOuterRadius, actualCornerOuterRadius, 0, false, true, outerEnd.x, outerEnd.y);
          break;
        }
        case innerRadius !== undefined && !outerCornerRadius &&
          !innerCornerRadius: {
          const startAnglePadded = startAngle + (padAngle ?? 0 / 2);
          const endAnglePadded = endAngle - (padAngle ?? 0 / 2);
          // It's an annular sector with no rounded corners
          const innerArcStart = pointOnArc({ x: 0, y: 0 }, innerRadius, startAnglePadded);
          const outerArcStart = pointOnArc({ x: 0, y: 0 }, outerRadius, startAnglePadded);
          path.moveTo(innerArcStart.x, innerArcStart.y);
          path.lineTo(outerArcStart.x, outerArcStart.y);
          const sweep = angleSpan > 180;
          const outerArcEnd = pointOnArc({ x: 0, y: 0 }, outerRadius, endAnglePadded);
          path.arcRaw(outerRadius, outerRadius, 0, sweep, true, outerArcEnd.x, outerArcEnd.y);
          const innerArcEnd = pointOnArc({ x: 0, y: 0 }, innerRadius, endAnglePadded);
          path.lineTo(innerArcEnd.x, innerArcEnd.y);
          path.arcRaw(innerRadius, innerRadius, 0, sweep, false, innerArcStart.x, innerArcStart.y);
          break;
        }
        case innerRadius !== undefined && outerRadius !== undefined &&
          (innerCornerRadius !== undefined ||
            outerCornerRadius !== undefined): {
          // It's an annular sector with rounded corners
          const actualCornerInnerRadius = innerCornerRadius
            ? Math.min((outerRadius - innerRadius) / 2, innerCornerRadius)
            : undefined;
          const actualCornerOuterRadius = outerCornerRadius
            ? Math.min((outerRadius - innerRadius) / 2, outerCornerRadius)
            : undefined;

          const center: Point = { x: 0, y: 0 };
          const startAnglePadded = startAngle + (padAngle ?? 0 / 2);
          const endAnglePadded = endAngle - (padAngle ?? 0 / 2);

          const innerRadiusIncludingBorder = innerRadius + (actualCornerInnerRadius ?? 0);
          const outerRadiusIncludingBorder = outerRadius - (actualCornerInnerRadius ?? 0);
          // These already take into account the border
          const outerStart = pointOnArc(center, outerRadiusIncludingBorder, startAnglePadded);
          const outerEnd = pointOnArc(center, outerRadiusIncludingBorder, endAnglePadded);
          const innerStart = pointOnArc(center, innerRadiusIncludingBorder, startAnglePadded);
          const innerEnd = pointOnArc(center, innerRadiusIncludingBorder, endAnglePadded);

          const innerRoundingAngle = 360 * ((actualCornerInnerRadius ?? 0) / (2 * Math.PI * innerRadius));
          const outerRoundingAngle = 360 * ((actualCornerOuterRadius ?? 0) / (2 * Math.PI * outerRadius));

          const innerArcStart = pointOnArc(center, innerRadius, startAnglePadded + innerRoundingAngle);
          const innerArcEnd = pointOnArc(center, innerRadius, endAnglePadded - innerRoundingAngle);

          const outerArcStart = pointOnArc(center, outerRadius, startAnglePadded + outerRoundingAngle);
          const outerArcEnd = pointOnArc(center, outerRadius, endAnglePadded - outerRoundingAngle);
          const outerSweep = angleSpan > 180 + 2 * outerRoundingAngle;
          const innerSweep = angleSpan > 180 + 2 * innerRoundingAngle;
          path.moveTo(outerStart.x, outerStart.y);
          if (actualCornerOuterRadius) {
            path.arcRaw(
              actualCornerOuterRadius,
              actualCornerOuterRadius,
              0,
              false,
              true,
              outerArcStart.x,
              outerArcStart.y,
            );
          }
          path.arcRaw(outerRadius, outerRadius, 0, outerSweep, true, outerArcEnd.x, outerArcEnd.y);
          if (actualCornerOuterRadius) {
            path.arcRaw(actualCornerOuterRadius, actualCornerOuterRadius, 0, false, true, outerEnd.x, outerEnd.y);
          }
          path.lineTo(innerEnd.x, innerEnd.y);
          if (actualCornerInnerRadius) {
            path.arcRaw(actualCornerInnerRadius, actualCornerInnerRadius, 0, false, true, innerArcEnd.x, innerArcEnd.y);
          }
          path.arcRaw(innerRadius, innerRadius, 0, innerSweep, false, innerArcStart.x, innerArcStart.y);
          if (actualCornerInnerRadius) {
            path.arcRaw(actualCornerInnerRadius, actualCornerInnerRadius, 0, false, true, innerStart.x, innerStart.y);
          }
          break;
        }
      }
      path.closePath();
      return;
    },
  };
};
