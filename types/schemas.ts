import z from "zod";

const code = z
  .string("שדה חובה")
  .length(4, "קוד בעל 4 תווים")
  .regex(/^[0-9A-F]*$/, "מספרים ואותיות A-F בלבד");

export const loginSchema = z.object({
  "class-code": code,
  "user-code": code,
});

export type LoginSchema = z.infer<typeof loginSchema>;
