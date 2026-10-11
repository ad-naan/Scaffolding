import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from "@/shared/config/env";

const connectionString = env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined');
}

const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,// 连接池中连接的最大空闲时间（毫秒）
    connectionTimeoutMillis: 5_000,// 获取连接的最大等待时间（毫秒）
});

export const db = drizzle({ client: pool, logger: true });
export { pool };