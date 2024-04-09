## Presentation layer

The presentation layer in Domain-Driven Design (DDD) serves as the interface
between the user and the application's domain logic. It focuses on presenting
information to the user and interpreting user input, while also handling the
user interface and user experience aspects of the application. The main
components of the presentation layer typically include the following:

**User Interface (UI) Components**: This includes all the elements that users
interact with directly. It can involve various components such as forms,
screens, buttons, menus, and other visual elements that allow users to
communicate with the application. As our application is mostly api based we
dont have any of these components currently

**Controllers**: These components act as intermediaries between the user
interface and the application/domain layers. They receive input from the user
interface, interpret it, and invoke the corresponding domain logic to perform actions
based on the user's request. In our case since we are following CQRS pattern
using queries and commands provided by the application layer.

**ViewModels or DTOs (Data Transfer Objects)**: These are data structures that
transfer data between the presentation and application/domain layers. They
often encapsulate the data needed for a specific view or operation, providing a
simplified representation of domain objects tailored to the needs of the
user interface.

The main goal of the presentation layer is to provide a user-friendly interface
that enables users to interact with the application and access the domain
functionality in a seamless and intuitive manner. It is important to maintain
a clear separation between the presentation layer and the domain layer to ensure
that the user interface remains decoupled from the underlying business logic,
making the application more adaptable to changes in user interface technologies
and requirements.
