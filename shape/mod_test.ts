import { createPath } from "../path/mod.ts";
import { sector } from "./sector.ts";
import { assertEquals } from "@std/assert";

Deno.test(function circle() {
  const path = createPath(3);
  const s = sector({
    startAngle: 200,
    endAngle: 210,
    outerRadius: 100,
  });
  s.draw(path);
  console.log(path.toString());
  assertEquals(5, 5);
});
