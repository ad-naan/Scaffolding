import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import {
    user,
    session,
    account,
    verification,
} from "@/modules/users/infrastructure/persistence/auth-schema";

import { env } from "@/shared/config/env";
import { db } from "@/shared/infrastructure/database/client";

export const auth = betterAuth({
    appName: "Scaffolding",
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),

    emailAndPassword: {
        enabled: true,
    },

    trustedOrigins: [...env.BETTER_AUTH_TRUSTED_ORIGINS],
    user: {
        additionalFields: {
            status: {
                type: ["pending", "active", "suspended", "deleted"],
                required: true,
                defaultValue: "active",
                input: false,
            },
        },
    },
});