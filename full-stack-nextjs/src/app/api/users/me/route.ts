
import { withAuthenticatedApiHandler } from "@/shared/http/api-handler";

// 获取当前用户信息
export const GET = withAuthenticatedApiHandler(
    async (_request, _context, session) => ({
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.name,
    }),
);
