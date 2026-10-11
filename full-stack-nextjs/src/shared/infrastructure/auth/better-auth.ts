import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { APIError } from "better-auth/api";
import {
    user,
    session,
    account,
    verification,
} from "@/modules/users/infrastructure/persistence/auth-schema";

import { env } from "@/shared/config/env";
import { db, pool } from "@/shared/infrastructure/database/client";

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

    databaseHooks: {
        session: {
            create: {
                before: async (newSession) => {
                    const result = await pool.query<{ status: string }>(
                        'SELECT status FROM public."user" WHERE id = $1 LIMIT 1',
                        [newSession.userId],
                    );

                    const existingUser = result.rows[0];

                    if (existingUser?.status !== "active") {
                        throw new APIError("FORBIDDEN", {
                            message: "当前账号不可用",
                        });
                    }

                    return {
                        data: newSession,
                    };
                },
            },
        },
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