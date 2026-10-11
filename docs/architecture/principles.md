# Shared Architecture Principles

## 1. Purpose

These principles define the engineering constraints shared by all technology stacks in this repository.

## 2. Business Logic

- Business rules should be explicit and independently testable.
- Framework-specific code must not become the implicit owner of business rules.
- Validate input at trust boundaries.
- Enforce authorization at protected operation boundaries.

## 3. Dependency Management

- Dependencies should be explicit and understandable.
- Inner business logic should not depend directly on infrastructure implementations.
- External systems should be accessed through deliberate integration boundaries.
- Introduce abstractions when they protect meaningful boundaries.

## 4. Module Boundaries

- Every business module should have a clear responsibility.
- Public contracts should define supported cross-module interactions.
- Modules must not depend on another module's private implementation details.
- Shared code should remain small and intentional.

## 5. Testing and Verification

- Business rules should be testable without unnecessary infrastructure.
- Important behavior should be covered by automated tests.
- Run relevant type checks, linting, tests, and builds.
- Automate architecture checks when practical.

## 6. AI-Assisted Development

- AI-generated code is a proposal that requires human review.
- Architectural changes must explain their impact on module boundaries and dependencies.
- Review code paths, failure modes, security implications, and tests.
- Prefer incremental changes that can be independently reviewed and verified.

## 7. Architectural Decisions

- Record significant architecture choices as Architecture Decision Records (ADRs).
- Each ADR should describe context, the decision, consequences, and conditions for reconsideration.
- Revisit decisions when their underlying assumptions no longer hold.