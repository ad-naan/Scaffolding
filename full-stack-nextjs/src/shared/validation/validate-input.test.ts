import { describe, expect, it } from "vitest";
import * as z from "zod";

import { ValidationError } from "@/shared/validation/validation-error";
import { validateInput } from "@/shared/validation/validate-input";

describe("validateInput", () => {
    it("应该返回通过校验的数据", async () => {
        const schema = z.object({
            name: z.string(),
            age: z.number(),
        });

        const result = await validateInput(schema, {
            name: "测试用户",
            age: 20,
        });

        expect(result).toEqual({
            name: "测试用户",
            age: 20,
        });
    });

    it("输入不合法时应该抛出 ValidationError", async () => {
        const schema = z.object({
            email: z.email(),
        });

        await expect(
            validateInput(schema, {
                email: "invalid-email",
            }),
        ).rejects.toBeInstanceOf(ValidationError);
    });

    it("应该保留校验错误的字段路径", async () => {
        const schema = z.object({
            profile: z.object({
                name: z.string(),
            }),
        });

        try {
            await validateInput(schema, {
                profile: {
                    name: 123,
                },
            });

            throw new Error("预期校验失败，但实际通过了");
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ValidationError);

            if (!(error instanceof ValidationError)) {
                throw error;
            }

            expect(error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        path: "profile.name",
                        code: "invalid_type",
                    }),
                ]),
            );
        }
    });

    it("应该返回 Zod 转换后的数据和默认值", async () => {
        const schema = z.object({
            page: z.string().transform(Number),
            limit: z.number().default(20),
        });

        const result = await validateInput(schema, {
            page: "3",
        });

        expect(result).toEqual({
            page: 3,
            limit: 20,
        });
    });

    it("应该支持异步 schema 校验", async () => {
        const schema = z.string().refine(
            async (value) => value === "valid",
            {
                message: "输入值无效",
            },
        );

        await expect(
            validateInput(schema, "invalid"),
        ).rejects.toBeInstanceOf(ValidationError);

        await expect(
            validateInput(schema, "valid"),
        ).resolves.toBe("valid");
    });

    it("校验错误不应该暴露原始输入值", async () => {
        const schema = z.object({
            password: z.string().min(8),
        });

        try {
            await validateInput(schema, {
                password: "secret",
            });

            throw new Error("预期校验失败，但实际通过了");
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ValidationError);

            if (!(error instanceof ValidationError)) {
                throw error;
            }

            expect(JSON.stringify(error.issues)).not.toContain("secret");
        }
    });
});