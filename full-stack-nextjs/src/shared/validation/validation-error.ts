import { ZodError } from "zod";

/**
 * 单个字段的校验问题。
 *
 * 不包含原始输入值，避免意外暴露密码等敏感信息。
 */
export interface ValidationIssue {
    path: string;
    code: string;
    message: string;
}

/**
 * 统一的输入校验错误。
 *
 * 属于通用校验层，不依赖 HTTP 或 Next.js。
 */
export class ValidationError extends Error {
    public readonly issues: ValidationIssue[];

    constructor(issues: ValidationIssue[]) {
        super("输入数据校验失败");

        this.name = "ValidationError";
        this.issues = issues;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * 将 Zod 4 的校验错误转换成统一结构。
     */
    static fromZodError(error: ZodError): ValidationError {
        return new ValidationError(
            error.issues.map((issue) => ({
                path: issue.path.map(String).join("."),
                code: issue.code,
                message: issue.message,
            })),
        );
    }
}