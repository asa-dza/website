import type { APIRoute } from 'astro';
import { isLang } from '../../i18n/site.ts';
import { accountUrlInLanguage, isConfigured, startAuthorization } from '../../lib/server/oidc.ts';
import { writeHandshake } from '../../lib/server/session.ts';

export const prerender = false;

/**
 * Starts sign-in at the account service.
 *
 * `?lang=` chooses the language the account service's pages should appear
 * in, and `?next=` where to return afterwards -- a relative path on this
 * site only, so this route cannot redirect anywhere else. The PKCE verifier,
 * state and nonce travel in a short-lived encrypted cookie and are checked
 * on the way back.
 */
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    if (!isConfigured()) {
        return new Response('Sign-in is not configured on this site.', { status: 503 });
    }
    const lang = isLang(url.searchParams.get('lang')) ? url.searchParams.get('lang')! : 'en';
    const next = safeNext(url.searchParams.get('next')) ?? `/${lang}/account/`;

    const start = await startAuthorization();
    writeHandshake(cookies, {
        state: start.state,
        nonce: start.nonce,
        codeVerifier: start.codeVerifier,
        next,
        lang,
        issuedAt: Date.now(),
    });
    // Through the account service's language redirector, so the learner
    // meets its pages in the language they were using here.
    const authorize = `${start.url.pathname}${start.url.search}`;
    return redirect(accountUrlInLanguage(authorize, lang), 302);
};

/** Only a path on this site: no scheme, no host, no protocol-relative form. */
export function safeNext(candidate: string | null): string | null {
    if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) {
        return null;
    }
    return candidate;
}
