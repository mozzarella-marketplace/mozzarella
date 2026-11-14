import type { LocaleCode } from "@/consts/locales";
import { getMessages } from "@/lib/i18n/messages";
import type { DeliveredProductTip } from "./delivery-response";

export type ProductTipDeliveryDependencies = {
  isSameOriginRequest: (request: Request) => boolean;
  requireAuth: () => Promise<{ id: string }>;
  getAuthFailureStatus: (error: unknown) => number | null;
  deliverNextProductTip: (
    userId: string,
    locale: LocaleCode,
  ) => Promise<DeliveredProductTip | null>;
  logError: (message: string) => void;
  locale: LocaleCode;
};

const jsonResponse = (body: object, status: number) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

// The request carries no input: the student comes from the server session and the locale from the server, so a
// browser can never choose whose rotation advances.
export const createProductTipDeliveryHandler =
  (dependencies: ProductTipDeliveryDependencies) =>
  async (request: Request): Promise<Response> => {
    const messages = getMessages().productTip.api;

    if (!dependencies.isSameOriginRequest(request)) {
      return jsonResponse({ error: messages.invalidRequest }, 403);
    }

    try {
      const user = await dependencies.requireAuth();
      const tip = await dependencies.deliverNextProductTip(
        user.id,
        dependencies.locale,
      );

      return jsonResponse({ tip }, 200);
    } catch (error) {
      const authFailureStatus = dependencies.getAuthFailureStatus(error);

      if (authFailureStatus !== null) {
        return jsonResponse({ error: messages.unavailable }, authFailureStatus);
      }

      dependencies.logError("Product tip delivery failed");
      return jsonResponse({ error: messages.deliveryFailed }, 500);
    }
  };
