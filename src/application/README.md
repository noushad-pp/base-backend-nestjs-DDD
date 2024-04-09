### Application Layer

In Domain-Driven Design (DDD), the application layer represents
the layer that coordinates the application's functionality. It serves as
a bridge between the presentation(api, cli, etc) and domain layers, ensuring
that the application's business logic is appropriately executed. The
primary responsibilities of the application layer include
interpreting tasks from the api layer, coordinating the domain objects to
perform necessary actions, and facilitating communication between different
parts of the domain.

The application layer essentially acts as an orchestrator, directing the flow
of data and operations within the application. It encapsulates use cases and
business rules that aren't specific to the domain logic but are necessary for
achieving the application's overall goals. This layer is responsible for
transforming input from the user interface into meaningful actions that
interact with the domain layer, often through the use of services and
application-specific operations.

Additionally, the application layer handles transaction management and may
include components for security, caching, logging, and other cross-cutting
concerns. Its design should focus on enabling the system to fulfill specific
use cases while maintaining a clear separation from the underlying domain
logic. By doing so, the application layer ensures that the domain model
remains focused on representing the core business concepts without being
cluttered by application-specific concerns.

In this folder, you may find folders representing domain contexts and each of
it may contain the following files as per CQRS pattern:

- command: This file will contain a command that will be exported and
  then emitted by presentation layer. There will also be the **command-handler**
  which will in-turn handle the command. Mostly used for write / modify actions
- query: Just like command but for read actions, there will be a **query**
  and the corresponding **query-handlers**
- event: these include **event-handlers** that will listen for
  **domain event(s)**
