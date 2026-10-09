# LLM Token Cost Calculator & Tool Call JSON Validator (2026 API Rates)

> A high-performance, **100% client-side** single-page web utility for global AI developers, prompt engineers, and tech leads. Calculate API token economics across major frontier models (OpenAI, Anthropic, Google, DeepSeek with **current 2026 rates**) and validate AI Tool Calling / Function Calling JSON schemas in real-time.

[![100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald.svg)](#privacy--security-guarantee)
[![Zero Backend](https://img.shields.io/badge/Architecture-Serverless%20Static-cyan.svg)](#deployment-options)
[![SEO & AdSense Ready](https://img.shields.io/badge/SEO-Schema.org%20JSON--LD-indigo.svg)](#seo--adsense-compliance)
[![2026 Rates](https://img.shields.io/badge/Rates-October%202026%20Edition-purple.svg)](#1-multi-model-token--cost-calculator-2026-rates)

---

## 🚀 Live Preview & Quick Start

Open `index.html` directly in any modern browser (Chrome, Safari, Edge, Firefox), or launch with zero installation:

```bash
# Option 1: Using Python 3 built-in server
python3 -m http.server 8080

# Option 2: Using Node.js npx serve
npx serve .
```

Then visit [http://localhost:8080](http://localhost:8080).

---

## 🌟 Core Features & Enhancements

### 1. Multi-Model Token & Cost Calculator (October 2026 Frontier Rates)
- **Timeliness Indicator:** Prominently tagged `Updated: Current / October 2026 Rates` with verified pricing and context limits for:
  - **Anthropic Claude 5.5 Generation:**
    - **Claude Opus 5.5:** \$4.00 / 1M in, \$20.00 / 1M out, \$0.20 / 1M cache read (1M context) &bull; Flagship agentic reasoning
    - **Claude Sonnet 5.5:** \$2.00 / 1M in, \$10.00 / 1M out, \$0.10 / 1M cache read (1M context) &bull; Daily coding workhorse
    - **Claude Haiku 5.5:** \$0.10 / 1M in, \$0.50 / 1M out, \$0.01 / 1M cache read (1M context) &bull; High-throughput subagents
  - **OpenAI GPT-6 Generation:**
    - **GPT-6 Astra:** \$10.00 / 1M in, \$50.00 / 1M out, \$1.00 / 1M cached (1.05M context) &bull; Flagship scientific & deep reasoning
    - **GPT-6.1 Sol:** \$2.00 / 1M in, \$10.00 / 1M out, \$0.10 / 1M cached (1.05M context) &bull; Cost-efficient agentic coding workhorse
    - **GPT-6 Luna:** \$0.10 / 1M in, \$0.50 / 1M out, \$0.01 / 1M cached (1.05M context) &bull; High-speed extraction & ingestion
    - **Long-context Standard pricing:** Above **272,000 total input tokens**, including cache hits, the **entire request** uses 2x input/cache rates and 1.5x output rates. The calculator applies this automatically: Astra $20/$75 ($2 cached), Sol $4/$15 ($0.20 cached), Luna $0.20/$0.75 ($0.02 cached), per 1M tokens. Exactly 272,000 input tokens retain the base rates. Sources: [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [Luna](https://developers.openai.com/api/docs/models/gpt-6-luna).
  - **Google Gemini 3 Generation:**
    - **Gemini 3.1 Pro Preview:** \$2.00 / 1M in, \$12.00 / 1M out, \$0.20 / 1M cached (2M context) &bull; Long-context multimodal reasoning
    - **Gemini 3.8 Flash Cyber:** \$0.90 / 1M in, \$4.50 / 1M out, \$0.09 / 1M cached (1M context) &bull; Security & vulnerability automation
    - **Gemini 3.8 Flash:** \$0.75 / 1M in, \$3.75 / 1M out (incl. thinking tokens), \$0.075 / 1M cached (1M context) &bull; Fast agentic workhorse
  - **DeepSeek V4.1 Generation (with Off-Peak Toggle):**
    - **DeepSeek-V4.1-Flash:** \$0.30 / 1M in, \$1.20 / 1M out (Peak) &rarr; **\$0.15 / 1M in, \$0.60 / 1M out (Off-Peak 50% discount)** (1M context)
    - **DeepSeek-V4-Pro:** \$1.32 / 1M in, \$3.96 / 1M out (Peak) &rarr; **\$0.66 / 1M in, \$1.98 / 1M out (Off-Peak)** (1M context)
- **Interactive Multi-Column Table Sorting:**
  - Click any table header to toggle between ascending and descending order.
  - Supports sorting by: Total Cost, Input Cost, Output Cost, Context Window size (e.g. 2M &rarr; 1M), Model Name, and Provider.
  - Visual sort arrow indicators (`▲`, `▼`, `↕`) clearly identify the active sorting dimension.
- **DeepSeek Off-Peak Discount Toggle:** Switch between Standard Peak pricing and the 50% Off-Peak discount window with one click.
- **BPE Heuristic Subword Estimator:** Real-time token approximation modeled on Byte-Pair Encoding (`cl100k_base`, `o200k_base`, Claude subwords, and DeepSeek Byte-level BPE 128k) with instant live counting.
- **Completion Output Slider:** Adjust completion tokens from 0 to 16,384 with 1-click preset buttons (256, 512, 1k, 2k, 4k, 8k).
- **Scale Simulation Multiplier:** Instantly simulate aggregate invoice costs across 1 call, 1,000 calls, 100,000 calls, or 1,000,000 calls.
- **Prompt Caching Discount Simulator:** Test 0% (cache miss), 50% hit, and 80% hit scenarios to visualize the 50%–95% cost reduction of prompt caching.
- **Custom Pricing Engine:** Add private, self-hosted (e.g. vLLM, Ollama), or fine-tuned model rates stored directly in browser `localStorage`.

### 2. CJK & Multilingual Token Expansion Analysis
- **Dynamic CJK Expansion Metric:** Detects non-ASCII / CJK characters (Chinese, Japanese, Korean) and calculates the **Token Expansion Ratio** (e.g. `~1.35x - 1.65x` vs standard ASCII English).
- **Proactive Engineering Guidance:** Displays an alert banner: *"Non-ASCII scripts incur higher subword token overhead; consider large vocabulary tokenizers (GPT-6, DeepSeek 128k) for superior East Asian character compression."*

### 3. AI Tool Call & Schema Closed-Loop Workflow
- **Real-Time JSON Syntax Checking:** Visual error cards with pinpoint Line and Column indicators, exact error descriptions, and caret (`^`) pointers.
- **AI Tool Schema Detection:**
  - OpenAI Tool Format (`type: "function"` with `parameters` object)
  - OpenAI Structured Outputs (`strict: true` and `additionalProperties: false` checks)
  - Anthropic Claude Tool Format (`input_schema` specification)
  - Tool Call Execution payloads (`tool_calls` array with arguments)
- **Direct Closed-Loop Action Buttons:**
  - `[Estimate Schema Token Cost]`: Transfers current tool schema directly to the Cost Calculator and triggers instant multi-model price computation.
  - `[Minify & Estimate Cost]`: Strips unnecessary whitespace to save context tokens, then updates cost estimation in real-time.
- **1-Click Sample Templates:** Loaders for OpenAI Weather Tool, Anthropic SQL Query Tool, Tool Execution Output, and Multi-Tool Arrays.

### 4. Lightweight SEO Landing Page Routing & State Persistence
- **Dedicated Keyword Landing Pages via URL Hash:**
  - `/#schema-validator`: Activates the Tool Schema & Function Call Validator directly, updating page `<title>` and `<meta name="description">` for keyword-targeted sharing.
  - `/#cache-calculator`: Directs users to the Prompt Caching discount simulator, highlighting and focusing the cache parameter panel.
  - `/#cost-matrix` & `/#audit-log`: Direct deep links to the multi-model comparison matrix and authoritative audit documentation.
  - `/#privacy-policy` & `/#terms-of-service`: Directly launches compliance modals.
- **State Synchronization (`#p=...&out=...&vol=...`):**
  - Stored completely in URL hash parameters for privacy and zero server-side state.
  - Click `[Share Calculation / Copy Link]` in the parameters bar to copy the full shareable URL with toast notification.

### 5. Trust, Credibility & Special Tiered Billing Rules
- **Pricing Data Sources & Audit Log:** Includes verifiable audit trails with documentation source pointers for OpenAI, Anthropic, Google Cloud Vertex AI, and DeepSeek.
- **Special Tiered Billing Tooltips:**
  - Gemini 3.1 Pro Preview: Prompts >200k tokens step up to \$4.00/1M in / \$18.00/1M out.
  - Gemini 3.8 Flash: Output tokens include internal reasoning / thinking process tokens.
  - Anthropic Claude 5.5: Cache write 5-minute TTL rules and 90-95% cache read discounts.
  - DeepSeek V4.1: UTC 01:00-04:00 & 06:00-10:00 peak hours schedule with 50% off-peak window.
- **Estimation Algorithm Disclaimer:** Clear notice on BPE heuristic (~0.75 words/token) vs. official provider tokenizers.

### 6. Developer UX & Views
- **Tabbed & Split-Screen Modes:** Toggle between single tab or side-by-side split screen on wide displays.
- **Dark / Light Theme:** Defaults to dark developer theme (`slate-900` with emerald and cyan accents) with light mode toggle.
- **Compliance & Feedback Entrances:** Real modal windows for Privacy Policy, Terms of Service, and direct email / GitHub feedback.

---

## 🔒 Privacy & Security Guarantee

- **Zero Telemetry on Prompts & Schemas:** 100% Client-Side Local Evaluation. All calculations, tokenization heuristics, and JSON parsing occur strictly inside the browser runtime.
- **Third-Party Advertising Transparency:** Third-party vendor services (such as Google AdSense or performance analytics) may use cookies in accordance with standard Google Advertising Privacy Policies. No prompt or schema data is shared.
- **No API Keys Required:** Runs entirely without third-party LLM key exposure.

---

## 📈 SEO & Google AdSense Architecture

To ensure strict compliance with Google AdSense quality guidelines and maximize organic search discoverability:

1. **Rich In-Depth Educational Articles:**
   - *"How LLM Tokenization Works: Tokens vs Words vs Characters (2026 Edition)"* (covering BPE, Tiktoken, CJK token inflation, code overhead).
   - *"How to Optimize Prompt Costs in Production: 4 Actionable Tips"* (Prompt caching breakpoints, schema minification, sliding context windows, tiered agent cascading).
2. **Interactive FAQ Accordion:**
   - Native `<details>` / `<summary>` tags with Chevron animations.
   - Fully matched with Schema.org `FAQPage` structured data.
3. **Structured Data (JSON-LD):**
   - `@type: "WebApplication"` with comprehensive feature lists, offers, and metadata.
   - `@type: "FAQPage"` containing all high-value Q&As for Google Rich Snippet display.
4. **AdSense Compliant Placement:**
   - Standard `"ADVERTISEMENT"` labeling without publisher praise or misleading claims.
   - Fixed minimum heights and CSS layout containment (`contain: layout paint`) to prevent Cumulative Layout Shift (CLS < 0.1).
   - Dedicated `privacy.html` and `terms.html` static pages for search crawler and AdSense policy verification.

5. **Pricing Authority Audit Log & Tiered Engine:**
   - Real authority documentation links to OpenAI (`/api/pricing`), Anthropic (`/about-claude/models`), Google Cloud (`ai.google.dev/pricing`), and DeepSeek (`platform.deepseek.com/pricing`).
   - Automated Tiered Pricing engine (>200k tokens for Gemini 3.1 Pro Preview, >100k for Claude Haiku 5.5) with real-time `[>200k Tier Active]` badge and dynamic billing tooltip notes.

---

## 🌐 1-Click Deployment Options

### Production Server

Production URL: https://tokens.yayaagent.com

The static site runs behind Caddy on the `new` SSH host. Releases are stored under `/srv/tokens/releases/`, and `/srv/tokens/current` points to the active release. Deploy only `index.html`, `privacy.html`, `terms.html`, `og-image.png`, `robots.txt`, and `sitemap.xml`; no Node.js, Python, or build step is required on the server.

The site configuration is in `deploy/Caddyfile`. Import it into the server's existing Caddy configuration, validate the combined configuration, and reload Caddy. The domain's A record must point to the server and ports 80/443 must be reachable so Caddy can obtain and renew HTTPS certificates.

### 1. Cloudflare Pages
1. Push repository to GitHub (`https://github.com/huyongbo668881985/tokens`).
2. Link repository in Cloudflare Pages dashboard.
3. Build command: None (leave blank).
4. Output directory: `.` (root).

### 2. Vercel
1. Import repository on [vercel.com](https://vercel.com).
2. Framework Preset: **Other**.
3. Output Directory: `./`.

### 3. GitHub Pages
1. Go to repository **Settings** &rarr; **Pages**.
2. Select branch `main` and folder `/ (root)`.
3. Save and your site will be live at `https://<username>.github.io/<repo>/`.

### Link Preview Image

`og-image.png` is the committed 1200 × 630 PNG cover used by Open Graph and Twitter link previews. It is served as a static file and requires no build step. `index.html` includes its dimensions, MIME type, and alternative text.

The production site URL is `https://tokens.yayaagent.com`. Before publishing to another domain, replace this URL in `index.html`, `privacy.html`, `terms.html`, `robots.txt`, and `sitemap.xml`. Keep `og:image` and `twitter:image` as absolute HTTPS URLs ending in `/og-image.png` (including a repository path prefix when using GitHub Pages). Do not depend on JavaScript to update these tags: preview crawlers read the initial HTML.

To regenerate the cover locally, use Python 3 with Pillow installed and run `python3 scripts/generate-og-image.py`. Deployments use the existing PNG directly.

### Pricing Regression Checks

Run `npm test` with Node.js to verify OpenAI tier boundaries, whole-request billing, cached input, call scaling, and the existing Anthropic/Gemini/DeepSeek pricing behavior. No npm dependencies are needed.

---

## 📬 Contact & Feedback

- **GitHub Repository:** [https://github.com/huyongbo668881985/tokens](https://github.com/huyongbo668881985/tokens)
- **Support & Inquiries:** [support@token-calculator.dev](mailto:support@token-calculator.dev)

---

## 📝 License

Distributed under the **MIT License**. Free for personal and commercial usage.
