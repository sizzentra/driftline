---
name: new-page
description: Driftline - adding a new page, tab, top-bar chip, side-panel section, currency or device setting (phones and PC). Lists every place that must be updated so nothing is left unreachable, unsearchable or untaught. Use before building any new screen or menu entry.
---
# Driftline: adding a page, chip, section, currency or setting

Design first (standing rule 7): sketch the whole layout and its purpose before moving UI; a new screen or reworked layout starts from the Driftline Design System's control cards (link in CLAUDE.md), and is added to `docs/PLATFORM_DESIGN.md` first when it covers something new. UI polish comes last (director, 2026-11-25): keep screens working and clear while systems change; the big PC overhaul is paused.

- **Any new page:** decide its one place first (top-bar chip, side-panel section, a section's pills, or a tab inside a page; never two places). Page engine: a `pages08.js` CFG entry; a new tab id needs a hidden `#tabs` button (`data-tab`, `data-label`) and draws through renderPanel, never an early return. Page-tab icon in quests08's masks. Quests: a lesson in `Q8_LESSONS`, a Find line if not reachable from MENU_SECS, a Help Q&A if players will ask. Search: a `SEARCH_IDX` entry. Badges only when there is something to do. QA tests that assume the old layout get a `MOB()` branch; never weaken PC checks.
- **New top-bar chip:** `header08.js` ensure() + order; a chip that opens its own page removes that page from side-panel sections; `fit()` priority (Tasks hides first, then Live shrinks/hides; core chips never hide); check 667/874/956 and the narrow layout for cut text; the info box never squeezes.
- **New side-panel section:** MENU_SECS order; both rails (`#tabs .secbar` and `#catdock`) rebuilt; must fit at 667×375.
- **New currency / resource:** strip cells, Quests lessons (where from, what for), Help Q&A, Stats.
- **New device setting:** add it to `DEV_KEYS`.
- **Every page is organised like the Aquarium** (key numbers + main action first, sections as tabs, one scrolling body). Never set `scrollTop` during a render.
- **Phone measurements live in one place:** `MB_FRAME` (frame) and `MB_UI` (one look per control kind) in `src/mobile/frame07.js`, mirrored in PLATFORM_DESIGN's table and enforced by `__spec`. A new phone surface (row, bar, corner) gets added to all three.


## Afterwards
- `tools/baseline.ps1 -Check`, read the list (only the new or changed pages may differ), then `-Make`.
- `tools/sweep_all.ps1 -Only gate,content,phone,parity` at least; the full run with the batch.
- Read every new text as that platform's player (docs/TEXT_STANDARD.md; "click" and "Space" are wrong on phones).
