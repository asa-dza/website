import type { APIRoute } from 'astro';

/**
 * Liveness of the website's own server process.
 *
 * This route exists to answer one question — is there a Node process serving
 * this site, and is it executing code per request — and it is the only evidence
 * of that which does not require reading logs. A prerendered page cannot
 * demonstrate it: a file on disk looks identical whether the server is running
 * or a static file server is standing in for it.
 *
 * `prerender = false` is what makes it real. Without it Astro would build this
 * to a file at compile time and every caller would get the same frozen
 * timestamp, which would be worse than having no endpoint at all: it would
 * *look* like a working health check.
 *
 * ## What it deliberately does not say
 *
 * No credentials, no environment values, no hostnames, no ports, no service
 * names, no request details, no user data. `uptimeSeconds` and `timestamp` are
 * the whole payload beyond a fixed status string, and both are properties of
 * this process rather than of the deployment around it. An unauthenticated
 * endpoint is readable by anything that can reach it, and through Caddy that
 * means the public internet — so it is written as though it were public,
 * because it is.
 *
 * ## Why it says nothing about the integration service
 *
 * It would be easy to have this also call integration and report what came
 * back, and it is the wrong thing to build twice over. It would turn a liveness
 * probe into a public window onto a private service's responses, and it would
 * make this container report itself unhealthy during somebody else's outage —
 * which is how a dependency being down becomes a restart loop here. Health is
 * "this process is up". Reachability of integration is checked separately, from
 * inside the container, and is not exposed through any route.
 */
export const prerender = false;

const startedAt = Date.now();

export const GET: APIRoute = () =>
    new Response(
        JSON.stringify({
            status: 'ok',
            // Request-time execution is the point, so both values must differ
            // between two calls. If they ever stop differing, this route has
            // been prerendered by accident and the check above regressed.
            timestamp: new Date().toISOString(),
            uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
        }),
        {
            status: 200,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                // Nothing may cache this: a cached health check reports the
                // health of a moment that has passed. `no-store` covers
                // Caddy, any future CDN, and the browser in one directive.
                'cache-control': 'no-store, no-cache, must-revalidate',
            },
        },
    );
