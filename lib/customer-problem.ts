import { z } from "zod";

const requiredText = z.string().trim().min(1);

export const customerProblemBriefSchema = z.strictObject({
  inputs: z.array(requiredText).min(1),
  outputs: z.array(requiredText).min(1),
  rules: z.array(requiredText).min(1),
  examples: z
    .array(
      z.strictObject({
        input: requiredText,
        output: requiredText,
        explanation: requiredText,
      }),
    )
    .min(1),
});

export type CustomerProblemBrief = z.infer<typeof customerProblemBriefSchema>;
