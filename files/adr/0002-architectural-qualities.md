# 3. Architectural qualities

Date: 2022-06-17

## Status

Accepted

## Context

We need to make sure that the application's architecture is suitable for the application's purpose while also staying within quality constraints.

## Decision

We have identified the following qualities:

#### Consistency

- The data we produce will be an important part of other processes, so consistency (logical and technical) is important.
- Processing of events must be idempotent.

#### Extendability

- Since we are building a long-lived application that will go through a long development life-cycle we need to make sure
  that we can easily adapt and evolve it.
- Addition of seasons is already in plan, although we don't know the details

#### Scalability

- Processing and producing a lot of changes in a short amount of time
- The company is still growing and expanding, so we must be able to scale horizontally and vertically. Horizontally
  scalability is limited by the number of Kafka partitions.

#### Observability

- We need to know what is going on - on the UI and backend side of things.
- The team does not have much experience with nestjs, so it needs to be easy to track down things.

#### Well documented

- Since this is also a learning for the team, documentation is needed.

## Consequences

- Use relational database for storage to ensure consistency.
- Follow TDD approach during development to ensure consistency and maintainability.
- Leverage the Kubernetes platform to achieve the required scalability.
- Readiness/liveliness probes for horizontal scalability and reliability.
- Log all events to make them traceable to achieve observability.
- A lot of time will need to be invested in the docs.
