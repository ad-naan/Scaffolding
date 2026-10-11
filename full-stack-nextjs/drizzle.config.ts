// 将schema源码和迁移文件分开，迁移文件重定向输出到drizzle目录下

import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("缺少必需的环境变量：DATABASE_URL");
}

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/modules/users/infrastructure/persistence/auth-schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: databaseUrl,
    },
    strict: true,
    verbose: true,
});
