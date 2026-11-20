# Worked example: reading SOL structure

> ILLUSTRATIVE EXAMPLE. The levels below are invented to teach the
> method — they are NOT a past trade, NOT a past call, and NOT a
> prediction about SOL. Never treat an example in this skill as a
> signal.

## The chart as described

SOL on the 4-hour timeframe. Price has been making higher highs and
higher lows for two weeks: 120 → 138 → 132 → 150 → 143 → 162.
Support levels: 143 (held twice), 132 (held twice). Resistance:
162 (rejected once), 175 (the next level up, untested).

## Step 1 — structure

Higher highs and higher lows: this is an uptrend. The trade is to
buy a pullback to support, not to chase the high at 162.

## Step 2 — where is price now

Price pulled back to 145, just above the 143 support. That is the
long side with the structure behind it. Buying at 162 into
resistance would be the wrong side of the same chart.

## Step 3 — checklist

- Structure: uptrend, one sentence. Pass.
- Level: 143 held twice. Pass.
- Confirmation: a 4H close back above 145 after a wick to 143.
  Pass.
- Stop: below the support zone, at 140 — beyond the level, outside
  the noise. The idea is wrong if 4H closes below 140.
- Target: the next resistance, 162. Distance from 145 to 162 is 17;
  distance from 145 to 140 is 5. Reward:risk is 3.4R — above the
  1.5R minimum. Pass.

## Step 4 — size

Account $1,000, risk 1% = $10, entry 145, stop 140, target 162:

```
$ node scripts/position-size.mjs --mode units --balance 1000 \
    --risk-pct 1 --direction long --entry 145 --stop 140 --tp 162
position size: 2 units
if stopped out, you lose: $10
take profit: 162 | if hit, you gain: $34 | reward:risk = 3.4R
```

## Step 5 — the plan

Pair: SOL/USD. Direction: long. Entry 145, stop 140, target 162,
size 2 units, risk $10 (1%), reward $34 (3.4R). Rationale: uptrend
pullback to a twice-held support with a confirming close.
Invalidation: a 4H close below 140 — if that happens, the structure
broke and the idea is wrong, no matter how it feels.

If price instead breaks below 140 without the confirmation, there is
no trade. The checklist failing is the plan working.
