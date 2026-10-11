import { describe, expect, it } from "vitest";
import { User, type UserProps, type UserStatus } from "./user";

const now = new Date("2026-01-01T00:00:00.000Z");

function createUserProps(overrides: Partial<UserProps> = {}): UserProps {
  return {
    id: "user_123",
    email: "user@example.com",
    displayName: "测试用户",
    status: "active",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createUser(overrides: Partial<UserProps> = {}): User {
  return User.create(createUserProps(overrides));
}

describe("User", () => {
  describe("create", () => {
    it("应该成功创建有效用户", () => {
      const user = createUser();

      expect(user.id).toBe("user_123");
      expect(user.email).toBe("user@example.com");
      expect(user.displayName).toBe("测试用户");
      expect(user.status).toBe("active");
      expect(user.createdAt).toEqual(now);
      expect(user.updatedAt).toEqual(now);
    });

    it("应该去除邮箱和显示名称首尾的空格", () => {
      const user = createUser({
        email: "  user@example.com  ",
        displayName: "  测试用户  ",
      });

      expect(user.email).toBe("user@example.com");
      expect(user.displayName).toBe("测试用户");
    });

    it("用户 ID 为空时应该抛出错误", () => {
      expect(() => createUser({ id: "" })).toThrow("用户 ID 不能为空");
      expect(() => createUser({ id: "   " })).toThrow("用户 ID 不能为空");
    });

    it("用户邮箱为空时应该抛出错误", () => {
      expect(() => createUser({ email: "" })).toThrow("用户邮箱不能为空");
      expect(() => createUser({ email: "   " })).toThrow("用户邮箱不能为空");
    });

    it.each([
      "invalid-email",
      "user@",
      "@example.com",
      "user example@example.com",
    ])("邮箱格式无效时应该抛出错误：%s", (email) => {
      expect(() => createUser({ email })).toThrow("用户邮箱格式无效");
    });

    it("显示名称为空时应该抛出错误", () => {
      expect(() => createUser({ displayName: "" })).toThrow(
        "显示名称不能为空",
      );
      expect(() => createUser({ displayName: "   " })).toThrow(
        "显示名称不能为空",
      );
    });

    it("创建时间无效时应该抛出错误", () => {
      expect(() => createUser({ createdAt: new Date(Number.NaN) })).toThrow(
        "用户时间字段无效",
      );
    });

    it("更新时间无效时应该抛出错误", () => {
      expect(() => createUser({ updatedAt: new Date(Number.NaN) })).toThrow(
        "用户时间字段无效",
      );
    });

    it("更新时间早于创建时间时应该抛出错误", () => {
      expect(() =>
        createUser({
          createdAt: new Date("2026-01-02T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        }),
      ).toThrow("更新时间不能早于创建时间");
    });
  });

  describe("canAuthenticate", () => {
    it.each([
      ["pending", false],
      ["active", true],
      ["suspended", false],
      ["deleted", false],
    ] as const satisfies readonly (readonly [UserStatus, boolean])[])(
      "用户状态为 %s 时，认证资格应为 %s",
      (status, expected) => {
        const user = createUser({ status });

        expect(user.canAuthenticate()).toBe(expected);
      },
    );
  });

  describe("数据保护", () => {
    it("不应该允许通过返回的日期对象修改内部时间", () => {
      const user = createUser();
      const returnedDate = user.createdAt;

      returnedDate.setUTCFullYear(2030);

      expect(user.createdAt).toEqual(now);
    });

    it("不应该因外部修改原始日期对象而改变用户时间", () => {
      const createdAt = new Date(now);
      const updatedAt = new Date(now);

      const user = createUser({ createdAt, updatedAt });

      createdAt.setUTCFullYear(2030);
      updatedAt.setUTCFullYear(2030);

      expect(user.createdAt).toEqual(now);
      expect(user.updatedAt).toEqual(now);
    });
  });
});
