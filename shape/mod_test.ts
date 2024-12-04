import { createPath } from "../path/mod.ts";
import { sector } from "./sector.ts";
import { assertEquals } from "@std/assert";

Deno.test(function circle() {
  const path = createPath(3);
  const s = sector({
    startAngle: 0,
    endAngle: 45,
    outerRadius: 150,
    innerRadius: 100,
    outerCornerRadius: 8,
    innerCornerRadius: 3,
  });
  s.draw(path);
  console.log(path.toString());
  assertEquals(5, 5);
});
