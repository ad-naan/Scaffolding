import { ValidationError } from "@/shared/validation/validation-error";

import { ApiError } from "@/shared/http/api-error";
import { apiFailure, apiSuccess } from "@/shared/http/api-response";

/**
 * 普通业务 API 的处理函数。
 *
 * Context 用于兼容 Next.js 动态路由参数。
 */
type ApiHandler<Context = unknown> = (
    request: Request,
    context: Context,
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