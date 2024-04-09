ARG NODE_PORT=3000
ARG NODE_VERSION=alpine
FROM node:${NODE_VERSION}

ENV PYTHONUNBUFFERED=1
# gettext libintl - are dependencies of envsubst package
# git - needed for semantic-release package
# python3 gcc g++ musl-dev - needed for datadog-ci package's deps compillation
RUN apk --no-cache add make curl gettext libintl git python3 gcc g++ musl-dev && \
    npm install -g npm node-gyp pnpm@8

ENV NODE_PORT=$NODE_PORT
EXPOSE $NODE_PORT

RUN npm -g install @nestjs/cli

WORKDIR /app

CMD ["pnpm", "start:debug"]
