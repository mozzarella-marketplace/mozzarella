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

const background = {
  currentWorkflow: "אני רושמת את מספר המקומות שנותרו במחברת ליד הקבלה.",
  painPoint: "בזמן ההרשמה אני צריכה לעצור ולחשב אם כל הקבוצה נכנסת.",
  communicationStyle:
    "אני מדברת בקצרה ובסבלנות ומשתמשת במחשב בעיקר לכתיבת הודעות.",
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

test("includes the supplied customer background alongside the unchanged business requirements", () => {
  const briefWithBackground = { ...problemBrief, background };
  const parsed = customerProblemBriefSchema.parse(briefWithBackground);
  const prompt = buildCustomerConversationSystemPrompt({
    ...customer,
    problemBrief: briefWithBackground,
  });

  assert.deepEqual(parsed, briefWithBackground);
  for (const fact of Object.values(background)) {
    assert.ok(prompt.includes(fact), `Missing customer background: ${fact}`);
  }
  assert.ok(prompt.includes(problemBrief.rules[0]));
});

test("rejects supplied backgrounds with missing, blank, or unsupported fields", () => {
  const invalidBackgrounds: unknown[] = [
    null,
    {},
    { currentWorkflow: background.currentWorkflow },
    { ...background, painPoint: "  " },
    { ...background, communicationStyle: 3 },
    { ...background, biography: "unsupported personal details" },
  ];

  for (const invalidBackground of invalidBackgrounds) {
    assert.throws(
      () =>
        buildCustomerConversationSystemPrompt({
          ...customer,
          problemBrief: { ...problemBrief, background: invalidBackground },
        }),
      ZodError,
    );
  }
});

test("supports existing structured briefs without inventing a background", () => {
  const parsed = customerProblemBriefSchema.parse(problemBrief);
  const prompt = buildCustomerConversationSystemPrompt({
    ...customer,
    problemBrief,
  });

  assert.equal(parsed.background, undefined);
  assert.ok(prompt.includes(problemBrief.rules[0]));
  assert.ok(!prompt.includes(background.currentWorkflow));
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
    background: {
      ...background,
      currentWorkflow: `  ${background.currentWorkflow}  `,
      painPoint: `  ${background.painPoint}  `,
      communicationStyle: `  ${background.communicationStyle}  `,
    },
    inputs: ["  אין קלט מהמשתמש.  "],
  });

  assert.deepEqual(parsed.background, background);
  assert.deepEqual(parsed.inputs, ["אין קלט מהמשתמש."]);
});
