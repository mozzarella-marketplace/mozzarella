import assert from "node:assert/strict";
import { test } from "node:test";
import customers from "../prisma/customers.json";
import { customerProblemBriefSchema } from "@/lib/customer-problem";

test("catalog contains 20 distinct, active customers with complete problem briefs", () => {
  assert.equal(customers.length, 20);

  for (const field of ["id", "name", "businessName"] as const) {
    assert.equal(
      new Set(customers.map((customer) => customer[field])).size,
      20,
    );
  }

  for (const customer of customers) {
    assert.equal(customer.isActive, true);
    assert.ok(
      customerProblemBriefSchema.safeParse(customer.problemBrief).success,
    );
  }
});

test("rewards consistently reflect difficulty across the catalog", () => {
  const rewards: Record<string, number> = {
    beginner: 80,
    intermediate: 130,
    advanced: 180,
  };

  assert.deepEqual(
    new Set(customers.map(({ difficulty }) => difficulty)),
    new Set(Object.keys(rewards)),
  );

  for (const customer of customers) {
    assert.equal(customer.rewardCoins, rewards[customer.difficulty]);
  }
});

test("student scenario text does not name programming techniques", () => {
  const techniqueNames =
    /רקורסי|לולאות|לולאה|מערכים|משתנים|אלגורית|מתודות|פונקציות|תנאים ולוגיקה|recurs|algorithm|if\s*\/\s*else/i;

  for (const customer of customers) {
    const text = JSON.stringify({
      topic: customer.topic,
      summary: customer.summary,
      problemBrief: customer.problemBrief,
    });

    assert.doesNotMatch(text, techniqueNames, customer.id);
  }
});
