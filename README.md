# Scaffolding

A multi-stack engineering workspace for building, studying, and reviewing production-oriented application foundations.

## Goals

- Build each technology stack incrementally instead of relying on generated boilerplate.
- Practice architecture design, implementation, testing, and code review.
- Support AI-assisted coding while keeping architectural decisions and verification under human control.
- Apply consistent engineering standards across different technology stacks.

## Technology Stacks

| Directory | Technology | Status |
|---|---|---|
| `desktop-client-electron/` | Electron desktop application | Planned |
| `full-stack-go/` | Go full-stack application | Planned |
| `full-stack-nextjs/` | Next.js full-stack application | In progress |
| `full-stack-python/` | Python full-stack application | Planned |
| `full-stack-springboot/` | Spring Boot full-stack application | Planned |

## Engineering Principles

1. Understand the architecture before implementing features.
2. Keep business rules independently testable.
3. Make dependencies and module boundaries explicit.
4. Validate changes with automated checks.
5. Record important architectural decisions.
6. Treat AI-generated code as a proposal that requires human review.

## Repository Conventions

- This repository uses a single Git history for all technology stacks.
- Shared engineering standards and cross-stack documentation belong in the root `docs/` directory.
- Stack-specific architecture, commands, and implementation notes belong in the corresponding stack directory.
- Secrets, local environment files, dependencies, and generated build artifacts must not be committed.

## Development Workflow

1. Define the architecture and boundaries.
2. Implement a small, verifiable increment.
3. Add or update tests.
4. Run the relevant checks.
5. Review the diff before committing.

Each technology stack should document its own setup instructions and verification commands.