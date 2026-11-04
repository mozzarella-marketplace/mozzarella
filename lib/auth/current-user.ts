import "server-only";
import { redirect } from "next/navigation";
import { getSessionUrl } from "@/lib/auth/return-to";
import {
  refreshKeycloakToken,
  requestKeycloakSubject,
} from "@/lib/auth/keycloak";
import {
  clearKeycloakTokens,
  getKeycloakTokens,
  setKeycloakTokens,
} from "@/lib/auth/session";
import { env } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logging/logger";

export type CurrentUser = {
  id: string;
  classId: string;
  userId: string;
};

const findUserByAccessToken = async (
  accessToken: string | undefined,
): Promise<{ user: CurrentUser | null; invalidToken: boolean }> => {
  if (!accessToken) {
    return { user: null, invalidToken: true };
  }

  if (!env.KEYCLOAK_ISSUER) {
    logger.error("Keycloak session verification is not configured");
    throw new AuthError(503, "Authentication service unavailable");
  }

  let subject: Awaited<ReturnType<typeof requestKeycloakSubject>>;

  try {
    subject = await requestKeycloakSubject({
      issuer: env.KEYCLOAK_ISSUER,
      accessToken,
    });
  } catch {
    logger.error("Keycloak session userinfo request failed");
    throw new AuthError(503, "Authentication service unavailable");
  }

  if (subject.kind === "invalid_token") {
    return { user: null, invalidToken: true };
  }

  if (subject.kind === "unavailable") {
    logger.error("Keycloak returned invalid session userinfo");
    throw new AuthError(503, "Authentication service unavailable");
  }

  let user: CurrentUser | null;

  try {
    user = await prisma.user.findUnique({
      where: {
        keycloakUserId: subject.subject,
        class: { is: {} },
      },
      select: { id: true, classId: true, userId: true },
    });
  } catch {
    logger.error("Application session user lookup failed");
    throw new AuthError(503, "Authentication service unavailable");
  }

  return { user, invalidToken: false };
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const { accessToken } = await getKeycloakTokens();
  const result = await findUserByAccessToken(accessToken);
  return result.user;
};

export const getPageUser = async (
  returnTo = "/",
): Promise<CurrentUser | null> => {
  const user = await getCurrentUser();

  if (user) {
    return user;
  }

  const { refreshToken } = await getKeycloakTokens();

  if (refreshToken) {
    redirect(getSessionUrl(returnTo));
  }

  return null;
};

export class AuthError extends Error {
  constructor(
    public readonly status: 401 | 403 | 503,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const requireAuth = async () => {
  const tokens = await getKeycloakTokens();
  const current = await findUserByAccessToken(tokens.accessToken);

  if (current.user) {
    return current.user;
  }

  if (!current.invalidToken || !tokens.refreshToken) {
    throw new AuthError(401, "Authentication required");
  }

  if (
    !env.KEYCLOAK_ISSUER ||
    !env.KEYCLOAK_CLIENT_ID ||
    !env.KEYCLOAK_CLIENT_SECRET
  ) {
    logger.error("Keycloak session refresh is not configured");
    throw new AuthError(503, "Authentication service unavailable");
  }

  let refreshed: Awaited<ReturnType<typeof refreshKeycloakToken>>;

  try {
    refreshed = await refreshKeycloakToken({
      issuer: env.KEYCLOAK_ISSUER,
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      refreshToken: tokens.refreshToken,
    });
  } catch {
    logger.error("Keycloak session refresh request failed");
    throw new AuthError(503, "Authentication service unavailable");
  }

  if (refreshed.kind === "invalid_session") {
    await clearKeycloakTokens();
    throw new AuthError(401, "Authentication required");
  }

  if (
    refreshed.kind === "unavailable" ||
    refreshed.kind === "invalid_credentials"
  ) {
    logger.error("Keycloak returned an invalid session refresh response");
    throw new AuthError(503, "Authentication service unavailable");
  }

  try {
    await setKeycloakTokens(refreshed.tokens);
  } catch {
    logger.error("Keycloak refreshed token cookie setup failed");
    await clearKeycloakTokens();
    throw new AuthError(503, "Authentication service unavailable");
  }

  const renewedUser = await findUserByAccessToken(refreshed.tokens.accessToken);

  if (!renewedUser.user) {
    await clearKeycloakTokens();
    throw new AuthError(401, "Authentication required");
  }

  return renewedUser.user;
};
