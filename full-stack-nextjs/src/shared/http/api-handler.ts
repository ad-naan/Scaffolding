
import { ValidationError } from "@/shared/validation/validation-error";
import { ApiError } from "@/shared/http/api-error";
import { apiFailure, apiSuccess } from "@/shared/http/api-response";

type ApiHandler<Context = unknown> = (
    request: Request,
    context: Context,
) => unknown | Promise<unknown>;

type ActiveSession = {
    user: {
        id: string;
    };
    session: {
        id: string;
        userId: string;
    };
};

type AuthenticatedApiHandler<Context = unknown> = (
    request: Request,
    context: Context,
    session: ActiveSession,
) => unknown | Promise<unknown>;

/**
 * 统一处理业务 API 的返回值与异常。
 *
 * 仅用于自定义业务 API，不用于 Better Auth 路由。
 */
export function withApiHandler<Context = unknown>(
    handler: ApiHandler<Context>,
) {
    return async (
        request: Request,
        context: Context,
    ): Promise<Response> => {
        try {
            const data = await handler(request, context);

            return Response.json(apiSuccess(data), {
                status: 200,
            });
        } catch (error: unknown) {
            if (error instanceof ApiError) {
                return Response.json(
                    apiFailure(
                        error.code,
                        error.message,
                        error.details,
                    ),
                    {
                        status: error.status,
                    },
                );
            }

            if (error instanceof ValidationError) {
                return Response.json(
                    apiFailure(
                        "VALIDATION_ERROR",
                        "请求参数不合法",
                        {
                            issues: error.issues,
                        },
                    ),
                    {
                        status: 400,
                    },
                );
            }

            // 未知异常只记录在服务端，不向客户端返回内部错误详情。
            console.error("[API] Unexpected error:", error);

            return Response.json(
                apiFailure(
                    "INTERNAL_ERROR",
                    "服务器内部错误",
                ),
                {
                    status: 500,
                },
            );
        }
    };
}

/**
 * 处理需要登录且账号处于 active 状态的业务 API。
 *
 * 认证失败时复用 withApiHandler 的统一异常处理。
 * 业务处理函数可通过第三个参数访问当前会话。
 */
export function withAuthenticatedApiHandler<Context = unknown>(
    handler: AuthenticatedApiHandler<Context>,
) {
    return withApiHandler<Context>(
        async (request, context) => {
            const { requireActiveSession } = await import(
                "@/shared/infrastructure/auth/require-active-session"
            );

            const session = await requireActiveSession(request);

            return handler(request, context, session);
        },
    );
}
