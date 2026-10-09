# Token Budget

A static LLM token cost calculator and monthly workflow budget planner.

Live site: [tokens.yayaagent.com](https://tokens.yayaagent.com)

## Features

- Enter uncached input, cached input, and output tokens for a representative call, or estimate input tokens from pasted text.
- Plan monthly volume with tasks per day, API calls per task, active days, and an extra-call allowance for retries.
- Compare token charges across OpenAI, Anthropic, Google, DeepSeek, and custom model rates.
- View per-call cost, per-task cost, period totals, input/output breakdown, and cache-read savings.
- Apply long-context pricing tiers to each call, including cached input. Show warnings when input plus output exceeds the catalog context limit.
- Share counts, budget settings, and selected custom model rates without including raw prompts or schemas. Previously shared text links remain readable.
- Validate JSON syntax and lint common tool schemas using the separate JSON Tools tab. Transfer schemas to the text estimate.
- Dark/light themes and responsive layout. Calculations run locally; no API key or backend is required.

## Calculation scope

Token costs are `(uncached input × input rate + cached input × cache-read rate + output × output rate) / 1,000,000`, multiplied by the period's call count.

Monthly calls are rounded up from `tasks/day × calls/task × active days × (1 + extra-call percentage / 100)`. Every call uses the same token mix. This is a planning allowance, not an expected-value model of recursive retries.

Text counts are approximate and do not use official provider tokenizers. Comparisons apply the same counts to every model, while actual tokenization and task performance can differ. Cache-write surcharges, storage, tools, taxes, and other API charges are excluded. JSON linting does not guarantee acceptance by a provider API.

The catalog is a manually maintained October 2026 snapshot. Review the official pricing links on the page before committing a budget. Google models use global Standard PayGo rates; Gemini Flash Cyber is allowlisted and uses $1.50 input / $0.15 cache read / $7.50 output per million tokens. DeepSeek supports an explicit off-peak toggle. Custom cache-read rates are entered separately.

## Local development

The committed stylesheet is ready to serve. Run `npm run dev` and open `http://localhost:8080`.

After changing HTML classes or CSS, run:

```sh
npm ci
npm run build
npm test
```

Tailwind CSS 3.4.17 is pinned as a development dependency. `styles/input.css` and `tailwind.config.cjs` generate `assets/site.css`. No external CSS runtime is loaded in the browser, and production needs no Node.js or build process.

Tests exercise the actual inline calculator logic, including monthly volume, real cached counts, share-link restoration/privacy, invalid inputs, zero traffic, and long-context pricing boundaries.

## Deployment

The production site runs behind Caddy on the `new` SSH host. Releases live in `/srv/tokens/releases/`, and `/srv/tokens/current` points to the active release. Publish only:

```text
index.html
privacy.html
terms.html
og-image.png
robots.txt
sitemap.xml
assets/site.css
```

The existing Caddy site configuration is in `deploy/Caddyfile`. For updates, upload a fresh release, verify its public files, and atomically change the current symlink. Keep the previous release for rollback. Domain A records point to the server; Caddy manages HTTPS.

For another static host, deploy the same files. The committed CSS can be served directly; if using a build step, run `npm ci && npm run build` before copying the public files. Canonical, sharing, robots, and sitemap URLs use `https://tokens.yayaagent.com` and must be updated together if the domain changes.

`og-image.png` is the 1200 × 630 share cover. Regenerate it with `python3 scripts/generate-og-image.py` (Pillow required locally).

Ads and analytics are not enabled. Feedback: [GitHub Issues](https://github.com/huyongbo668881985/tokens/issues).

## License

MIT.
