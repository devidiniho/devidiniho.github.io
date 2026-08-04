# AETHER Dashboard V6 — Layout Fix

This version restores the original three-column resource-card layout.

The prior stylesheet accidentally lost the main `.dashboard-grid` rule, which caused all six middle cards to stack vertically at full width.

## Replace together

- `index.html`
- `style.css`
- `script.js`

The HTML now requests `style.css?v=6` and `script.js?v=6` to bypass cached copies.
