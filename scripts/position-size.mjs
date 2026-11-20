#!/usr/bin/env node
// ChartForge position-size calculator — zero dependencies.
// Answers one question before any trade: how big can this position be
// so that losing it costs exactly the risk I chose, no more?
//
// Usage:
//   node position-size.mjs --mode fx --balance 1000 --risk-pct 1 \
//     --direction long --entry 1.0850 --stop 1.0820
//   node position-size.mjs --mode units --balance 1000 --risk-pct 1 \
//     --direction long --entry 150 --stop 145 --tp 160
//
// Modes:
//   fx    — forex pairs. Size is in standard lots. Needs --pip-size
//           (0.0001 for most pairs, 0.01 for JPY pairs) and
//           --pip-value (USD per pip per standard lot, default 10).
//   units — anything priced in currency (SOL, gold, stocks). Size is
//           in units of the asset (coins, ounces, shares).
//
// The math is deliberately boring: risk amount divided by the distance
// to the stop. A position size is a risk decision, not a prediction.

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) throw new Error(`unexpected argument: ${a}`);
    const key = a.slice(2);
    const val = argv[i + 1];
    if (val === undefined || val.startsWith("--")) {
      throw new Error(`missing value for --${key}`);
    }
    out[key] = val;
    i++;
  }
  return out;
}

function num(args, key, fallback) {
  if (args[key] === undefined) {
    if (fallback === undefined) throw new Error(`missing --${key}`);
    return fallback;
  }
  const v = Number(args[key]);
  if (!Number.isFinite(v)) throw new Error(`--${key} must be a number`);
  return v;
}

function calc(args) {
  const mode = args.mode || "units";
  if (mode !== "fx" && mode !== "units") {
    throw new Error(`--mode must be fx or units, got ${mode}`);
  }
  const balance = num(args, "balance");
  const riskPct = num(args, "risk-pct");
  const entry = num(args, "entry");
  const stop = num(args, "stop");
  const direction = args.direction || "long";
  if (direction !== "long" && direction !== "short") {
    throw new Error(`--direction must be long or short, got ${direction}`);
  }
  if (balance <= 0) throw new Error("balance must be positive");
  if (riskPct <= 0 || riskPct > 100) throw new Error("risk-pct must be between 0 and 100");
  if (direction === "long" && stop >= entry) {
    throw new Error("for a long, the stop must be BELOW the entry");
  }
  if (direction === "short" && stop <= entry) {
    throw new Error("for a short, the stop must be ABOVE the entry");
  }

  const riskAmount = balance * (riskPct / 100);
  const stopDistance = Math.abs(entry - stop);
  const tp = args.tp === undefined ? null : Number(args.tp);
  if (tp !== null && !Number.isFinite(tp)) throw new Error("--tp must be a number");
  if (tp !== null) {
    if (direction === "long" && tp <= entry) throw new Error("for a long, TP must be ABOVE the entry");
    if (direction === "short" && tp >= entry) throw new Error("for a short, TP must be BELOW the entry");
  }

  let size, sizeUnit, riskPerUnit, reward = null, rr = null;
  if (mode === "fx") {
    const pipSize = num(args, "pip-size", 0.0001);
    const pipValue = num(args, "pip-value", 10);
    if (pipSize <= 0) throw new Error("pip-size must be positive");
    if (pipValue <= 0) throw new Error("pip-value must be positive");
    const stopPips = stopDistance / pipSize;
    const rawLots = riskAmount / (stopPips * pipValue);
    size = Math.floor(rawLots * 100) / 100; // round DOWN to 0.01 lots
    sizeUnit = "lots";
    riskPerUnit = stopPips * pipValue;
    if (tp !== null) {
      const tpPips = Math.abs(tp - entry) / pipSize;
      reward = size * tpPips * pipValue;
      rr = reward / (size * riskPerUnit);
    }
    return { mode, direction, balance, riskPct, riskAmount, entry, stop,
      stopPips: round(stopPips), size, sizeUnit, pipSize, pipValue,
      actualRisk: round(size * riskPerUnit), tp, reward: round(reward), rr: round(rr) };
  }

  // units mode
  size = riskAmount / stopDistance;
  sizeUnit = "units";
  riskPerUnit = stopDistance;
  if (tp !== null) {
    reward = size * Math.abs(tp - entry);
    rr = reward / riskAmount;
  }
  return { mode, direction, balance, riskPct, riskAmount, entry, stop,
    stopDistance, size: round(size, 4), sizeUnit,
    actualRisk: round(size * riskPerUnit), tp, reward: round(reward), rr: round(rr) };
}

function round(v, places = 2) {
  if (v === null || v === undefined) return null;
  const f = Math.pow(10, places);
  return Math.round(v * f) / f;
}

function main() {
  try {
    const r = calc(parseArgs(process.argv.slice(2)));
    const lines = [
      `balance: $${r.balance} | risk: ${r.riskPct}% = $${r.riskAmount}`,
      `direction: ${r.direction} | entry: ${r.entry} | stop: ${r.stop}`,
    ];
    if (r.mode === "fx") {
      lines.push(`stop distance: ${r.stopPips} pips (${r.pipSize} pip size, $${r.pipValue}/pip/lot)`);
    } else {
      lines.push(`stop distance: ${r.stopDistance} price units`);
    }
    lines.push(`position size: ${r.size} ${r.sizeUnit} (rounded down)`);
    lines.push(`if stopped out, you lose: $${r.actualRisk}`);
    if (r.tp !== null) {
      lines.push(`take profit: ${r.tp} | if hit, you gain: $${r.reward} | reward:risk = ${r.rr}R`);
    }
    console.log(lines.join("\n"));
  } catch (e) {
    console.error(`error: ${e.message}`);
    process.exit(1);
  }
}

export { calc };
if (import.meta.url === `file://${process.argv[1]}`) main();
