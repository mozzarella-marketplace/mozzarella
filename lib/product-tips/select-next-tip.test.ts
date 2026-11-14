import assert from "node:assert/strict";
import test from "node:test";
import { selectNextTip } from "./select-next-tip";

const bank = [10, 20, 30, 40].map((displayOrder) => ({
  key: `tip-${displayOrder}`,
  displayOrder,
}));

const deliverSequence = (tips: typeof bank, count: number) => {
  const delivered: string[] = [];
  let lastDisplayOrder: number | null = null;

  for (let index = 0; index < count; index += 1) {
    const tip: (typeof tips)[number] | null = selectNextTip(
      tips,
      lastDisplayOrder,
    );
    assert.ok(tip);
    delivered.push(tip.key);
    lastDisplayOrder = tip.displayOrder;
  }

  return delivered;
};

test("shows every active tip once before any repeats, in display order", () => {
  assert.deepEqual(deliverSequence(bank, 4), [
    "tip-10",
    "tip-20",
    "tip-30",
    "tip-40",
  ]);
});

test("starts a new cycle without repeating the last tip", () => {
  const delivered = deliverSequence(bank, 6);

  assert.deepEqual(delivered.slice(4), ["tip-10", "tip-20"]);
  for (let index = 1; index < delivered.length; index += 1) {
    assert.notEqual(delivered[index], delivered[index - 1]);
  }
});

test("does not depend on the order active tips are passed in", () => {
  assert.equal(selectNextTip([...bank].reverse(), 20)?.key, "tip-30");
});

test("skips tips that are disabled or deleted, including the last one shown", () => {
  const withoutThirty = bank.filter((tip) => tip.displayOrder !== 30);

  assert.equal(selectNextTip(withoutThirty, 20)?.key, "tip-40");
  assert.equal(selectNextTip(withoutThirty, 30)?.key, "tip-40");
});

test("shows a tip inserted before the cursor in the next cycle", () => {
  const withInserted = [...bank, { key: "tip-15", displayOrder: 15 }];

  assert.equal(selectNextTip(withInserted, 30)?.key, "tip-40");
  assert.equal(selectNextTip(withInserted, 40)?.key, "tip-10");
  assert.equal(selectNextTip(withInserted, 10)?.key, "tip-15");
});

test("returns null when no tips are active", () => {
  assert.equal(selectNextTip([], null), null);
  assert.equal(selectNextTip([], 20), null);
});

test("repeats the only active tip, because non-repetition is impossible", () => {
  const single = [{ key: "only", displayOrder: 10 }];

  assert.equal(selectNextTip(single, null)?.key, "only");
  assert.equal(selectNextTip(single, 10)?.key, "only");
});
