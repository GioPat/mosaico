import { createPath } from "../path/mod.ts";
import { area } from "./area.ts";
import { sector } from "./sector.ts";
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
  const a = area({
    startingPoints: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
    endingPoints: [{ x: 100, y: -351 }, { x: 300, y: -400 }, { x: 300, y: -400 }],
  });
  a.draw(path);
  console.log(path.toString());
  assertEquals(5, 5);
};

Deno.test(testArea);
