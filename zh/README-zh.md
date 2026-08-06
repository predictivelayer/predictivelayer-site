# Chinese pages (zh/)

These are hand-maintained Simplified Chinese copies of the English pages at the site root (`zh/index.html` mirrors `index.html`, `zh/product.html` mirrors `product.html`, and so on) — there is no build step or i18n framework generating them.

Whenever you edit an English page's content (copy, nav, sections), make the matching edit in its `zh/` counterpart by hand; nothing keeps the two in sync automatically.

Shared assets (`styles.css`, `main.js`) are referenced one level up (`../styles.css?v=20`, `../main.js?v=10`) and are not duplicated — check both an English page and its `zh/` counterpart still render correctly after any shared CSS/JS change.
