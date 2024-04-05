# 4. Fundamental Technical Decisions

Date: 2022-06-17

## Status

Accepted

## Context

Given our architectural and organizational constraints, we need to decide on the specific technologies and their limitations.

#### Organizational Constraints

- Kubernetes
- Kafka
- Terraform
- AWS RDS
- DataDog
- Azure

## Decisions

- Language: Typescript
- Framework: Nestjs
- Testing framework: Jest
- PR based workflow - because external developers are working on this project
- Use TDD approach to ensure maintainability
- Use Relational database for consistency. Use typeORM library for working with database.
- Use separate repositories for frontend and backend
- Use docker for local development

## Consequences

- The team must learn how to apply DDD principles to a nestjs project.
- We need to enable debugger for local development in docker containers.
- The project must be set up to support all the decisions listed above.
