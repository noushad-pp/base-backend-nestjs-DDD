## Testing

[< Back to README](../../README.md)

> NB: Integration and e2e tests need docker-compose services running beforehand. Make file targets are created for these,
> and you can use them.

```bash
# unit tests
$ make test

# end to end tests
$ make test-e2e

# integration tests
$ make test-integration

# All tests
$ make test-with-coverage
$ make test-all # without coverage
```

There are also http client tests that can be run against the api server.
These tests are written using [Jetbrains HTTP Client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html).
You can run these tests from the IDE itself. Checkout [http-client tests](../api) folder.

There are 3 environments created for these tests:

- dev:
  - This is the default environment and is used for local development. Run `make develop` and `make start-debug` to start the required services.
    The tests will be run against localhost.
- staging:
  - This environment is used to run the tests against the staging environment.
  - You would need to have a valid jwt token to run these tests. Easiest way to get the token is
    from the frontend application. Login to the frontend application in the browser and from the console copy the
    bearer token from any network calls made to the api server.
  - api server url: // TODO: TBD
  - frontend url: // TODO: TBD
- prod:
  - Same as staging, but the tests will be run against the production environment.
  - api server url: // TODO: TBD
  - frontend url: // TODO: TBD
