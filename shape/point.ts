/**
 * Point type
 * Represents a point in 2D space with x and y coordinates with the origin at the top-left corner.
 */
export type Point = {
  /** x coordinate */
  x: number;
  /** y coordinate */
  y: number;
};

export const isEqual = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;
