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

// ---------------------------------------------------------------------------
// Submitting a registration request
// ---------------------------------------------------------------------------

import { INTEGRATION_WEBSITE_TOKEN } from 'astro:env/server';
import type { Session } from './session.ts';

/** The integration layer's answer, in the website's vocabulary. */
export type RegistrationSubmissionOutcome =
    | { readonly ok: true; readonly requestId: string }
    | {
          readonly ok: false;
          readonly reason:
              | 'identity-refused' // the account service says this identity may not register (unverified, inactive, blocked)
              | 'offering-not-found'
              | 'request-rejected' // registration not open, or refused by the registration system's rules
              | 'unavailable' // try again later
              | 'misconfigured'; // this website has no credential, or integration refused it
      };

/**
 * Submits a registration request for the signed-in learner.
 *
 * What is sent is WHO (the identity from the session: issuer, subject and
 * the account service's user id) and WHAT (the offering). Nothing typed into
 * a form travels: the applicant's name and address are the account
 * service's verified record, read by the integration layer. A success means
 * a request now exists for staff to review -- not that the learner is
 * registered, and not that they have learning-platform access.
 */
export async function submitRegistrationRequest(
    session: Session,
    courseOfferingCode: string,
    timeoutMs = 10_000,
): Promise<RegistrationSubmissionOutcome> {
    if (!INTEGRATION_WEBSITE_TOKEN) {
        return { ok: false, reason: 'misconfigured' };
    }
    let response: Response;
    try {
        response = await fetch(new URL('/registration-requests', integrationBaseUrl), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${INTEGRATION_WEBSITE_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                identity: {
                    issuer: session.issuer,
                    subject: session.subject,
                    providerUserId: session.providerUserId,
                    ...(session.providerUserUuid ? { providerUserUuid: session.providerUserUuid } : {}),
                },
                courseOfferingCode,
            }),
            signal: AbortSignal.timeout(timeoutMs),
        });
    } catch {
        return { ok: false, reason: 'unavailable' };
    }
    if (response.status === 201) {
        const body = (await response.json().catch(() => null)) as { requestId?: unknown } | null;
        if (body && typeof body.requestId === 'string') {
            return { ok: true, requestId: body.requestId };
        }
        return { ok: false, reason: 'unavailable' };
    }
    switch (response.status) {
        case 403:
            return { ok: false, reason: 'identity-refused' };
        case 404:
            return { ok: false, reason: 'offering-not-found' };
        case 422:
            return { ok: false, reason: 'request-rejected' };
        case 401:
        case 500:
            return { ok: false, reason: 'misconfigured' };
        default:
            return { ok: false, reason: 'unavailable' };
    }
}
