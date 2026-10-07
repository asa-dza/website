# ASA Website

Public website for **Advanced Studies Academy (ASA)**.

This repository contains the code for the academy’s public website, an **Astro**
application under [`site/`](./site). See [`site/README.md`](./site/README.md) for
how to run and build it.

The site follows a **hybrid architecture**: stable pages are prerendered at build
time, and routes that need to run per request execute in the site's own Node
server. Both are served by one process — the Astro Node adapter in standalone
mode.

---

## Repository layout

```
site/     the Astro application — everything that is served
assets/   brand and design originals; no build reads these
config/   repository-wide configuration
docs/     the architecture document and its LaTeX sources
```

`site/` is the only directory the build touches. What is inside it, including
which images Astro processes and which are served verbatim, is documented in
[`site/README.md`](./site/README.md) rather than repeated here.

`assets/` holds what a designer works from, in the format it was authored in:
`assets/brand/` is the palette and typography as `.svg`, `.png`, `.odt` and
`.pdf`; `assets/logo/` is the logo, including `logo.pdf`; `assets/icons/` is the
favicon. Four of these files also exist inside the site — the three logo SVGs as
`site/src/assets/logo*.svg` and the favicon as `site/public/favicon.svg` — and
are byte-identical copies today. That duplication is deliberate, not an
oversight to clean up: Astro can only import and process a file that lives
inside the Astro project, so the site needs its own copy, while the root keeps
the master alongside the `.pdf` and `.odt` originals the site has no use for.
Change the root copy, then copy it into `site/`.

`config/` is empty. Repository-wide configuration belongs there if any appears.
The site's own build configuration is `site/astro.config.mjs`, which Astro
requires at the Astro project root and which therefore cannot move here.

---

## Architecture

ERPNext acts as the **system of record** for operational and publishable data.

Browser → Caddy → Website (Astro + Node) → Integration Layer → ERPNext / Moodle

- **Caddy**: the only public entry point; terminates TLS
- **Website**: serves prerendered pages, and runs server-side code for the rest
- **Integration layer**: a private service; the only thing that talks to ERPNext
  and Moodle
- **ERPNext**: learners, course offerings, registration requests and decisions
- **Moodle**: course delivery

The website reaches the integration layer over a Docker network that is
`internal: true`, and the integration layer publishes no host port and has no
public route. Deployment lives in the sibling `platform` repository.

---

## Static Content

Examples of static pages:

- Home
- About
- Contact
- Mission
- Institutional information

These pages rarely change and are served as static content for performance and reliability.

---

## Dynamic Content

**Implemented today:** one route, `/api/health`, which reports that the server is
running and executing code.

The section that stood here listed events, announcements and programs retrieved
from ERPNext and refreshed by **Incremental Static Regeneration**. None of it is
built, and the ISR part will not be built as described: ISR is a Next.js feature
and this site is Astro, which solves the same problem differently (on-demand
rendering plus caching, or a rebuild triggered by a content change). It is
recorded here as an intention, not as behaviour, and the mechanism is still open.

The registration flow is being built in phases: server execution (done),
authentication and email verification, registration submission, applicant status
and Moodle access, then end-to-end verification.

---

## Security

The browser **does not communicate directly with ERPNext or Moodle**, and neither
does this website: all such communication goes through the integration layer,
server-side.

The website holds no ERPNext or Moodle credential. It holds one credential for the
integration layer, authorized for submitting registration requests and nothing
else. It is declared through `astro:env` as a server-only secret, so Astro fails
the build rather than shipping it to a browser, and it is injected at runtime so
it is never baked into an image.

---

## Development

From `site/`:

```sh
npm install
npm run dev
```

To run it as it is actually deployed — containerized, behind the platform stack,
with the integration layer reachable — use the `platform` repository instead:

```sh
cd ../platform && make up
```

## Deployment

```
Caddy → website container (Astro + Node adapter, standalone) → integration → ERPNext / Moodle
```

The container is defined by [`site/Dockerfile`](./site/Dockerfile) and built by the
`platform` repository's Compose stack, which owns the deployment. The site needs a
Node runtime now — it is no longer a directory of files that any static host could
serve.
