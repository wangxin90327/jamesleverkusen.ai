# James Leverkusen — Cloudflare Workers Website

This is the complete Cloudflare Workers Static Assets source package.

## Site structure

- `/` — Home and Leadership
- `/company/` — Company
- `/thesis/` — Investment Thesis
- `/focus/` — Investment Focus
- `/approach/` — Investment Approach
- `/contact/` — Contact and Legal

## GitHub upload

Upload every file and folder in this package to the root of the GitHub repository. The repository root must contain `package.json`, `worker.js`, `wrangler.toml`, `scripts/`, and `src/`.

## Cloudflare Workers Builds

- Production branch: `main`
- Root directory: leave blank
- Build command: `npm run build`
- Deploy command: `npm run deploy`

The build command copies the complete website from `src/` into `dist/`. Wrangler then publishes `dist/` through the existing Worker named `axiomnorth-aipro`.
