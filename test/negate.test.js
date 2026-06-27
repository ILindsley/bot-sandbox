import { test } from "node:test";
import assert from "node:assert/strict";
import { negate } from "../src/index.js";

test("negate returns the negation of a number", () => {
  assert.equal(negate(5), -5);
  assert.equal(negate(-3), 3);
});
