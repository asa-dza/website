// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import icon from 'astro-icon';

/**
 * The website's build and runtime configuration.
 *
 * ## Why there is an adapter but no `output` setting
 *
 * `output` is deliberately left at its default (`'static'`). With an adapter
 * present that does NOT mean "no server": it means **prerendered by default,
 * on demand by exception**. Every page under `src/pages` is built to static
 * HTML unless it declares `export const prerender = false`, and only those
 * exceptions are served by the Node server at request time.
 *
 * That is the right default for this site. The pages that exist today are
 * institutional content -- they change when somebody edits them, not per
 * request -- and serving them from disk keeps them fast and keeps them working
 * even when a downstream service is not. Setting `output: 'server'` would
 * invert the rule and make every page a request-time render, which would be
 * paying for a capability almost nothing here needs.
 *
 * ## Why `standalone`
 *
 * The adapter has two modes. `middleware` produces a handler to be mounted
 * inside a Node server somebody else writes; `standalone` produces a server
 * that listens on its own. This deployment runs the site as its own container
 * behind Caddy, with nothing else in the process, so `standalone` is the mode
 * that matches: there is no host application to mount into, and writing one
 * would add a file whose only job is to call `listen`.
 *
 * The server reads `HOST` and `PORT` from the environment. The container sets
 * `HOST=0.0.0.0` -- it has to listen on the container interface, not loopback,
 * or Caddy cannot reach it -- and the port comes from deployment.
 *
 * ## Why the integration settings are declared here
 *
 * `astro:env` is what keeps them off the browser. Both are declared
 * `context: 'server', access: 'secret'`, which means two things enforced by the
 * framework rather than by review: the value is read from the environment at
 * **runtime**, so it is never baked into a built file or an image layer, and
 * importing it from client-side code is a build error rather than a leak.
 *
 * `INTEGRATION_WEBSITE_TOKEN` is declared and wired but read by nothing yet.
 * Submitting a registration is Phase 3; this phase establishes that the
 * credential arrives as server-only runtime configuration, and stops there.
 */
export default defineConfig({
    adapter: node({ mode: 'standalone' }),

    integrations: [icon()],

    env: {
        schema: {
            // Where the private integration service answers. Not a credential,
            // but `access: 'secret'` is still correct: it is deployment
            // topology, it must come from the environment at runtime rather
            // than be frozen into the image, and no browser has a use for it.
            INTEGRATION_BASE_URL: envField.string({
                context: 'server',
                access: 'secret',
            }),

            // The website's own credential for the integration service,
            // authorized for submitting registration requests and nothing
            // else. Optional for now, so a deployment that has not reached
            // Phase 3 still starts; Phase 3 makes it required, at the point
            // something actually reads it.
            INTEGRATION_WEBSITE_TOKEN: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
            }),

            // --- Sign-in through the account service (OIDC) -----------------
            // The website is a confidential OIDC client of the account
            // service: the browser is redirected there to sign in, and this
            // server exchanges the code and keeps an encrypted session cookie.
            // All server-only and read at runtime; the build needs none of
            // them, and a deployment without them serves every institutional
            // page and refuses only the account and registration routes.
            WEBSITE_PUBLIC_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
            OIDC_ISSUER: envField.string({ context: 'server', access: 'secret', optional: true }),
            OIDC_CLIENT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
            OIDC_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
            // Encrypts the session cookie. Rotating it signs every learner out.
            WEBSITE_SESSION_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
            // Where the account service and the learning platform are, as the
            // BROWSER reaches them: the account page links there.
            ACCOUNT_PUBLIC_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
            LEARNING_PUBLIC_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
        },
    },
});
