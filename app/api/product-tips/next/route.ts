import { defaultLocale } from "@/consts/locales";
import { isSameOriginRequest } from "@/lib/auth/csrf";
import { AuthError, requireAuth } from "@/lib/auth/current-user";
import { logger } from "@/lib/logging/logger";
import { deliverNextProductTip } from "@/lib/product-tips/delivery";
import { createProductTipDeliveryHandler } from "@/lib/product-tips/delivery-handler";

export const POST = createProductTipDeliveryHandler({
  isSameOriginRequest,
  requireAuth,
  getAuthFailureStatus: (error) =>
    error instanceof AuthError ? error.status : null,
  deliverNextProductTip,
  logError: (message) => logger.error(message),
  locale: defaultLocale.code,
});
