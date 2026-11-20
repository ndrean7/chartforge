import { test } from "node:test";
import assert from "node:assert/strict";
import { calc } from "./position-size.mjs";

// FX: $1,000 balance, 1% risk = $10, 30-pip stop, $10/pip/lot.
// 10 / (30 * 10) = 0.0333 lots, rounded DOWN to 0.03.
test("fx sizing rounds down to 0.01 lots", () => {
  const r = calc({
    mode: "fx", balance: "1000", "risk-pct": "1", direction: "long",
    entry: "1.0850", stop: "1.0820",
  });
  assert.equal(r.riskAmount, 10);
  assert.equal(r.stopPips, 30);
  assert.equal(r.size, 0.03);
  assert.equal(r.actualRisk, 9);
});

test("fx sizing with TP reports reward:risk", () => {
  const r = calc({
    mode: "fx", balance: "2000", "risk-pct": "2", direction: "short",
    entry: "1.0850", stop: "1.0880", tp: "1.0790",
  });
  assert.equal(r.riskAmount, 40);
  assert.equal(r.size, 0.13);
  assert.equal(r.reward, 78);
  assert.equal(r.rr, 2);
});

// Units: $1,000 balance, 1% risk = $10, entry 150, stop 145.
// 10 / 5 = 2 units. TP 160 gives $20 = 2R.
test("units sizing divides risk by stop distance", () => {
  const r = calc({
    mode: "units", balance: "1000", "risk-pct": "1", direction: "long",
    entry: "150", stop: "145", tp: "160",
  });
  assert.equal(r.riskAmount, 10);
  assert.equal(r.size, 2);
  assert.equal(r.actualRisk, 10);
  assert.equal(r.reward, 20);
  assert.equal(r.rr, 2);
});

test("stop on the wrong side of entry is rejected", () => {
  assert.throws(
    () => calc({ mode: "units", balance: "1000", "risk-pct": "1",
      direction: "long", entry: "150", stop: "155" }),
    /stop must be BELOW the entry/
  );
  assert.throws(
    () => calc({ mode: "units", balance: "1000", "risk-pct": "1",
      direction: "short", entry: "150", stop: "145" }),
    /stop must be ABOVE the entry/
  );
});
