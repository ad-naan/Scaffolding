import * as z from "zod";

import { ValidationError } from "@/shared/validation/validation-error";

/**
 * 使用 Zod schema 校验未知输入，并返回推导后的数据类型。
 *
 * 支持同步和异步 schema。
 * schema 校验失败时，统一抛出 ValidationError。
 */
export async function validateInput<T extends z.ZodType>(
    schema: T,
    input: unknown,
): Promise<z.output<T>> {
    const result = await schema.safeParseAsync(input);

    if (!result.success) {
        throw ValidationError.fromZodError(result.error);
    }

    return result.data;
}