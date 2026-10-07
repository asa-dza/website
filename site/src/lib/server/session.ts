import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { WEBSITE_PUBLIC_URL, WEBSITE_SESSION_SECRET } from 'astro:env/server';

/**
 * The website's own session: who the signed-in learner is, as the account
 * service said at sign-in.
 *
 * ## What it is, and is not
 *
 * An encrypted, authenticated cookie (AES-256-GCM under a key derived from
 * `WEBSITE_SESSION_SECRET`), holding the identity claims the ID token
 * carried and nothing a form could edit. It is the website's session only:
 * it does not sign the learner in to the account service or the learning
 * platform, and ending it (`/auth/logout`) hands the browser on to those
 * two so that all three end together.
 *
 * It is a snapshot. The account service's CURRENT state decides what a
 * learner may do; the integration layer re-reads it at submission. The
 * website uses the session to know who to submit for and what to show.
 *
 * ## The three identifiers
 *
 * `issuer` and `subject` are the ID token's `iss` and `sub`; `providerUserId`
 * is the account service's internal id from the `asa_identity` scope. They
 * are kept apart because the integration layer records all of them: tokens
 * carry the subject, the account service's change notifications carry the
 * internal id, and neither can be derived from the other.
 */
export interface Session {
    readonly issuer: string;
    readonly subject: string;
    readonly providerUserId: string;
    readonly providerUserUuid: string | null;
    readonly name: string;
    readonly email: string;
    readonly issuedAt: number;
    readonly expiresAt: number;
}

export const SESSION_COOKIE = 'asa_session';

/** The round-trip state cookie, alive only between /auth/login and /auth/callback. */
export const HANDSHAKE_COOKIE = 'asa_oidc';

export interface Handshake {
    readonly state: string;
    readonly nonce: string;
    readonly codeVerifier: string;
    readonly next: string;
    readonly lang: string;
    readonly issuedAt: number;
}

const SESSION_TTL_SECONDS = 8 * 60 * 60;
const HANDSHAKE_TTL_SECONDS = 10 * 60;

function key(): Buffer {
    if (!WEBSITE_SESSION_SECRET || WEBSITE_SESSION_SECRET.length < 24) {
        throw new Error('WEBSITE_SESSION_SECRET is not set or too short; sessions are unavailable.');
    }
    return createHash('sha256').update(WEBSITE_SESSION_SECRET).digest();
}

/** AES-256-GCM: `iv.ciphertext.tag`, base64url. The tag authenticates the whole. */
export function seal(payload: unknown): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key(), iv);
    const body = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [iv, body, tag].map((part) => part.toString('base64url')).join('.');
}

export function unseal<T>(token: string | undefined): T | null {
    if (!token) {
        return null;
    }
    try {
        const [iv, body, tag] = token.split('.').map((part) => Buffer.from(part, 'base64url'));
        const decipher = createDecipheriv('aes-256-gcm', key(), iv);
        decipher.setAuthTag(tag);
        const plain = Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
        return JSON.parse(plain) as T;
    } catch {
        // A tampered, truncated or differently-keyed cookie is simply absent.
        return null;
    }
}

function secure(): boolean {
    return (WEBSITE_PUBLIC_URL ?? '').startsWith('https://');
}

export function readSession(cookies: AstroCookies): Session | null {
    const session = unseal<Session>(cookies.get(SESSION_COOKIE)?.value);
    if (!session || typeof session.subject !== 'string' || session.expiresAt < Date.now()) {
        return null;
    }
    return session;
}

export function writeSession(
    cookies: AstroCookies,
    identity: Omit<Session, 'issuedAt' | 'expiresAt'>,
): Session {
    const now = Date.now();
    const session: Session = { ...identity, issuedAt: now, expiresAt: now + SESSION_TTL_SECONDS * 1000 };
    cookies.set(SESSION_COOKIE, seal(session), {
        httpOnly: true,
        sameSite: 'lax',
        secure: secure(),
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
    });
    return session;
}

export function clearSession(cookies: AstroCookies): void {
    cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function writeHandshake(cookies: AstroCookies, handshake: Handshake): void {
    cookies.set(HANDSHAKE_COOKIE, seal(handshake), {
        httpOnly: true,
        sameSite: 'lax',
        secure: secure(),
        path: '/auth/',
        maxAge: HANDSHAKE_TTL_SECONDS,
    });
}

export function readHandshake(cookies: AstroCookies): Handshake | null {
    const handshake = unseal<Handshake>(cookies.get(HANDSHAKE_COOKIE)?.value);
    if (!handshake || handshake.issuedAt + HANDSHAKE_TTL_SECONDS * 1000 < Date.now()) {
        return null;
    }
    return handshake;
}

export function clearHandshake(cookies: AstroCookies): void {
    cookies.delete(HANDSHAKE_COOKIE, { path: '/auth/' });
}
