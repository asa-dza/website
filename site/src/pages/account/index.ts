import type { APIRoute } from 'astro';
import { isLang, type Lang } from '../../i18n/site.ts';

export const prerender = false;

/**
 * The language-neutral account address the account service sends a learner
 * to (its brand's default application). Picks the learner's language and
 * redirects to the real page. The order is the one the lab established:
 * an explicit choice, then the saved preference, then the browser, then the
 * institution default.
 */
export const GET: APIRoute = ({ url, cookies, request, redirect }) => {
    const explicit = url.searchParams.get('lang');
    const saved = cookies.get('asa_lang')?.value;
    const browser = (request.headers.get('accept-language') ?? '')
        .split(',')
        .map((part) => part.trim().split(';')[0].toLowerCase().split('-')[0])
        .find((code) => isLang(code));
    const lang: Lang = isLang(explicit) ? explicit : isLang(saved) ? saved : isLang(browser) ? browser : 'en';
    const query = url.search ? url.search.replace(/[?&]lang=[^&]*/, '').replace(/^&/, '?') : '';
    return redirect(`/${lang}/account/${query}`, 302);
};
