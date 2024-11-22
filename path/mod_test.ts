import { assertEquals, assertThrows } from "@std/assert";
import { createPath } from "./mod.ts";

const bezierCurveTest = () => {
  const path = createPath();
  path.moveTo(70, 60);
  path.bezierCurveTo(70, 80, 110, 80, 110, 60);
  assertEquals(path.toString(), "M70,60C70,80,110,80,110,60");
};

const moveToTest = () => {
  const path = createPath();
  path.moveTo(10, 10);
  assertEquals(path.toString(), "M10,10");
};

const lineToTest = () => {
  const path = createPath();
  path.lineTo(100, 10);
  assertEquals(path.toString(), "L100,10");
};

const circleTest = () => {
  const path = createPath();
  path.moveTo(150, 80);
  path.arc(80, 80, 70, 0, Math.PI * 2, false);
  assertEquals(path.toString(), "M150,80A70,70,0,1,1,10,80A70,70,0,1,1,150,80");
};

const circleInSquareTest = () => {
  const path = createPath();
  path.rect(10, 10, 140, 140);
  path.moveTo(150, 80);
  path.arc(80, 80, 70, 0, Math.PI * 2, false);
  assertEquals(
    path.toString(),
    "M10,10h140v140h-140ZM150,80A70,70,0,1,1,10,80A70,70,0,1,1,150,80",
  );
};

const quadraticCurveTest = () => {
  const path = createPath();
  path.moveTo(40, 100);
  path.quadraticCurveTo(150, 280, 350, 20);
  assertEquals(path.toString(), "M40,100Q150,280,350,20");
};

const arcTestClockwise = () => {
  const path = createPath();
  path.arc(120, 120, 100, 0, Math.PI / 2, false);
  assertEquals(path.toString(), "M220,120A100,100,0,0,1,120,220");
};

const arcTestCounterClockwise = () => {
  const path = createPath();
  path.arc(120, 120, 100, 0, Math.PI / 2, true);
  assertEquals(path.toString(), "M220,120A100,100,0,1,0,120,220");
};

const arcToTest = () => {
  const path = createPath();
  path.moveTo(10, 10);
  path.lineTo(100, 10);
  path.arcTo(150, 150, 300, 10, 40);
  assertEquals(
    path.toString(),
    "M10,10L100,10L129.5302676171153,92.68474932792284A40,40,0,0,0,194.49267409530924,108.47350417771136",
  );
};

const arcToTestTrimmed = () => {
  const path = createPath(3);
  path.moveTo(10, 10);
  path.lineTo(100, 10);
  path.arcTo(150, 150, 300, 10, 40);
  assertEquals(
    path.toString(),
    "M10,10L100,10L129.53,92.684A40,40,0,0,0,194.492,108.473",
  );
};

const longXDistanceTest = () => {
  const path = createPath();
  path.moveTo(10, 10);
  path.lineTo(100, 10);
  path.arc(150, 150, 300, 10, 40, true);
  path.closePath();
  assertEquals(
    path.toString(),
    "M10,10L100,10L-101.72145872293572,-13.20633326681093A300,300,0,0,0,-50.08141849567858,373.53394814380465Z",
  );
};

const arcNegativeRadius = () => {
  const path = createPath();
  assertThrows(() => {
    path.arc(120, 120, -100, 0, Math.PI / 2, false);
  }, "negative radius: -100");
};

const arcToNegativeRadius = () => {
  const path = createPath();
  assertThrows(() => {
    path.arc(10, 10, -40, 0, Math.PI / 2, false);
  }, "negative radius: -40");
};

const arcRadiusZero = () => {
  const path = createPath();
  path.arc(120, 120, 0, 0, Math.PI / 2, false);
  assertEquals(path.toString(), "M120,120");
};

const arcToNostartTest = () => {
  const path = createPath();
  path.arcTo(150, 150, 300, 10, 40);
  path.lineTo(300, 10);
  assertEquals(path.toString(), "M150,150L300,10");
};

Deno.test(moveToTest);
Deno.test(lineToTest);
Deno.test(arcToTest);
Deno.test(arcToTestTrimmed);
Deno.test(arcNegativeRadius);
Deno.test(arcToNegativeRadius);
Deno.test(arcRadiusZero);
Deno.test(bezierCurveTest);
Deno.test(arcTestClockwise);
Deno.test(arcToNostartTest);
Deno.test(arcTestCounterClockwise);
Deno.test(quadraticCurveTest);
Deno.test(circleTest);
Deno.test(circleInSquareTest);
Deno.test(longXDistanceTest);
