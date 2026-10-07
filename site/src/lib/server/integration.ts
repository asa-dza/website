import { INTEGRATION_BASE_URL } from 'astro:env/server';

/**
 * The website's access to the private integration service.
 *
 * ## This module must never reach a browser
 *
 * It is under `src/lib/server/` by convention and it imports from
 * `astro:env/server`, which is the part that enforces it: Astro fails the build
 * if a client-side bundle ends up importing this transitively. That is a
 * stronger guarantee than a naming convention, and it is the reason the
 * configuration is declared in `astro.config.mjs` rather than read from
 * `import.meta.env` here.
 *
 * ## Why the base URL is not validated at module load
 *
 * `astro:env` validates a `secret` field when it is first read, which is at
 * import time for this module — so a missing `INTEGRATION_BASE_URL` fails the
 * request that needed it, not the server's start-up. That is the behaviour to
 * want here: the site's prerendered pages do not depend on integration, and a
 * misconfigured integration URL should not stop the institutional content from
 * being served.
 *
 * ## Scope in this phase
 *
 * Reachability only. `integrationBaseUrl` and {@link checkIntegrationReachable}
 * exist so that the deployment can be verified from inside the container,
 * without any route exposing integration's responses to a caller. Submitting a
 * registration request — which needs `INTEGRATION_WEBSITE_TOKEN`, an
 * authenticated visitor, and a verified address — is Phase 3, and nothing here
 * anticipates its shape.
 */
export const integrationBaseUrl = INTEGRATION_BASE_URL;

/** What a reachability check can conclude, and nothing more. */
export type IntegrationReachability =
    | { readonly reachable: true; readonly status: number }
    | { readonly reachable: false; readonly reason: 'unreachable' | 'timeout' };

/**
 * Asks whether the integration service is answering at all.
 *
 * Deliberately reports only whether something answered and with which status.
 * The response body is not read and not returned: integration's answers are
 * private, and a helper that passed them back would be one refactor away from
 * being rendered into a page.
 *
 * The endpoint called is integration's unauthenticated root. **This establishes
 * connectivity and nothing else** — no credential is presented, so a success
 * says the two containers can talk on the private network, not that this
 * website is authorized for any business operation. Phase 3 is where an
 * authorized call first happens.
 *
 * @param timeoutMs How long to wait before giving up. A reachability check that
 *   can hang is not a check.
 */
export async function checkIntegrationReachable(
    timeoutMs = 3000,
): Promise<IntegrationReachability> {
    try {
        const response = await fetch(new URL('/', integrationBaseUrl), {
            method: 'GET',
            signal: AbortSignal.timeout(timeoutMs),
        });

        return { reachable: true, status: response.status };
    } catch (error) {
        // The distinction is worth keeping: a timeout means something may be
        // there and slow, anything else means nothing answered. Neither carries
        // the underlying message onward — it can name internal hosts.
        const timedOut =
            error instanceof Error &&
            (error.name === 'TimeoutError' || error.name === 'AbortError');

        return { reachable: false, reason: timedOut ? 'timeout' : 'unreachable' };
    }
}
