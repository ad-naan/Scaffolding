/**
 * 统一 API 错误定义。
 *
 * 负责描述错误码、HTTP 状态码和对外错误消息。
 * 不依赖 Next.js，也不负责生成 HTTP 响应。
 */

export const API_ERROR_STATUS = {
    VALIDATION_ERROR: 400,
    UNAUTHENTICATED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
} as const;

export type ApiErrorCode = keyof typeof API_ERROR_STATUS;

export class ApiError extends Error {
    public readonly code: ApiErrorCode;
    public readonly status: number;
    public readonly details?: unknown;

    constructor(
        code: ApiErrorCode,
        message: string,
        details?: unknown,
    ) {
        super(message);

        this.name = "ApiError";
        this.code = code;
        this.status = API_ERROR_STATUS[code];
        this.details = details;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}