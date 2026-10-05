# James Leverkusen — Cloudflare Workers Website

This is the complete Cloudflare Workers Static Assets source package.

## Site structure

- `/` — Home and Leadership
- `/company/` — Company
- `/thesis/` — Investment Thesis
- `/focus/` — Investment Focus
- `/approach/` — Investment Approach
- `/contact/` — Contact and Legal

## Shared layout and brand assets

The site header, footer, and browser icons are maintained in shared files:

- `src/partials/header.html`
- `src/partials/footer.html`
- `src/partials/head-icons.html`
- `src/james-leverkusen-gold-mark.png`
- `src/favicon.ico`
- `src/apple-touch-icon.png`

Edit either partial once and redeploy. The build script inserts the updated
markup into every page and automatically applies the active navigation state.
Do not edit header or footer markup inside `dist/`; that directory is rebuilt
from `src/` during every deployment.

## Company image carousel

- Carousel markup: `src/company/index.html`
- Carousel behavior: `src/company-carousel.js`
- Company images: `src/company-media/`
- Carousel styling: the `.company-carousel` section in `src/styles.css`

The five-image carousel advances every six seconds and includes arrow controls,
slide indicators, keyboard support, pause-on-hover, and reduced-motion support.

## GitHub upload

Upload every file and folder in this package to the root of the GitHub repository. The repository root must contain `package.json`, `worker.js`, `wrangler.toml`, `scripts/`, and `src/`.

## Cloudflare Workers Builds

- Production branch: `main`
- Root directory: leave blank
- Build command: `npm run build`
- Deploy command: `npm run deploy`

The build command generates the complete website in `dist/`, including the
shared header and footer on every page. Wrangler then publishes `dist/` through
the existing Worker named `axiomnorth-aipro`.
