## Database

[< Back to README](../../README.md)

We are using mysql database for this project. The database is managed by [typeorm](https://typeorm.io/#/) and migrations.
On staging and production environments,we are using AWS RDS instances while docker mysql for local and testing purposed.

###### Migrations

Typeorm has a built-in [cli tool](https://orkhan.gitbook.io/typeorm/docs/using-cli) that we use for migrations.
You can run any of the available commands using `pnpm typeorm`, to apply the config automatically.

Some of the most common most important commands are:

```bash
# Generate migration - when you make any changes to your entity, generate a new migration using:
pnpm typeorm migration:generate -p src/infrastructure/storage/database/migration/{name-of-your-migration}

# Migrations are applied automatically for dev and testing mode. To apply any new migrations in production mode, use:
pnpm typeorm(:prod) migration:run

# To revert the last applied migration, use:
pnpm typeorm(:prod) migration:revert
```
