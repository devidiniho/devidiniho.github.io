# AETHER Dashboard V5 — Real Quotes Fix

This version contains the previously prepared bank of 100 attributed quotations.

The earlier AETHER-authored quotations are not used.

## Important fix

The HTML now loads:

- `style.css?v=5`
- `script.js?v=5`

The query strings force Chrome and GitHub Pages to request the new files instead of continuing to use an older cached script.

## Installation

Replace all three files together:

- `index.html`
- `style.css`
- `script.js`

Commit them in the same GitHub commit. Wait for Pages to redeploy, then reload the site.

The quote panel will display:

- quotation
- real attributed author
- discipline/field badge
