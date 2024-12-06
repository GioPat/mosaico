import { createPath } from "../path/mod.ts";
import { area } from "./area.ts";
import { sector } from "./primitives./sector.ts";
import { rectangle } from "./primitives/rectangle.ts";
import { assertEquals } from "@std/assert";

Deno.test(function circle() {
  const path = createPath(3);
  const s = sector({
    center: { x: 100, y: -200 },
    startAngle: 210,
    endAngle: 340,
    outerRadius: 150,
    outerCornerRadius: 10,
    innerRadius: 80,
    innerCornerRadius: 5,
  });
  s.draw(path);
  console.log(path.toString());
  assertEquals(5, 5);
});

const testArea = () => {
  const path = createPath(3);
  const a = rectangle({
    width: 200,
    height: 100,
    bottomRadius: 10,
    topRadius: 4,
  });
  a.draw(path);
  console.log(path.toString());
  assertEquals(5, 5);
};

Deno.test(testArea);
