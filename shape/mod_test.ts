import { createPath } from "../path/mod.ts";
import { sector } from "./sector.ts";
import { assertEquals } from "@std/assert";

Deno.test(function circle() {
  const path = createPath();
  const s = sector({
    startAngle: 45,
    endAngle: 310,
    outerRadius: 16,
    innerRadius: 10,
  });
  s.draw(path);
  console.log(path.toString());
  assertEquals(5, 5);
});
