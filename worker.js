const FOOTER_HTML = `
<footer>
  <div class="footer-primary">
    <a class="brand footer-brand" href="/">
      <img class="brand-mark" src="/axiom-north-gold-favicon.ico" alt="" width="42" height="42" aria-hidden="true">
      <span class="brand-name">Axiom North <em>Ventures</em></span>
    </a>
    <p>11150 Santa Monica Blvd, Suite 1500 · Los Angeles, CA 90025</p>
  </div>
  <nav class="footer-nav" aria-label="Footer navigation">
    <a href="/#team">Leadership</a>
    <a href="/company/">Company</a>
    <a href="/thesis/">Thesis</a>
    <a href="/focus/">Focus</a>
    <a href="/approach/">Approach</a>
    <a href="/contact/">Contact</a>
    <a href="/contact/#privacy">Privacy</a>
    <a href="/contact/#terms">Terms</a>
    <a href="/contact/#risk">Risk</a>
  </nav>
  <div class="footer-meta">
    <p>© 2026 Axiom North Ventures. All rights reserved.</p>
  </div>
</footer>`;

function normalizeRoute(pathname) {
  if (pathname === "/" || pathname === "/index.html") return "/";

  const page = pathname.match(
    /^\/(company|thesis|focus|approach|contact)(?:\/|\/index\.html)?$/,
  );

  return page ? `/${page[1]}/` : pathname;
}

function currentAttribute(currentRoute, linkRoute) {
  return currentRoute === linkRoute ? ' aria-current="page"' : "";
}

function renderHeader(currentRoute) {
  const active = (route) => currentAttribute(currentRoute, route);

  return `
<header class="site-header">
  <a class="brand" href="/" aria-label="Axiom North Ventures home">
    <img class="brand-mark" src="/axiom-north-gold-favicon.ico" alt="" width="42" height="42" aria-hidden="true">
    <span class="brand-name">Axiom North <em>Ventures</em></span>
  </a>
  <nav class="primary-nav" aria-label="Primary navigation">
    <a href="/#team"${active("/")}>Leadership</a>
    <a href="/company/"${active("/company/")}>Company</a>
    <a href="/thesis/"${active("/thesis/")}>Thesis</a>
    <a href="/focus/"${active("/focus/")}>Focus</a>
    <a href="/approach/"${active("/approach/")}>Approach</a>
  </nav>
  <a class="header-link" href="/contact/"${active("/contact/")}>Contact</a>
  <details class="mobile-nav">
    <summary>Menu</summary>
    <nav aria-label="Mobile navigation">
      <a href="/"${active("/")}>Home</a>
      <a href="/#team">Leadership</a>
      <a href="/company/"${active("/company/")}>Company</a>
      <a href="/thesis/"${active("/thesis/")}>Thesis</a>
      <a href="/focus/"${active("/focus/")}>Focus</a>
      <a href="/approach/"${active("/approach/")}>Approach</a>
      <a href="/contact/"${active("/contact/")}>Contact</a>
    </nav>
  </details>
</header>`;
}

class SharedLayout {
  constructor(html) {
    this.html = html;
  }

  element(element) {
    element.replace(this.html, { html: true });
  }
}

class WebsiteIcon {
  element(element) {
    element.append(
      '<link rel="icon" href="/axiom-north-gold-favicon.ico" sizes="any"><link rel="shortcut icon" href="/axiom-north-gold-favicon.ico">',
      { html: true },
    );
  }
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
      return response;
    }

    const currentRoute = normalizeRoute(new URL(request.url).pathname);

    return new HTMLRewriter()
      .on("head", new WebsiteIcon())
      .on("header.site-header", new SharedLayout(renderHeader(currentRoute)))
      .on("footer", new SharedLayout(FOOTER_HTML))
      .transform(response);
  },
};
