import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/config/env";
import { getMessages } from "@/lib/i18n/messages";
import { logger } from "@/lib/logging/logger";

const identifierSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{4}$/)
    .transform((identifier) => identifier.toUpperCase());

const loginSchema = z.object({
    classId: identifierSchema,
    userId: identifierSchema,
});

const tokenSchema = z
    .object({
        access_token: z.string().min(1),
        token_type: z.string().min(1),
        expires_in: z.number().int().nonnegative(),
        refresh_token: z.string().min(1).optional(),
        refresh_expires_in: z.number().int().nonnegative().optional(),
        id_token: z.string().min(1).optional(),
    })
    .passthrough();

export async function POST(request: Request) {
    const messages = getMessages().auth.login;
    let input: unknown;

    try {
        input = await request.json();
    } catch {
        return NextResponse.json({ error: messages.invalidInput }, { status: 400 });
    }

    const login = loginSchema.safeParse(input);

    if (!login.success) {
        return NextResponse.json({ error: messages.invalidInput }, { status: 400 });
    }

    if (
        !env.KEYCLOAK_ISSUER ||
        !env.KEYCLOAK_CLIENT_ID ||
        !env.KEYCLOAK_CLIENT_SECRET
    ) {
        logger.error("Keycloak login is not configured");
        return NextResponse.json({ error: messages.unavailable }, { status: 503 });
    }

    const username = `${login.data.classId}-${login.data.userId}`;
    const issuer = env.KEYCLOAK_ISSUER;
    const tokenEndpoint = new URL(
        "protocol/openid-connect/token",
        issuer.endsWith("/") ? issuer : `${issuer}/`,
    );

    try {
        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: env.KEYCLOAK_CLIENT_ID,
                client_secret: env.KEYCLOAK_CLIENT_SECRET,
                grant_type: "password",
                username,
                password: username,
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: messages.invalidCredentials },
                { status: 401 },
            );
        }

        const tokens = tokenSchema.safeParse(await response.json());

        if (!tokens.success) {
            logger.error("Keycloak returned an invalid token response");
            return NextResponse.json(
                { error: messages.unavailable },
                { status: 503 },
            );
        }

        return NextResponse.json(tokens.data, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch {
        logger.error("Keycloak token request failed");
        return NextResponse.json({ error: messages.unavailable }, { status: 503 });
    }
}
