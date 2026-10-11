/**
 * 统一 API 响应结构。
 *
 * 这里只负责定义响应格式和构造响应数据，
 * 不负责 HTTP 状态码、异常捕获或 Next.js Response。
 */

/** 成功响应 */
export interface ApiSuccess<T> {
    success: true;
    data: T;
    meta: Record<string, unknown> | null;
}

/** 失败响应 */
export interface ApiFailure {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

/** 统一 API 响应类型 */
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** 构造成功响应 */
export function apiSuccess<T>(
    data: T,
    meta: Record<string, unknown> | null = null,
): ApiSuccess<T> {
    return {
        success: true,
        data,
        meta,
    };
}

/** 构造失败响应 */
export function apiFailure(
    code: string,
    message: string,
    details?: unknown,
): ApiFailure {
    return {
        success: false,
        error: {
            code,
            message,
            ...(details !== undefined ? { details } : {}),
        },
    };
}