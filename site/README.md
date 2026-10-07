# The ASA website

An Astro application. Most of it is prerendered at build time; a small and
growing part of it executes on the server, per request.

This file replaces the Astro starter-kit README that was here. That one described
a generic minimal template — `localhost:4321`, a single `index.astro`, a link to
Astro's Discord — none of which matched this project.

## What runs where

`astro.config.mjs` sets the **Node adapter in standalone mode** and leaves
`output` at its default. Together those mean:

- every page under `src/pages` is built to static HTML unless it says otherwise;
- a route that exports `prerender = false` is rendered on demand instead;
- one Node process serves both, so there is no separate file server.

Today that is 49 prerendered pages (three languages of institutional content,
including the `[slug]` routes) and exactly one on-demand route, `/api/health`.

`export const prerender = false;` is what moves a route to the server. Forgetting
it is the likeliest mistake in this codebase: the route gets built once at compile
time and serves a frozen answer forever, which looks like it works.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Build to `./dist/` (`dist/client` + `dist/server`) |
| `npm run preview` | Run the built server locally |
| `npx astro sync` | Regenerate `.astro/` types, including `astro:env` |
| `npx tsc --noEmit` | Typecheck |

## Configuration

Declared in `astro.config.mjs` under `env.schema`, not read through
`import.meta.env`. Both are `context: 'server', access: 'secret'`, which means
Astro reads them from the environment **at runtime** and fails the build if
client-side code ever imports them.

| Variable | Required | Meaning |
|---|---|---|
| `INTEGRATION_BASE_URL` | when read | Where the private integration service answers, e.g. `http://integration:3001` |
| `INTEGRATION_WEBSITE_TOKEN` | when read | The website's credential for that service, used by the registration entry point |
| `WEBSITE_PUBLIC_URL` | for sign-in | The origin learners use, e.g. `http://127.0.0.1:3002`; the OIDC redirect URI is derived from it |
| `OIDC_ISSUER` | for sign-in | The account service's issuer for this client, e.g. `https://account.asadza.test/application/o/website/` |
| `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` | for sign-in | This site's confidential OIDC client |
| `WEBSITE_SESSION_SECRET` | for sign-in | Key material for the encrypted session cookie |
| `ACCOUNT_PUBLIC_URL`, `LEARNING_PUBLIC_URL` | optional | Where the account page links to (change address, change password, sign out chain, open the learning platform) |

Because both are runtime values, a plain `npm run build` needs neither.

Neither belongs in a file in this repository. Both come from the platform stack's
`.env` — see `platform/.env.example`.

**The website holds no ERPNext or Moodle credential, and must not be given one.**
It reaches both only through the integration service.

## Sign-in and the account page

The website never sees a password. `/auth/login` starts an OpenID Connect
authorization-code flow with PKCE at the account service (through its
language redirector, so the learner meets it in the language they were using),
`/auth/callback` exchanges the code server-side and stores the claims in an
encrypted, HTTP-only session cookie (`asa_session`), and `/auth/logout` clears
it and hands over to the learning platform's coordinated sign-out. All three
are on-demand routes in `src/pages/auth/`; the helpers are in
`src/lib/server/oidc.ts` and `src/lib/server/session.ts`.

What the session carries is the identity the account service asserted: the
issuer, the subject, the account-service user id, the name and the address.
`/{lang}/account/` shows it; `/{lang}/register/[code]/` submits a registration
request to the integration service **from the session**, never from form
fields, so a request is bound to the identity that was signed in. An identity
the account service has not verified is refused by the integration (`403`,
`IDENTITY_REFUSED`) and the page says so.

## Server-only code

`src/lib/server/` is for modules that must never reach a browser. The convention
is the directory name; the enforcement is `astro:env/server`, which Astro refuses
to bundle into client output.

## Running it

Standalone, to look at the site by itself:

```sh
docker compose up --build
```

then `http://127.0.0.1:8085`. The compose file here points
`INTEGRATION_BASE_URL` at a host that does not resolve, because nothing this
phase serves needs it.

The real deployment is the platform repository's stack, which builds this same
image, puts it on the private `services` network, and puts Caddy in front:

```sh
cd ../../platform && make up
```

then `http://127.0.0.1:${WEBSITE_HTTP_PORT}`.

## Structure

```
src/pages/           routes; file path is URL path, one directory per language
src/pages/api/       on-demand endpoints
src/layouts/         page shells
src/components/      shared markup
src/lib/             shared logic; lib/server/ is server-only
src/i18n/            navigation and site strings per language; the Lang type
src/data/            content that is not a page
src/data/fixtures/   invented sample records, not content
src/assets/          images pages import; the build processes these
src/styles/          global CSS
public/              served verbatim at the site root
```

Only `src/pages/` is fixed by Astro; every other directory above is this
project's convention and could be renamed. Two things about `src/pages/` are
easy to get wrong:

- a file or directory whose name starts with `_` is not a route — Astro excludes
  it from routing silently, worth knowing before naming an endpoint;
- the three language directories are three real route trees, not a translation
  layer. `/en/workshops/` and `/fr/workshops/` are separate files.

### Images: `src/assets/` or `public/`

This is an Astro distinction, not a preference, and the two are not
interchangeable:

- **`src/assets/`** — imported by a page (`import img from "../../assets/x.png"`)
  and handed to `<Image>`. Astro processes these: they are converted, resized
  and emitted under `/_astro/` with a content hash in the filename. A missing
  file is a build error. The field images and the logos work this way.
- **`public/`** — copied into the build untouched and served at the path it has
  here, so `public/assets/images/workshops/x.png` is `/assets/images/workshops/x.png`
  in the browser. Nothing optimizes it and nothing checks it exists; a wrong
  path is a 404 at runtime, not a failed build. `favicon.svg` and every image
  referenced by a *string* — the workshop and instructor pictures in the sample
  data — work this way.

The rule follows from how the image is named: a record that carries `src` as a
string cannot be an import, so those files have to be under `public/`. Moving
one of them into `src/` would change its public URL and break the string.

The repository root also has an `assets/` directory. It is not part of the
build — see the root [README](../README.md).

### Sample workshop data

`src/lib/workshops.ts` is the module pages import: the types, the label tables,
and `getAllWorkshops` / `getWorkshopBySlug` / `getWorkshopSlugs`. The records
those functions return are in `src/data/fixtures/workshops.ts`, and they are
invented — no workshop listed has been offered. `USE_TEST_DATA` in
`src/lib/workshops.ts` is the switch: with it `false` the same three functions
answer empty, and that is the shape ERPNext has to fill later.

A record needs `published: true` to appear anywhere. The filtering is done by
the lookups, not by the fixture file.
