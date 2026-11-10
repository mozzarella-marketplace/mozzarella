import assert from "node:assert/strict";
import { test } from "node:test";
import { ZodError } from "zod";
import { buildCustomerConversationSystemPrompt } from "@/lib/ai/customer-conversation-prompt";
import {
  customerProblemBriefSchema,
  type CustomerProblemBrief,
} from "@/lib/customer-problem";

const customer = {
  name: "יעל",
  role: "מנהלת",
  businessName: "סדנת השכונה",
  city: "חיפה",
  summary: "אני צריכה לדעת אם נשאר מקום לקבוצה שמבקשת להירשם.",
  topic: "בדיקת מקום לקבוצה",
  difficulty: "beginner",
};

const problemBrief: CustomerProblemBrief = {
  inputs: ["מספר המקומות הפנויים ומספר האנשים בקבוצה, שניהם שלמים חיוביים."],
  outputs: ["אישור הרשמה ומספר המקומות שיישארו, או הודעה שאין מספיק מקום."],
  rules: ["מאשרים רק אם כל הקבוצה נכנסת; מספר המקומות לא משתנה כשמסרבים."],
  examples: [
    {
      input: "נותרו 4 מקומות וקבוצה של 4 אנשים מבקשת להירשם.",
      output: "ההרשמה אושרה; נותרו 0 מקומות.",
      explanation: "מותר לאשר קבוצה שממלאת בדיוק את כל המקומות שנותרו.",
    },
  ],
};

test("rejects incomplete or malformed persisted problem briefs before building a prompt", () => {
  const invalidBriefs: unknown[] = [
    { inputs: problemBrief.inputs },
    { ...problemBrief, outputs: [] },
    { ...problemBrief, rules: ["   "] },
    {
      ...problemBrief,
      examples: [{ input: "4 מקומות", output: "אושר" }],
    },
    { ...problemBrief, implementation: "hidden solution" },
    {
      ...problemBrief,
      examples: [{ ...problemBrief.examples[0], code: "hidden solution" }],
    },
  ];

  for (const invalidBrief of invalidBriefs) {
    assert.throws(
      () =>
        buildCustomerConversationSystemPrompt({
          ...customer,
          problemBrief: invalidBrief,
        }),
      ZodError,
    );
  }
});

test("preserves canonical inputs, outputs, rules, and example behavior in the customer prompt", () => {
  const prompt = buildCustomerConversationSystemPrompt({
    ...customer,
    problemBrief,
  });
  const facts = [
    ...problemBrief.inputs,
    ...problemBrief.outputs,
    ...problemBrief.rules,
    ...problemBrief.examples.flatMap((example) => Object.values(example)),
  ];

  for (const fact of facts) {
    assert.ok(prompt.includes(fact), `Missing scenario fact: ${fact}`);
  }

  assert.match(prompt, /Do not name or explain programming techniques/);
  assert.match(prompt, /Reveal relevant details gradually/);
  assert.match(
    prompt,
    /Do not add mandatory inputs, outputs, rules, or features/,
  );
});

test("supports existing customer records without a problem brief", () => {
  const prompt = buildCustomerConversationSystemPrompt({
    ...customer,
    problemBrief: null,
  });

  assert.ok(prompt.includes(customer.summary));
  assert.match(prompt, /No detailed problem brief is available/);
  assert.match(prompt, /do not invent mandatory requirements/);
});

test("normalizes surrounding whitespace in valid scenario text", () => {
  const parsed = customerProblemBriefSchema.parse({
    ...problemBrief,
    inputs: ["  אין קלט מהמשתמש.  "],
  });

  assert.deepEqual(parsed.inputs, ["אין קלט מהמשתמש."]);
});
