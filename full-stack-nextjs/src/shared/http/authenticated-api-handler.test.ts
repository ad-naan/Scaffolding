
import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireActiveSession } = vi.hoisted(() => ({
    requireActiveSession: vi.fn(),
}));

vi.mock("@/shared/infrastructure/auth/require-active-session", () => ({
    requireActiveSession,
}));

import { ApiError } from "@/shared/http/api-error";
import { withAuthenticatedApiHandler } from "@/shared/http/api-handler";
import type { requireActiveSession as RequireActiveSession } from "@/shared/infrastructure/auth/require-active-session";

type ActiveSession = Awaited<ReturnType<typeof RequireActiveSession>>;

describe("withAuthenticatedApiHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("应该将有效会话传递给业务处理函数", async () => {
        const session = {
            user: { id: "user-1" },
        } as ActiveSession;

        vi.mocked(requireActiveSession).mockResolvedValue(session);

        const handler = withAuthenticatedApiHandler(
            async (_request, _context, currentSession) => ({
                userId: currentSession.user.id,
            }),
        );

        const response = await handler(
            new Request("http://localhost/api/users/me"),
            undefined,
        );

        expect(requireActiveSession).toHaveBeenCalledOnce();
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({
            success: true,
            data: { userId: "user-1" },
        });
    });

    it("未登录时应该返回 401", async () => {
        vi.mocked(requireActiveSession).mockRejectedValue(
            new ApiError("UNAUTHENTICATED", "请先登录"),
        );

        const handler = withAuthenticatedApiHandler(
            async () => ({ shouldNotRun: true }),
        );

        const response = await handler(
            new Request("http://localhost/api/users/me"),
            undefined,
        );

        expect(response.status).toBe(401);
        await expect(response.json()).resolves.toMatchObject({
            success: false,
            error: {
                code: "UNAUTHENTICATED",
                message: "请先登录",
            },
        });
    });

    it("账号不可用时应该返回 403", async () => {
        vi.mocked(requireActiveSession).mockRejectedValue(
            new ApiError("FORBIDDEN", "当前账号不可用"),
        );

        const handler = withAuthenticatedApiHandler(
            async () => ({ shouldNotRun: true }),
        );

        const response = await handler(
            new Request("http://localhost/api/users/me"),
            undefined,
        );

        expect(response.status).toBe(403);
        await expect(response.json()).resolves.toMatchObject({
            success: false,
            error: {
                code: "FORBIDDEN",
                message: "当前账号不可用",
            },
        });
    });
});
