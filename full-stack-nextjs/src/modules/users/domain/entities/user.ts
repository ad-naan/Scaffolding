export type UserStatus = "pending" | "active" | "suspended" | "deleted";

export interface UserProps {
  id: string;
  email: string;
  displayName: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) { }

  static create(props: UserProps): User {
    if (!props.id.trim()) {
      throw new Error("用户 ID 不能为空");
    }

    const email = props.email.trim();

    if (!email) {
      throw new Error("用户邮箱不能为空");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("用户邮箱格式无效");
    }

    const displayName = props.displayName.trim();

    if (!displayName) {
      throw new Error("显示名称不能为空");
    }

    if (
      Number.isNaN(props.createdAt.getTime()) ||
      Number.isNaN(props.updatedAt.getTime())
    ) {
      throw new Error("用户时间字段无效");
    }

    if (props.updatedAt < props.createdAt) {
      throw new Error("更新时间不能早于创建时间");
    }

    return new User({
      ...props,
      email,
      displayName,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  canAuthenticate(): boolean {
    return this.props.status === "active";
  }
}
