// mod.ts
/**
 * A module providing the primitives path creation based on the [W3 path API](https://www.w3.org/TR/SVG/paths.htm).
 * And inspired by [d3-path](https://github.com/d3/d3-path)
 * @module
 */

const pi = Math.PI,
  tau = 2 * pi,
  epsilon = 1e-6,
  tauEpsilon = tau - epsilon;

interface TrimDigit {
  (number: number, mul?: number): number;
}

const trim: TrimDigit = (
  number: number,
  mul?: number,
): number => {
  return Math.floor(number * mul!) / mul!;
};

const notTrim: TrimDigit = (
  number: number,
  _?: number,
): number => {
  return number;
};

/**
 * Path object that allows you to create SVG path based. It implements the [CanvasRenderingContext2D API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).
 * This allow you to create both SVGs and Canvas paths.
 */
export type Path = {
  /**
   * Move to the specified point (x, y) without drawing a line.
   * @param x Coordinate x
   * @param y Coordinate y
   */
  moveTo: (x: number, y: number) => void;

  /**
   * Adds to the path a line segment from the current point to the point (x, y).
   * @param x Coordinate x
   * @param y Coordinate y
   */
  lineTo: (x: number, y: number) => void;

  /**
   * Adds to the path a quadratic Bézier curve from the current point to (x,y) using (x1,y1) as the control point.
   * @param cpx Control point x
   * @param cpy Control point y
   * @param x Coordinate x
   * @param y Coordinate y
   */
  quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void;

  /**
   * Adds to the path a cubic Bézier curve from the current point to (x,y) using (cp1x,cp1y) and (cp2x,cp2y) as control points.
   * @param cp1x Control point 1 x
   * @param cp1y Control point 1 y
   * @param cp2x Control point 2 x
   * @param cp2y Control point 2 y
   * @param x Coordinate x
   * @param y Coordinate y
   */
  bezierCurveTo: (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ) => void;

  /**
   * Adds to the path an arc with the specified control points and radius
   * @param x1Arc Coordinate x of the first control point
   * @param y1Arc Coordinate y of the first control point
   * @param x2Arc Coordinate x of the second control point
   * @param y2Arc Coordinate y of the second control point
   * @param r Radius of the arc
   * @throws {Error} negative radius
   * @returns void
   */
  arcTo: (
    x1Arc: number,
    y1Arc: number,
    x2Arc: number,
    y2Arc: number,
    r: number,
  ) => void;

  /**
   * @param x Relative coordinate x for the center of the circle
   * @param y Relative coordinate y for the center of the circle
   * @param radius Radius of the circle
   * @param clockwise If true, draws the circle clockwise, otherwise counter-clockwise, this is useful for creating donut and have a correct fill behavior.
   * @returns
   */
  circle: (radius: number, clockwise: boolean) => void;

  /**
   * Adds to the path a circular arc segment with the specified center ⟨x, y⟩, radius, startAngle and endAngle. If anticlockwise is true, the arc is drawn in the anticlockwise direction; otherwise, it is drawn in the clockwise direction. If the current point is not equal to the starting point of the arc, a straight line is drawn from the current point to the start of the arc.
   * @param x Coordinate x
   * @param y Coordinate y
   * @param radius Radius of the arc
   * @param startAngle Start angle of the arc
   * @param endAngle End angle of the arc
   * @param anticlockwise If true, draws the arc counter-clockwise between the start and end angles, otherwise clockwise
   * @throws {Error} negative radius
   * @returns void
   */
  arc: (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise: boolean,
  ) => void;

  /**
   * Adds to the path a line segment from the current point to the point (x, y).
   * @param x Coordinate x
   * @param y Coordinate y
   */
  rect: (x: number, y: number, w: number, h: number) => void;

  /**
   * Adds the arc raw command to the path.
   * @param radiusX The x-axis radius of the ellipse
   * @param radiusY The y-axis radius of the ellipse
   * @param xAxisRotation The rotation of the ellipse, in degrees
   * @param largeArcFlag If true, draw the larger of the two possible arcs
   * @param sweepFlag If true, draw the arc matching the direction of the path
   * @param x Coordinate x
   * @param y Coordinate y
   * @param absolute If true, the coordinates are absolute, otherwise relative
   */
  arcRaw: (
    radiusX: number,
    radiusY: number,
    xAxisRotation: number,
    largeArcFlag: boolean,
    sweepFlag: boolean,
    x: number,
    y: number,
    absolute?: boolean,
  ) => void;

  /**
   * Closes the path, joining the last point with the first point (if
   * they are different) with a straight line.
   */
  closePath: () => void;

  /**
   * Returns the path data string.
   * @returns {string} path
   */
  toString: () => string;
};

/**
 * returns a path object that allows you to create a path based on the [W3 path API](https://www.w3.org/TR/SVG/paths.htm).
 * @returns {Object} path
 */
export const createPath = (digits?: number): Path => {
  let x0: number | null = null,
    x1: number | null = null,
    y0: number | null = null,
    y1: number | null = null;
  let path: string = "";
  const mul = Math.pow(10, digits ?? 0);
  const trimDigit: (number: number) => number = digits !== undefined ? (number: number) => trim(number, mul) : notTrim;

  const moveTo = (x: number, y: number): void => {
    x0 = x;
    x1 = x;
    y0 = y;
    y1 = y;
    path = `${path}M${trimDigit(x0)} ${trimDigit(y0)}`;
  };

  const quadraticCurveTo = (
    cpx: number,
    cpy: number,
    x: number,
    y: number,
  ): void => {
    x1 = x;
    y1 = y;
    path = `${path}Q${trimDigit(cpx)},${trimDigit(cpy)},${trimDigit(x1)},${trimDigit(y1)}`;
  };

  const bezierCurveTo = (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ): void => {
    x1 = x;
    y1 = y;
    path = `${path}C${trimDigit(cp1x)},${trimDigit(cp1y)},${trimDigit(cp2x)},${trimDigit(cp2y)},${trimDigit(x1)},${
      trimDigit(y1)
    }`;
  };

  const arcTo = (
    x1Arc: number,
    y1Arc: number,
    x2Arc: number,
    y2Arc: number,
    r: number,
  ): void => {
    if (x1 === null || y1 === null) {
      x1 = x1Arc;
      y1 = y1Arc;
      x0 = x0 ?? 0;
      y0 = y0 ?? 0;
      path = `${path}M${trimDigit(x1)} ${trimDigit(y1)}`;
      return;
    }
    if (r < 0) {
      throw new Error(`negative radius: ${r}`);
    }

    const x0Arc = x1,
      y0Arc = y1,
      x21 = x2Arc - x1Arc,
      y21 = y2Arc - y1Arc,
      x01 = x0Arc - x1Arc,
      y01 = y0Arc - y1Arc,
      l01_2 = x01 * x01 + y01 * y01;
    if (l01_2 < epsilon) return;
    else if (Math.abs(y01 * x21 - y21 * x01) < epsilon || r === 0) {
      x1 = x1Arc;
      y1 = y1Arc;
      path = `${path}L${trimDigit(x1)},${trimDigit(y1)}`;
      return;
    } else {
      const x20 = x2Arc - x0Arc,
        y20 = y2Arc - y0Arc,
        l21_2 = x21 * x21 + y21 * y21,
        l20_2 = x20 * x20 + y20 * y20,
        l21 = Math.sqrt(l21_2),
        l01 = Math.sqrt(l01_2),
        l = r *
          Math.tan(
            (pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2,
          ),
        t01 = l / l01,
        t21 = l / l21;
      if (Math.abs(t01 - 1) > epsilon) {
        path = `${path}L${trimDigit(x1Arc + t01 * x01)} ${trimDigit(y1Arc + t01 * y01)}`;
      }
      x1 = x1Arc + t21 * x21;
      y1 = y1Arc + t21 * y21;
      path = `${path}A${trimDigit(r)},${trimDigit(r)},0,0,${+(y01 * x20 > x01 * y20)},${trimDigit(x1)},${
        trimDigit(y1)
      }`;
      return;
    }
  };

  // Relative circle from the current point
  const circle = (radius: number, clockwise: boolean): void => {
    const halfRadius = radius / 2;
    const cw = clockwise ? 1 : 0;
    path = `${path}a${trimDigit(halfRadius)} ${trimDigit(halfRadius)} 0 0${cw}${radius} 0 ${trimDigit(halfRadius)} ${
      trimDigit(halfRadius)
    } 0 0${cw}${-trimDigit(radius)} 0`;
    return;
  };

  const arc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise: boolean,
  ): void => {
    if (radius < 0) {
      throw new Error(`negative radius: ${radius}`);
    }
    const dx = radius * Math.cos(startAngle),
      dy = radius * Math.sin(startAngle),
      x0 = x + dx,
      y0 = y + dy,
      cw = anticlockwise ? 0 : 1;
    let da = anticlockwise ? startAngle - endAngle : endAngle - startAngle;
    if (x1 === null) {
      path = `${path}M${x0} ${y0}`;
    } else if (
      Math.abs(x1 - x0) > epsilon || Math.abs((y1 ?? 0) - y0) > epsilon
    ) {
      path = `${path}L${trimDigit(x0)} ${trimDigit(y0)}`;
    }

    if (radius === 0) return;

    if (da < 0) {
      da = da % tau + tau;
    }

    if (da > tauEpsilon) {
      x1 = x0;
      y1 = y0;
      path = `${path}A${trimDigit(radius)},${trimDigit(radius)},0,1,${cw},${trimDigit(x - dx)},${trimDigit(y - dy)}A${
        trimDigit(radius)
      },${trimDigit(radius)},0,1,${cw},${trimDigit(x1)},${trimDigit(y1)}`;
    } else if (da > epsilon) {
      x1 = x + radius * Math.cos(endAngle);
      y1 = y + radius * Math.sin(endAngle);
      path = `${path}A${trimDigit(radius)},${trimDigit(radius)},0,${+(da >= pi)},${cw},${trimDigit(x1)},${
        trimDigit(y1)
      }`;
    }
    return;
  };

  const lineTo = (x: number, y: number): void => {
    x1 = x;
    y1 = y;
    path = `${path}L${trimDigit(x1)} ${trimDigit(y1)}`;
  };

  const rect = (x: number, y: number, w: number, h: number) => {
    x0 = x;
    x1 = x;
    y0 = y;
    y1 = y;

    path = `${path}M${trimDigit(x0)} ${trimDigit(y0)}h${trimDigit(w)}v${trimDigit(h)}h${trimDigit(-w)}Z`;
    return;
  };

  const arcRaw = (
    radiusX: number,
    radiusY: number,
    xAxisRotation: number,
    largeArcFlag: boolean,
    sweepFlag: boolean,
    x: number,
    y: number,
    absolute: boolean = true,
  ): void => {
    const largeArcFlagValue = largeArcFlag ? 1 : 0;
    const sweepFlagValue = sweepFlag ? 1 : 0;
    const command = absolute ? "A" : "a";
    path = `${path}${command}${trimDigit(radiusX)} ${
      trimDigit(radiusY)
    } ${xAxisRotation} ${largeArcFlagValue}${sweepFlagValue} ${trimDigit(x)} ${trimDigit(y)}`;
  };

  const closePath = (): void => {
    if (x1 !== null) {
      x1 = x0;
      y1 = y0;
      path = `${path}Z`;
    }
  };

  const toString = (): string => {
    return path;
  };

  return {
    moveTo,
    lineTo,
    quadraticCurveTo,
    bezierCurveTo,
    arcTo,
    arc,
    rect,
    arcRaw,
    closePath,
    toString,
    circle,
  };
};
