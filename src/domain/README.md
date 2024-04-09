## Domain layer

In Domain-Driven Design (DDD), the domain layer represents the heart of the
application, focusing on capturing and implementing the business logic and
rules that define the core domain concepts and behaviors. It comprises the
domain model, which includes entities(projections), value objects, aggregates,
repositories, domain services, and domain events.

There will be folders for each identified bounded contexts and each bounded
context might contain following files:

- **aggregate**: Aggregates are clusters of domain objects that can be treated as
  a single unit. This object will have methods exposed on it for outside world
  to interact with it to invoke actions that could be applied on that domain
  object. This might in turn raise domain events that will trigger further
  changes using event listeners
- **value-object**s: These are objects that represent concepts from the domain that
  are not defined by their identity but rather by the combination of their
  attributes. They are often used for attributes or components that are not
  individually identifiable. These could be passed around and/or used to mutate the data inside domain context
- **data-access**: This file contain the domain objects/classes that is used
  for the persistence of data. This includes:
  - **Projection**: Aka entity. These are domain objects with an identity
  - **Repository-interface**: Interface the storage layer adapters should
    implement inorder to keep the domain layer agnostic of underlying
    database/storage implementation details
  - **Repository token**: This is a nestjs workaround for injecting the
    database repository without the domain layer knowing the database entity
    mapper (specifically using the ORM repository injections)
- **Domain Events**: Domain events represent significant changes or occurrences
  within the domain. They allow the communication of these changes to other
  parts of the system without creating direct dependencies between different
  parts of the domain model.
- **Domain Services**: Domain services encapsulate domain logic that doesn't
  naturally fit within any specific entity or value object. They provide a way
  to encapsulate complex business logic that doesn't belong to a specific object.

There might be a root-aggregate file sometimes if there is an
aggregate object that contains other aggregates.

The primary goal of the domain layer is to capture the essential business
concepts and logic, reflecting the real-world processes and rules in the
domain. It should be independent of any specific technical implementation
details, allowing developers to focus on the domain complexity and rules
without being cluttered by infrastructure concerns. By maintaining a rich and
expressive domain layer, DDD enables the development of flexible, scalable, and
maintainable applications that closely model the underlying business requirements.
