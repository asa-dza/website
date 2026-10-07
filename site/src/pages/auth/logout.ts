import type { APIRoute } from 'astro';
import { LEARNING_PUBLIC_URL } from 'astro:env/server';
import { isLang } from '../../i18n/site.ts';
import { clearSession } from '../../lib/server/session.ts';

export const prerender = false;

/**
 * The coordinated sign-out.
 *
 * Three sessions end, in order, each by a top-level navigation: this
 * website's (cleared here), the learning platform's (its `auth_asalogout`
 * logout endpoint ends it and hands on), and the account service's (the
 * learning platform sends the browser to its end-session endpoint). The
 * learner ends on the account service's sign-in page.
 *
 * This is the same chain the lab measured; what the lab did not claim still
 * holds: a sign-out started inside the account service itself leaves the
 * learning-platform session alive, and a second browser keeps its own
 * sessions.
 */
export const GET: APIRoute = ({ cookies, redirect, url }) => {
    clearSession(cookies);
    const lang = isLang(url.searchParams.get('lang')) ? url.searchParams.get('lang')! : 'en';
    if (!LEARNING_PUBLIC_URL) {
        return redirect(`/${lang}/`, 302);
    }
    return redirect(new URL('/auth/asalogout/logout.php', LEARNING_PUBLIC_URL).toString(), 302);
};
