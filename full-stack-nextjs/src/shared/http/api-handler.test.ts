import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/http/api-error";
import { withApiHandler } from "@/shared/http/api-handler";
import { ValidationError } from "@/shared/validation/validation-error";

describe("withApiHandler", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("应该将成功结果包装成统一响应", async () => {
        const handler = withApiHandler(async () => ({
            id: "user-1",
        }));

        const response = await handler(
            new Request("http://localhost/api/users"),
            undefined,
        );

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({
            success: true,
            data: {
                id: "user-1",
            },
            meta: null,
        });
    });

    it("应该返回 ApiError 对应的 HTTP 状态码", async () => {
        const handler = withApiHandler(async () => {
            throw new ApiError("FORBIDDEN", "没有权限");
        });

        const response = await handler(
            new Request("http://localhost/api/users"),
            undefined,
        );

        expect(response.status).toBe(403);
        await expect(response.json()).resolves.toMatchObject({
            success: false,
            error: {
                code: "FORBIDDEN",
                message: "没有权限",
            },
        });
    });

    it("应该将 ValidationError 转换为 400 响应", async () => {
        const handler = withApiHandler(async () => {
            throw new ValidationError([
                {
                    path: "email",
                    code: "invalid_format",
                    message: "邮箱格式不正确",
                },
            ]);
        });

        const response = await handler(
            new Request("http://localhost/api/users"),
            undefined,
        );

        expect(response.status).toBe(400);

        const body = await response.json();

        expect(body.success).toBe(false);
        expect(body.error.code).toBe("VALIDATION_ERROR");
        expect(body.error.details.issues).toEqual([
            {
                path: "email",
                code: "invalid_format",
                message: "邮箱格式不正确",
            },
        ]);
    });

    it("应该隐藏未知异常的内部信息", async () => {
        vi.spyOn(console, "error").mockImplementation(() => { });

        const handler = withApiHandler(async () => {
            throw new Error("database password leaked");
        });

        const response = await handler(
            new Request("http://localhost/api/users"),
            undefined,
        );

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: "服务器内部错误",
            },
        });
    });
});