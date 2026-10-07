# The public website, and its server.
#
# Built by the platform repository's Compose stack; this file lives here because
# the build is a property of this source tree, not of the deployment.
#
# This image used to be `caddy:2-alpine` serving `dist/` as files. It is a Node
# image now because the site has a server: pages are still prerendered and still
# served from disk, but the Astro Node adapter in standalone mode is what serves
# them, alongside the routes that execute per request. Caddy has not gone away --
# it moved up a level, to the platform stack, where it terminates TLS and
# proxies here.
#
# Two stages. The builder keeps devDependencies and the sources; the runtime
# carries the built output and production dependencies only, so what runs in
# production contains no toolchain and no source.

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copied separately from the sources so this layer is cached until the
# dependency set itself changes. `npm ci` rather than `npm install`: it installs
# exactly what the lock file pins and fails if the two disagree, which is what
# makes the build reproducible.
COPY package.json package-lock.json ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public

# `astro:env` validates `access: 'secret'` fields when they are first read,
# which is at request time -- so no integration URL or credential is needed
# here, and none is accepted. There is deliberately no ARG for either: a build
# argument is recorded in the image's history, which is the wrong place for
# configuration and a disastrous place for a credential.
RUN npm run build

# Drop everything the runtime does not need. Done here rather than in the
# runtime stage so the pruned tree is copied once, instead of the full one being
# copied and then trimmed in a layer that still contains it.
RUN npm prune --omit=dev

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# 0.0.0.0, not loopback. The standalone server has to listen on the container
# interface or Caddy cannot reach it, and a container's loopback is its own.
ENV HOST=0.0.0.0

# A default, not a decision. Platform sets it, and nothing is published to the
# host in production -- the site is reached through Caddy.
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# `node` is an unprivileged user the base image already provides. The server
# writes nothing and needs no ownership of its own files, so read-only access as
# a non-root user is all it requires.
USER node

# The base image's entrypoint script is cleared so CMD is exec'd directly. It
# exists only for `docker run node npm ...` convenience: this image runs one
# process, and the extra shell layer buys nothing -- including a shell that
# would otherwise sit between PID 1 and the signals that stop the server.
ENTRYPOINT []

EXPOSE 3000

# Proves the process is listening AND executing. `/api/health` is an on-demand
# route, so a response to it cannot have come from a file -- which is what makes
# it worth probing rather than probing a prerendered page.
#
# It says nothing about whether the integration service is reachable, and that
# is deliberate: a dependency being down is not a reason to restart this
# container, and a health check that conflated the two would produce restart
# loops during somebody else's outage.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/api/health" || exit 1

CMD ["node", "./dist/server/entry.mjs"]
