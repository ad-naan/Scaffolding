import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/shared/infrastructure/auth/better-auth";

export const { GET, POST } = toNextJsHandler(auth);