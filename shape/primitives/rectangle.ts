import type { Point } from "../point.ts";
import type { Shape, ShapeParams } from "./../mod.ts";

/**
 * Type definition for the parameters of a rectangle.
 */
type RectangleParams = {
  /** Width  */
  width: number;
  /** Height */
  height: number;
  /** Bottom angle radius */
  bottomRadius?: number;
  /** Top angle radius */
  topRadius?: number;
  /** Rotation in degrees with respect to the center */
  rotation?: number;
};

/**
 * Creates a rectangle shape, the
 * @param params The parameters of the rectangle
 * @returns a drawable rectangle shape
 */
export const rectangle = (params: ShapeParams & RectangleParams): Shape => {
  const { width, height, rotation } = params;
  return {
    draw: (path) => {
      if (rotation !== undefined) {
        throw new Error("Rotation for rectangle is not implemented yet!");
      }
      const { x, y } = params.center ?? { x: 0, y: 0 };
      let topLeftPoint: Point = { x: x - width / 2, y: y - height / 2 };
      let topRightPoint: Point = { x: x + width / 2, y: y - height / 2 };
      let bottomRightPoint: Point = { x: x + width / 2, y: y + height / 2 };
      let bottomLeftPoint: Point = { x: x - width / 2, y: y + height / 2 };
      if (params.topRadius) {
        topLeftPoint = { x: x - width / 2, y: (y - height / 2) - params.topRadius };
        topRightPoint = { x: (x + width / 2) - params.topRadius, y: topLeftPoint.y - params.topRadius };
      }
      if (params.bottomRadius) {
        bottomRightPoint = { x: x + width / 2, y: (y + height / 2) - params.bottomRadius };
        bottomLeftPoint = { x: x - width / 2 + params.bottomRadius, y: (y + height / 2) };
      }
      path.moveTo(topLeftPoint.x, topLeftPoint.y);
      if (params.topRadius) {
        path.arcRaw(
          params.topRadius,
          params.topRadius,
          0,
          false,
          true,
          topLeftPoint.x + params.topRadius,
          topLeftPoint.y - params.topRadius,
        );
      }
      path.lineTo(topRightPoint.x, topRightPoint.y);
      if (params.topRadius) {
        path.arcRaw(
          params.topRadius,
          params.topRadius,
          0,
          false,
          true,
          topRightPoint.x + params.topRadius,
          topRightPoint.y + params.topRadius,
        );
      }
      path.lineTo(bottomRightPoint.x, bottomRightPoint.y);
      if (params.bottomRadius) {
        path.arcRaw(
          params.bottomRadius,
          params.bottomRadius,
          0,
          false,
          true,
          bottomRightPoint.x - params.bottomRadius,
          bottomRightPoint.y + params.bottomRadius,
        );
      }
      path.lineTo(bottomLeftPoint.x, bottomLeftPoint.y);
      if (params.bottomRadius) {
        path.arcRaw(
          params.bottomRadius,
          params.bottomRadius,
          0,
          false,
          true,
          bottomLeftPoint.x - params.bottomRadius,
          bottomLeftPoint.y - params.bottomRadius,
        );
      }
      path.closePath();
    },
  };
};
