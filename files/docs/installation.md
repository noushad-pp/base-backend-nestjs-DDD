## Installation

[< Back to README](../../README.md)

> #### Pre-requisites
>
> - Node v20 (We recommend using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage node versions)
> - pnpm v8 (We recommend using [pnpm](https://pnpm.io/installation) as package manager)
> - [Docker + docker-compose](https://rancherdesktop.io/).
> - Duplicate `env.template` to `.env.local` and populate the values accordingly if necessary

```bash
# start required docker containers
$ make develop
```

This will start all the necessary services required to run the entire suite of applications (db, kafka broker, registry etc.)
You can run other services individually as needed for eg:

- `make start-dev` or `make start-debug` for api server
- `pnpm typeorm migration:run` for database migrations [More info](./database.md)
- etc.

Refer available scripts in `package.json` or `Makefile`.

##### Local development

You can run `make prepare-local` to set up your local environment for development. This will
install all the dependencies and run the migrations.

The api server will be running at http://localhost:8000 , and you can also attach a debugger if necessary
at http://localhost:9229.

> NB: If you are using Jetbrains IDE there are already run configurations made available in the code
> You can directly run, test and debug from the IDE itself.
> Checkout the .run folder for more details
