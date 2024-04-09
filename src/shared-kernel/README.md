The shared kernel in DDD contains elements that are shared across different projects or across multiple
bounded contexts within the same project, yet without causing unwanted coupling. This can include:

- Common utility types like Either, Result, Option.
- Base classes like Entity, ValueObject, AggregateRoot.
- Enumerations or constant values used across multiple bounded contexts.
- Shared domain concepts that multiple bounded contexts rely on but don't own.
- Interfaces for external services if those are used across bounded contexts.
- Any other shared libraries or utility functions.
- The shared kernel is meant to be stable and should change infrequently, as changes can impact multiple parts of the system.

Avoid:

- Business Logic: Specific business rules or logic shouldn't be in the shared kernel.
- Context-Specific Concepts: Avoid putting anything too specific to a single bounded context.
- Frequent Changes: The shared kernel should be stable; avoid elements that change often.
- Heavy Dependencies: Minimize dependencies to keep the shared kernel lightweight.
- Implementation Details: Stick to interfaces and abstractions, not concrete implementations.
- Application or Infrastructure Code: The shared kernel is for domain elements and utilities, not specific application
  or infrastructure components.

Since these utility types are often framework-agnostic and don't contain business logic, they can safely be used in
the domain, application and infrastructure layers. Just make sure that the shared kernel remains stable and
doesn't take on dependencies from other layers.
