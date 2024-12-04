import type { Path } from "@mosaico/path";
import type { Point } from "./point.ts";

export type Primitive = {
  draw: (path: Path) => void;
};

export type PrimitiveParams = {
  center?: Point;
};
