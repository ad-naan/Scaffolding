# Next.js Architecture Overview

## 1. Architecture Style

This project uses Domain-Driven Design (DDD) and Hexagonal Architecture.

The initial deployment model is a modular monolith. Business modules remain independently organized within one application and one deployment unit.

## 2. Architectural Layers

- **Domain**: entities, value objects, domain services, domain events, and business invariants.
- **Application**: use cases, application services, input/output contracts, and transaction coordination.
- **Infrastructure**: adapters for databases, caches, queues, storage, email, and external services.
- **Presentation**: Next.js pages, layouts, route handlers, and server actions.

## 3. Dependency Rules

1. Domain must not depend on Next.js, Prisma, Redis, HTTP, or external SDKs.
2. Application may depend on Domain and application-owned abstractions.
3. Infrastructure implements ports defined by the appropriate inner layer.
4. Presentation translates framework requests into application inputs and application outputs into framework responses.
5. Business rules must not be implemented in route handlers or UI components.
6. Cross-module access must use explicitly exported public contracts.
7. Infrastructure implementations must not leak into Domain.

## 4. Business Module Boundaries

Each business module owns its domain model, application use cases, and module-specific infrastructure.

Modules must not import another module's internal files directly.

Cross-module collaboration must use explicit public contracts. Synchronous calls are preferred when appropriate; domain events are used when event-driven collaboration provides a genuine benefit.

## 5. Engineering Principles

- Prefer explicit dependencies over hidden global state.
- Validate data at trust boundaries.
- Enforce authorization at protected operation boundaries.
- Keep business rules independently testable.
- Introduce abstractions when they protect a meaningful boundary.
- Record significant architectural decisions.
- Enforce critical architectural rules with automated checks.

## 6. Change Policy

Changes to architectural boundaries, dependency directions, security requirements, or shared contracts must include an explanation of the impact and appropriate tests.

This document defines the initial architectural contract. More detailed rules will be added as the corresponding capabilities are implemented.