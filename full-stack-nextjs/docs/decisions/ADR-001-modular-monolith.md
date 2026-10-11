# ADR-001: Modular Monolith with DDD and Hexagonal Architecture

- Status: Accepted
- Date: 2026-10-11

## Context

The project is intended to be an enterprise-grade full-stack Next.js foundation that supports manual engineering practice and AI-assisted development.

The architecture must provide explicit business boundaries, testable business rules, and controlled dependencies without introducing unnecessary deployment complexity.

## Decision

Adopt a modular monolith using Domain-Driven Design and Hexagonal Architecture.

Each business module owns its domain model and application use cases. Infrastructure implementations are connected through explicit ports and adapters. Next.js is treated as a presentation and runtime framework rather than the owner of business rules.

## Consequences

### Positive

- Business rules can be tested without starting Next.js or connecting to a database.
- Infrastructure implementations can be replaced behind stable interfaces.
- Module boundaries can be reviewed and checked automatically.
- The application remains straightforward to develop and deploy initially.

### Trade-offs

- More design discipline is required than in a simple layered application.
- Interfaces and module contracts require maintenance.
- Cross-module transactions and distributed workflows require explicit design.

## Revisit When

Revisit this decision when module boundaries become unclear, independent deployment is genuinely required, or the operational cost of the monolith outweighs the benefits.