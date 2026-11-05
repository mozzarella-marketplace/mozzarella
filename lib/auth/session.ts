import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/config/env";
import type { KeycloakTokens } from "@/lib/auth/keycloak";

const ACCESS_TOKEN_COOKIE = "mozzarella_access_token";
const REFRESH_TOKEN_COOKIE = "mozzarella_refresh_token";

const tokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const getKeycloakTokens = async () => {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE)?.value,
    refreshToken: cookieStore.get(REFRESH_TOKEN_COOKIE)?.value,
  };
};

export const setKeycloakTokens = async (tokens: KeycloakTokens) => {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...tokenCookieOptions,
    maxAge: Math.max(tokens.expiresIn - 30, 1),
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...tokenCookieOptions,
    maxAge: tokens.refreshExpiresIn,
  });
};

export const clearKeycloakTokens = async () => {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, "", {
    ...tokenCookieOptions,
    maxAge: 0,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
    ...tokenCookieOptions,
    maxAge: 0,
  });
};
