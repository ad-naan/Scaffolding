import { ApiError } from "@/shared/http/api-error";
import { auth } from "@/shared/infrastructure/auth/better-auth";
import { pool } from "@/shared/infrastructure/database/client";

/**
 * 获取当前请求的有效会话。
 *
 * 要求用户已登录，且账号状态必须为 active。
 * 用于受保护的业务 API，不用于 Better Auth 自身路由。
 */
export async function requireActiveSession(request: Request) {
    const currentSession = await auth.api.getSession({
        headers: request.headers,
    });

    if (!currentSession) {
        throw new ApiError(
            "UNAUTHENTICATED",
            "请先登录",
        );
    }

    const result = await pool.query<{ status: string }>(
        'SELECT status FROM public."user" WHERE id = $1 LIMIT 1',
        [currentSession.user.id],
    );

    if (result.rows[0]?.status !== "active") {
        throw new ApiError(
            "FORBIDDEN",
            "当前账号不可用",
        );
    }

    return currentSession;
}
