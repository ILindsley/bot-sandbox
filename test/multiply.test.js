import { test } from "node:test";
import assert from "node:assert/strict";
import { multiply } from "../src/index.js";

test("multiply returns the product of two numbers", () => {
  assert.equal(multiply(2, 3), 6);
});
