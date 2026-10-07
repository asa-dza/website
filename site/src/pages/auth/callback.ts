import type { APIRoute } from 'astro';
import { completeAuthorization } from '../../lib/server/oidc.ts';
import { clearHandshake, readHandshake, writeSession } from '../../lib/server/session.ts';

export const prerender = false;

/**
 * The account service sends the browser back here with a code.
 *
 * The code is exchanged server side; the ID token's issuer, audience,
 * signature, nonce and expiry are checked by the OIDC library against what
 * `/auth/login` issued; and the identity it carries becomes the website's
 * session. A missing or expired handshake cookie, a state mismatch or a
 * refused exchange all end on a short page rather than a session.
 */
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    const handshake = readHandshake(cookies);
    clearHandshake(cookies);
    if (!handshake) {
        return failed(url, 'The sign-in attempt expired or did not start here. Please try again.');
    }
    // The account service reports a refusal (a cancelled sign-in, a denied
    // policy) as `error` instead of `code`.
    if (url.searchParams.get('error')) {
        return redirect(`/${handshake.lang}/account/?signin=denied`, 302);
    }
    try {
        const identity = await completeAuthorization(url, handshake);
        writeSession(cookies, identity);
    } catch (error) {
        console.error('[auth] sign-in could not be completed:', error instanceof Error ? error.message : error);
        return failed(url, 'Sign-in could not be completed. Please try again.');
    }
    return redirect(handshake.next, 302);
};

function failed(url: URL, message: string): Response {
    return new Response(
        `<!doctype html><meta charset="utf-8"><title>Sign-in</title><p>${message}</p><p><a href="/">${url.host}</a></p>`,
        { status: 400, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
    );
};
