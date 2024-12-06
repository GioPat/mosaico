import type { Path } from "@mosaico/path";
import type { Point } from "./point.ts";

export type Shape = {
  draw: (path: Path) => void;
};

export type ShapeParams = {
  center?: Point;
};
