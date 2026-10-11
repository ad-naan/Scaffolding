import { describe, expect, it } from "vitest";

describe("测试环境",() => {
    it("应该能够执行一个基本断言",() => {
        expect(1+1).toBe(2);
    });
});