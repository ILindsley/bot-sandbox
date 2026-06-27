import { test } from "node:test";
import assert from "node:assert/strict";
import { power } from "../src/index.js";

test("power raises base to exponent", () => {
  assert.equal(power(2, 3), 8);
  assert.equal(power(5, 0), 1);
  assert.equal(power(2, -1), 0.5);
});
