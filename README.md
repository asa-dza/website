# ASA Website

Public website for **Advanced Studies Academy (ASA)**.

This repository contains the code for the academy’s public website. The site follows a **hybrid architecture**: stable pages are static, while structured content such as events and announcements is retrieved from **ERPNext** and refreshed using **Incremental Static Regeneration (ISR)**.

---

## Architecture

ERPNext acts as the **system of record** for operational and publishable data.

Browser → Website → Integration Layer → ERPNext API

- **ERPNext**: events, programs, announcements, instructors
- **Integration layer**: retrieves and transforms ERPNext data
- **Website**: renders static pages and ISR-generated content

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

Dynamic sections retrieve structured data from ERPNext:

- Upcoming events
- Past events
- Event detail pages
- Announcements
- Programs

Pages are regenerated periodically using **Incremental Static Regeneration (ISR)** so updates appear without rebuilding the entire site.

---

## Security

The browser **does not communicate directly with ERPNext**.

All ERPNext communication occurs server-side through the integration layer to prevent exposure of API credentials.

---

## Development

Install dependencies:

npm install

Run the development server:

npm run dev

## Deployment

Typical deployment architecture:

Caddy → Website container → ERPNext

The website can be deployed using Docker or any Node-compatible hosting environment.
