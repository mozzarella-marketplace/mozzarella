import { z } from "zod";

export const deliveredProductTipSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  action: z.string().min(1),
});

// A null tip means the locale has no active tips, which the UI shows as an explicit unavailable state.
export const productTipDeliveryResponseSchema = z.object({
  tip: deliveredProductTipSchema.nullable(),
});

export type DeliveredProductTip = z.infer<typeof deliveredProductTipSchema>;
