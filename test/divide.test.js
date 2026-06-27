import { test } from "node:test";
import assert from "node:assert/strict";
import { divide } from "../src/index.js";

test("divide divides two numbers", () => {
  assert.equal(divide(6, 3), 2);
});
