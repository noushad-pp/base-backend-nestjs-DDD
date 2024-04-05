# Puthen Peedikayil Core Backend

## Description

BR backend application is built on [Nest](https://github.com/nestjs/nest) framework which uses Nodejs, ExpressJs
and Typescript under the hood.

### services:

- api
  - serve routes
- Migrations:
  - database
    - keep database schema up to date

#### Documentations:

- [Installation](files/docs/installation.md)
- [Testing](files/docs/testing.md)
- [Database](files/docs/database.md)

#### Useful links:

> Notes
>
> - The architectural decisions are recorded and can be found [here](files/adr/)
> - There are pre-commit hooks that run against every commit which makes use of [husky](https://github.com/typicode/husky)
>   and [lint-staged](https://github.com/okonet/lint-staged) which would compile and formats the code before pushing the code.
> - The project vocabulary can be found [here](files/docs/vocabulary.md)
