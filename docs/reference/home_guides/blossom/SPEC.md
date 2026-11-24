# Cherry Blossom tea house: measurements for the painted prototype (2026-11-24)

Measured in test build 2026.11.24-0140, daytime, clear weather, from the game itself (`__shot`, full canvas), with a temporary copy that drew only the seat (no tea house). The home system is unchanged; nothing here is in the game yet.

## Unit: the angler's height (AH)
The standing angler with cap, feet to cap top. Everything below is given in AH so it holds on every screen.
- iPhone 16 Pro Max (956x440; the scene is 808x383 inside the phone frame, angler scale 0.91): **1 AH = 61 px**.
- PC full screen (1920x1080; the scene is 1886x954, drawn at 1.5x = 2829x1431 pixels, angler scale 1.25, the maximum): **1 AH = 83 px on screen = 125 picture pixels**.

## Where things are (scene px; PC also in picture px)
| | iPhone (808x383) | PC (1886x954 / picture 2829x1431) | In AH |
|---|---|---|---|
| Deck surface (feet of angler, seat, pet) | y 230 (0.60 of the height) | y 572 / 859 | — |
| Waterline | y 259 (0.675 of the height) | y 644 / 966 | 0.47 AH below the deck on iPhone, 0.86 AH on PC |
| Angler (standing) | x 88-110, y 168-231 (centre x 0.12 of the width) | x 213-247 / 320-370 | 1 AH tall, 0.36 AH wide |
| Seat (zabuton cushion) | x 120-140 | x 291-320 / 436-480 | right of the angler, 0.3 AH wide |
| Pet | x 55-84 | x 168-209 / 252-314 | left of the angler, about 0.35 AH tall |
| Deck's right end | x 153 (0.19 of the width) | x 360 / 540 | 0.9 AH (iPhone) to 1.6 AH (PC) right of the angler |
| Home's right edge (roof eaves) | x 165 (0.204 of the width) | x 390 / 585 | — |
| Home's top (roof ridge) | y 96 | y 377 / 565 | 2.2 AH (iPhone) to 2.35 AH (PC) above the deck |
| Home's left edge | runs off the left of the screen | x 0 (whole house visible) | — |

## What this means for the painting
- **The house stands behind the angler;** the angler, seat and pet stand on the deck in front of its wall, near its right end. The front railing is drawn in front of them.
- **Fishing goes to the right:** the deck's right end is open to the lake; nothing tall stands right of the angler past the deck end.
- **Size:** the house is about 4.7 AH wide on PC (fully visible) and 2.7 AH of it shows on iPhone (its left part is cut by the screen edge). Paint it about 5 AH wide, about 2.4 AH from deck to ridge, so the left 40% can be cut off on phones and nothing important sits there.
- **Posts:** the deck sits 0.47 AH above the water on iPhone and 0.86 AH on PC, so the posts are painted about 1.3 AH long below the deck; the game cuts and fades them at the waterline.
- **Picture size:** the house is about 585 x 400 picture pixels on PC at 1.5x, so a painting about 1536 px wide gives room to spare. ChatGPT's 1536x1024 landscape canvas fits.
- **Layers:** picture A is the complete house without the front railing; picture B is the front railing alone, same scale. Window glow, lantern glow, reflections, the waterline and dusk/night are made in the game from the day painting.

## The guide pictures (this folder)
- `guide_pc_close.jpg` and `guide_phone_close.jpg`: the lake with the angler, seat and pet at their real size and no house, marked: home boundary (red), deck surface (yellow), deck end (yellow dots), waterline (cyan), angler (green), seat (orange), pet (purple), fishing direction (white arrow).
- `guide_pc_full.jpg` and `guide_phone_full.jpg`: the same over the whole screen.
- `guide_pc_current.jpg`: today's code-drawn tea house in the same spot, with the same marks.
- The prompt for ChatGPT: `PROMPT.txt`.
