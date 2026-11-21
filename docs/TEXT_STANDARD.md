# Driftline text standard (draft for the director, 2026-11-20)

One job: how every line of game text is written. The checkable rules are enforced by tools (listed at the end); the voice is judged by the director and Cam.

## The voice
Cozy, warm and a little funny, like a friend who fishes. The humour is light and never the point. Examples already in the game that set the tone:
- “It said ‘nah’.” (a fish got away)
- “Your cooler is full. Even the ice is complaining.”
- “The fishmonger counts it twice. Out loud.”
- “Line: 0. Fish: 1.”
- Pets: “Found in Mystery Crates. Stands on one leg. Very stylish haggler.”

## The rules
1. **Say it short: the moment, not the instructions** (director, 2026-11-20). “It’s jumping!” rather than “Get ready to let go!”. A hint or pop-up keeps everything it teaches, in as few words as it takes.
2. **Never shorten jokes** (director). Jokes (the fishmonger, lost and snapped fish, the full cooler, seashells, pet reactions) stay as written. In a pop-up that ends with a joke, only the part before the joke is kept short.
3. **Fish Log descriptions keep their details** (director). They are knowledge, not tooltips.
4. **Each device’s own words.** Phones: tap, touch and hold, let go; never click, hover, mouse, keyboard or Space. PC: click; keys only where the key really works. Both wordings are written side by side where the line lives (`PLAT.touch() ? '…' : '…'`), never swapped afterwards.
5. **Curly apostrophes and quotes only** (’ “ ”). A straight one once ended a string and took both phones down.
6. **American spelling: color** (director, 2026-11-21), everywhere players see it; checked by the text rules.
7. **Plain words.** Name things the way the game shows them (Your home, not dock; Fish Log, not journal). Numbers as the player sees them (short numbers, the chosen weight unit).
8. **Patch notes are spoiler-free but complete.** “21 new fish”, never their names; no crate-only or gift pets, hidden rods or exact odds.

## Lengths per place (approved by the director, 2026-11-20)
Measured on build 2114: the longest lines that read well today, rounded. Letters, not counting the joke at the end of a pop-up.

| Place | Limit | Today (typical / longest) |
|---|---|---|
| Fishing hint | 75 | 59 / 89 → shortened |
| Pop-up message | 80 (+ its joke; fish names vary) | 31 / 100 → shortened |
| Page description | 72 | 43 / 71 |
| Item lines (bait, rods, attachments, pets) | 70 | 42 / 67 |
| Skill lines | 85 | 31 / 82 |
| Feat lines | 45 | 24 / 41 |
| Jokes, Fish Log notes | none | |
| Phone lessons and Help answers | not yet (teaching text; 283 / 458 letters) | a decision for later |

## Checked by tools
- `__contentQC` rule 6: every visible line on every page and tab: device words and apostrophes.
- `__qa` “text standard”: the hints, every pop-up the tests caused, and the item lines: device words, apostrophes, lengths.
- `__qa` “patch notes stay spoiler-free”: the next update’s notes: no fish names, crate-only or gift pets, exact odds.
- `__textInv()` lists all player text by kind with lengths (the base for flavour text coverage, PLAN item F).
