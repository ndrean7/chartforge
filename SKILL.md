---
name: chartforge
description: Turn a chart into a trade plan you can defend — map support and resistance, read market structure, check the setup against a pre-trade checklist, size the position from the risk you chose, and write the plan down before you enter. Built from a real copy-signal record: 34 months, +5,511.4 pips on Traders Family. Use when you need a second opinion on a setup, a position size, or a written plan for a trade.
summary: Read the chart, size the risk, write the plan — no trade without all three.
version: 1.0.0
tags:
  - trading
  - technical-analysis
  - support-resistance
  - position-sizing
  - risk-management
  - trade-journal
keywords:
  - support resistance
  - market structure
  - position size
  - trade plan
  - trading checklist
  - risk per trade
use_cases:
  - Map support and resistance on a chart and read the market structure
  - Check a trade setup against a pre-trade checklist before entering
  - Size a position from account balance, risk percent and stop distance
  - Write a trade plan in signal format with entry, stop, target and invalidation
  - Journal trades and review pips per month like a signal record
hosts: []
docs_url: https://github.com/ndrean7/chartforge
---

# ChartForge

## Name

chartforge

## Description

A trade starts on the chart, not on the feeling. Give ChartForge a
pair and a chart — or just the levels you see — and it reads the
market the way a signal provider reads it: where is support, where is
resistance, is this a trend or a range, and where does the current
price sit inside that structure. Then it checks the setup against a
pre-trade checklist, sizes the position from the risk you chose, and
writes the whole thing down as a plan before any money moves. No
trade without all three: read the chart, size the risk, write the
plan.

The method is the one behind a real copy-signal record on Traders
Family (profile AndreFx081, card oxndrean7): 34 months, +5,511.4
pips, 60K USD profit, Rp77.000 per month, about 2,898.5 pips per
month on average. The full record, as shown on the card: 51 of 134
settled signals profitable (about 38% win rate), average
reward-to-risk 1:1.89, average take-profit 425.8 pips against an
average stop of 224.8 pips, and gold (XAUUSD) as the main pair —
71,639 USD across 105 deals. November 2026 was +3,360.3 pips
across 41 signals, but October 2026 was -967.4 pips across 60
signals: losing months happen, and the record shows them. Those
numbers are the record as shown on the Traders Family card — a
record, not a promise. No month, no signal and no setup in
this skill is guaranteed to repeat them. A signal is a plan with a
stop, not a certainty.

## How it works

### 1. Map the structure first

Before any direction is called, the skill maps the levels. Support
is where price stopped falling and turned up more than once;
resistance is where it stopped rising and turned down more than
once. A level touched once is a guess; a level that held twice is a
level. The skill also reads market structure: higher highs and
higher lows is an uptrend, lower highs and lower lows is a
downtrend, and price bouncing between two levels with no new high
or low is a range. The full method is in
`reference/market-structure-guide.md`.

The question that matters is not "up or down" but "where am I in
the structure": buying into resistance in an uptrend and buying at
support in a downtrend are two different trades, and only one of
them has the structure behind it.

### 2. Run the pre-trade checklist

No setup is taken until it passes the checklist in
`reference/pre-trade-checklist.md`: trend agrees with the
direction, the level is real (held more than once), there is a
confirmation (a close, a rejection wick, a break-and-retest),
the stop sits beyond the level and not inside the noise, the
target gives at least 1.5R, and the risk is sized before entry.
A setup that fails any line is not a trade — it is a watchlist
item. The checklist is the discipline: the author charts
support and resistance himself (Solana levels, gold, Indonesian
stocks) and the same "no checklist, no trade" rule applies to
his own charting.

### 3. Size from the risk, never from the feeling

Position size is a risk decision, not a prediction. The skill
runs `scripts/position-size.mjs`: give it the account balance,
the risk percent per trade, the entry and the stop, and it
returns the size that loses exactly that risk if the stop is
hit — rounded down, never up. Two modes: `fx` for forex pairs
(lots, from pips and pip value) and `units` for anything priced
in currency (coins, ounces, shares). Verified outputs:

```
$ node position-size.mjs --mode fx --balance 1000 --risk-pct 1 \
    --direction long --entry 1.0850 --stop 1.0820
balance: $1000 | risk: 1% = $10
stop distance: 30 pips
position size: 0.03 lots (rounded down)
if stopped out, you lose: $9

$ node position-size.mjs --mode units --balance 1000 --risk-pct 1 \
    --direction long --entry 150 --stop 145 --tp 160
stop distance: 5 price units
position size: 2 units
if stopped out, you lose: $10
take profit: 160 | if hit, you gain: $20 | reward:risk = 2R
```

The rule the calculator enforces: the stop goes where the idea
is wrong, and the size follows the stop. Never the other way
around — never shrink the stop to fit a bigger size.

### 4. Write the plan in signal format

Every trade is written down before entry, in the format in
`reference/trade-plan-template.md`: pair, direction, entry,
stop, target, size, risk in dollars, reward-to-risk, the
rationale in one or two sentences, and the invalidation — the
exact event that proves the idea wrong. The invalidation is
the most important line: a plan without it is a hope, and a
hope is not a trade. A worked example is in
`examples/sample-trade-plan.md` (illustrative levels, clearly
marked as an example, not a past call).

### 5. Journal it, then review the month

After the trade closes, it goes in the journal
(`reference/journal-template.md`): plan versus what actually
happened, pips won or lost, whether the plan was followed, and
one line on what to repeat or stop. At month end the journal
rolls up into a monthly review like the one in
`examples/journal-nov-2026.md`: total pips, number of signals,
win rate, biggest win and loss, and whether the month followed
the plan. That monthly review is exactly how the author's
Traders Family record is kept — November 2026: 3,360.3 pips,
41 signals — and it is the only honest way to know whether an
edge is real or imagined.

## What it does not do

- It never promises profit. Past pips are a record, not a
  guarantee, and any month can be negative.
- It never presents a signal as certain. Every plan carries its
  invalidation, and a stopped-out trade that followed the plan
  is a good trade.
- It is not financial advice. It is an analysis framework built
  from one trader's recorded practice. The buyer decides what,
  if anything, to trade with their own money, and should never
  risk money they cannot afford to lose.
- It does not read live prices or place trades. The user brings
  the chart and the levels; the skill brings the structure, the
  checklist, the math and the journal.
