# no built-in rules and variables
MAKEFLAGS += -rR --warn-undefined-variables

ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Inspired by https://stackoverflow.com/a/59087509
# Only comments with "#:" prefix are interpreted as target description
#: Generates list of targets with description comment.
help:
	@echo "Available targets:"
	@awk ' \
		/^#:/ { \
			desc = $$0; \
			next; \
		} \
		/^\.PHONY:/ { \
			phony[$$2] = 1; \
			next; \
		} \
		/^[a-zA-Z0-9_-]+:/ { \
			split($$0, a, ":"); \
			target = a[1]; \
			if (desc != "" || phony[target] == 1) { \
				print target "###" desc; \
			} else { \
				print target "###"; \
			} \
			desc = ""; \
		}' Makefile \
	| sed 's/^#: //' \
	| column -t -s '###'

# Treat the following names as commands, and not as file targets
.PHONY: develop test-e2e clean prepare-local

develop:
	@echo "TODO: setup docker" # @docker-compose up -d

clean:
	@docker-compose down

prepare-local: develop
	@pnpm install --frozen-lockfile
	@pnpm typeorm migration:run
	@pnpm reset:fixtures

start-dev: develop
	@pnpm start

start-debug: develop
	@pnpm start:debug

start-prod:
	@pnpm start:prod

build:
	@pnpm build

format:
	@pnpm format

lint:
	@pnpm lint

audit:
	@pnpm audit

tsc:
	@pnpm tsc

test:
	@pnpm test

test-coverage:
	@pnpm test:cov

