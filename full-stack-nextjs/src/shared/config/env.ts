function getRequiredEnv(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`缺少必需的环境变量：${name}`);
    }

    return value;
}

function getUrl(name: string, value: string): string {
    let url: URL;

    try {
        url = new URL(value);
    } catch {
        throw new Error(`环境变量 ${name} 不是有效的 URL`);
    }

    if (url.protocol !== "https:" && url.hostname !== "localhost") {
        throw new Error(`${name} 必须使用 HTTPS，开发环境可使用 localhost`);
    }

    return value;
}

function getTrustedOrigins(): string[] {
    const value = getRequiredEnv("BETTER_AUTH_TRUSTED_ORIGINS");

    const origins = value.split(",").map((item) => item.trim());

    if (origins.some((origin) => !origin)) {
        throw new Error("BETTER_AUTH_TRUSTED_ORIGINS 包含空来源");
    }

    for (const origin of origins) {
        let url: URL;

        try {
            url = new URL(origin);
        } catch {
            throw new Error(`无效的可信来源：${origin}`);
        }

        if (
            url.origin !== origin ||
            (url.protocol !== "https:" && url.hostname !== "localhost")
        ) {
            throw new Error(`无效的可信来源：${origin}`);
        }
    }

    if (new Set(origins).size !== origins.length) {
        throw new Error("BETTER_AUTH_TRUSTED_ORIGINS 存在重复来源");
    }

    return origins;
}

function loadEnv() {
    const databaseUrl = getRequiredEnv("DATABASE_URL");

    let database: URL;

    try {
        database = new URL(databaseUrl);
    } catch {
        throw new Error("DATABASE_URL 不是有效的 URL");
    }

    if (
        database.protocol !== "postgres:" &&
        database.protocol !== "postgresql:"
    ) {
        throw new Error("DATABASE_URL 必须使用 PostgreSQL 协议");
    }

    const secret = getRequiredEnv("BETTER_AUTH_SECRET");

    if (Buffer.byteLength(secret, "utf8") < 32) {
        throw new Error("BETTER_AUTH_SECRET 至少需要 32 字节");
    }

    const betterAuthUrl = getUrl(
        "BETTER_AUTH_URL",
        getRequiredEnv("BETTER_AUTH_URL"),
    );

    if (new URL(betterAuthUrl).origin !== betterAuthUrl) {
        throw new Error("BETTER_AUTH_URL 只能包含协议、主机和端口");
    }

    return Object.freeze({
        DATABASE_URL: databaseUrl,
        BETTER_AUTH_SECRET: secret,
        BETTER_AUTH_URL: betterAuthUrl,
        BETTER_AUTH_TRUSTED_ORIGINS: Object.freeze(getTrustedOrigins()),
    });
}

export const env = loadEnv();