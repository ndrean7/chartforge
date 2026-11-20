# ChartForge

Read the chart, size the risk, write the plan — no trade without all
three.

ChartForge turns a chart into a trade plan you can defend: map
support and resistance, read the market structure, run the setup
through a pre-trade checklist, size the position from the risk you
chose, and write the plan down in signal format before you enter.

Built from a real copy-signal record: 34 months, +5,511.4 pips, 60K USD
profit, about 2,898.5 pips per month on average, and November 2026
at 3,360.3 pips across 41 signals. The full record: 51 of 134
settled signals profitable (about 38% win rate), average
reward-to-risk 1:1.89, average take-profit 425.8 pips against an
average stop of 224.8 pips, gold (XAUUSD) as the main pair (71,639
USD, 105 deals), and October 2026 at -967.4 pips — losing months
happen. September 2026 was +2,898.5 pips, January 2026 was +320.0
pips on a single signal, and June 2026 was -100.0 pips on a single
signal — a small losing month. Those numbers are the record as shown on the copy-signal
card — a record, not a promise.

## What is inside

- `SKILL.md` — the full method: structure, checklist, sizing,
  plan, journal.
- `reference/market-structure-guide.md` — support/resistance,
  trend vs range, where price sits in the structure.
- `reference/pre-trade-checklist.md` — every line must pass before
  entry, or it is a watchlist item.
- `reference/trade-plan-template.md` — the plan format, with the
  invalidation line that makes it a plan.
- `reference/journal-template.md` — journal rows and the monthly
  review that keeps the record honest.
- `reference/example-analysis-sol.md` — a worked SOL structure read
  (illustrative levels, clearly marked).
- `scripts/position-size.mjs` — dependency-free position-size
  calculator (Node). FX lots mode and units mode.
- `scripts/position-size.test.mjs` — 4/4 tests passing.
- `examples/journal-nov-2026.md` — the author's real November 2026
  monthly review.
- `examples/sample-trade-plan.md` — a filled-in sample plan
  (illustrative, clearly marked).

## Verified outputs

```
$ node scripts/position-size.mjs --mode fx --balance 1000 --risk-pct 1 \
    --direction long --entry 1.0850 --stop 1.0820
position size: 0.03 lots (rounded down)
if stopped out, you lose: $9

$ node scripts/position-size.mjs --mode units --balance 1000 --risk-pct 1 \
    --direction long --entry 150 --stop 145 --tp 160
position size: 2 units
if stopped out, you lose: $10
take profit: 160 | if hit, you gain: $20 | reward:risk = 2R
```

## Honest note

This is an analysis framework, not financial advice. Past pips are a
record, not a guarantee — any month can be negative, and no signal
in this skill is presented as certain. The skill does not read live
prices or place trades. Never risk money you cannot afford to lose.

## Links

- Agensi listing: https://www.agensi.io/skills/chartforge
- Author: 0xndrean7

## License

MIT — see LICENSE.
