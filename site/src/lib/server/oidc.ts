import * as client from 'openid-client';
import {
    ACCOUNT_PUBLIC_URL,
    OIDC_CLIENT_ID,
    OIDC_CLIENT_SECRET,
    OIDC_ISSUER,
    WEBSITE_PUBLIC_URL,
} from 'astro:env/server';

/**
 * The website's OIDC client against the account service.
 *
 * Authorization code with PKCE, server side. The browser only ever sees the
 * redirect to the account service and the redirect back; the code is
 * exchanged by this server with the client secret, and the ID token is
 * validated by the library (issuer, audience, signature, nonce, expiry).
 *
 * `scope` includes `asa_identity`, the account service's own scope that adds
 * its internal user id and uuid to the ID token. Without it the website
 * could not tell the integration layer which account-service user it is
 * speaking for.
 */
export const SCOPE = 'openid email profile asa_identity';

let configuration: Promise<client.Configuration> | null = null;

export function isConfigured(): boolean {
    return Boolean(OIDC_ISSUER && OIDC_CLIENT_ID && OIDC_CLIENT_SECRET && WEBSITE_PUBLIC_URL);
}

/** Discovery, once per process; a failed discovery is retried next time. */
export function oidcConfiguration(): Promise<client.Configuration> {
    if (!isConfigured()) {
        throw new Error('OIDC is not configured (OIDC_ISSUER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, WEBSITE_PUBLIC_URL).');
    }
    if (configuration === null) {
        configuration = client
            .discovery(new URL(OIDC_ISSUER!), OIDC_CLIENT_ID!, OIDC_CLIENT_SECRET!)
            .catch((error) => {
                configuration = null;
                throw error;
            });
    }
    return configuration;
}

export function redirectUri(): string {
    return new URL('/auth/callback', WEBSITE_PUBLIC_URL!).toString();
}

export interface AuthorizationStart {
    readonly url: URL;
    readonly state: string;
    readonly nonce: string;
    readonly codeVerifier: string;
}

export async function startAuthorization(): Promise<AuthorizationStart> {
    const config = await oidcConfiguration();
    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
    const state = client.randomState();
    const nonce = client.randomNonce();
    const url = client.buildAuthorizationUrl(config, {
        redirect_uri: redirectUri(),
        scope: SCOPE,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state,
        nonce,
    });
    return { url, state, nonce, codeVerifier };
}

export interface IdentityClaims {
    readonly issuer: string;
    readonly subject: string;
    readonly providerUserId: string;
    readonly providerUserUuid: string | null;
    readonly name: string;
    readonly email: string;
}

/**
 * Completes the round trip and returns the identity the ID token carries.
 *
 * `currentUrl` is the callback request's full URL; the library reads `code`
 * and `state` from it and refuses a mismatch with what was issued.
 */
export async function completeAuthorization(
    currentUrl: URL,
    expected: { state: string; nonce: string; codeVerifier: string },
): Promise<IdentityClaims> {
    const config = await oidcConfiguration();
    const tokens = await client.authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: expected.codeVerifier,
        expectedState: expected.state,
        expectedNonce: expected.nonce,
    });
    const claims = tokens.claims();
    if (!claims) {
        throw new Error('The account service returned no ID token.');
    }
    const pk = claims['authentik_pk'];
    const uuid = claims['authentik_uuid'];
    if (typeof claims.sub !== 'string' || typeof claims.iss !== 'string') {
        throw new Error('The ID token carries no subject or issuer.');
    }
    if (pk === undefined || pk === null || !/^\d+$/.test(String(pk))) {
        throw new Error('The ID token carries no account-service user id (is the asa_identity scope granted?).');
    }
    return {
        issuer: claims.iss,
        subject: claims.sub,
        providerUserId: String(pk),
        providerUserUuid: typeof uuid === 'string' ? uuid : null,
        name: typeof claims['name'] === 'string' ? claims['name'] : '',
        email: typeof claims['email'] === 'string' ? claims['email'].toLowerCase() : '',
    };
}

/**
 * A URL on the account service that sets the learner's language THERE and
 * continues to `path`. The website is per-language by route; the account
 * service reads its own cookie, which only its origin can write. See the
 * branding package's `templates/static/lang.html`.
 */
export function accountUrlInLanguage(path: string, lang: string): string {
    const base = (ACCOUNT_PUBLIC_URL ?? OIDC_ISSUER ?? '').replace(/\/application\/o\/[^/]+\/?$/, '').replace(/\/+$/, '');
    const params = new URLSearchParams({ lang, to: path });
    return `${base}/asa/lang/?${params.toString()}`;
}
