import { test } from "node:test";
import assert from "node:assert/strict";
import { subtract } from "../src/index.js";

test("subtract returns the difference of two numbers", () => {
  assert.equal(subtract(5, 3), 2);
});
