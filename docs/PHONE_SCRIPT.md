# The 5-minute phone script (layer 2)

For every test build, once each: the director on the iPhone, Cam on the Pixel. Same 10 steps every time, so the device reports can be compared from build to build. Written 2026-11-19 (phase 2); **first run: both of you flag any step that is unclear**, and Claude rewords it before it is relied on.

**Before you start:** open the test app from your **home screen** (iPhone: "DL Test iPhone"; Pixel: "DL Test Android"). If it isn't installed yet: open https://sizzentra.github.io/driftline-test/ in Safari / Chrome, pick your phone, then Share › Add to Home Screen (iPhone) or ⋮ › Add to Home screen / Install (Pixel). Hold the phone sideways.

| # | Do this | Look for (say what you saw if anything is off) |
|---|---|---|
| 1 | **Open the app from the home screen.** Tap the small "test build" pill, check the stamp in the report matches the one in Claude's message, tap **Start over**, then **✕**. | Opens full screen with no browser bars; the stamp matches. |
| 2 | **Top bar.** Look along the whole top row without tapping. | Every chip readable (Bait, the water name, coins): nothing cut ("Aquari…"), nothing under the camera or a corner, nothing jumps a moment after opening. |
| 3 | **Open a menu, switch pages.** Tap three different buttons in the side rail, one after another, then a tab inside one page. | Each page opens on the first tap; the tab you tapped is the one lit; no name shown twice; the rail reaches the bottom (not cut after Quests). |
| 4 | **Back to fishing.** Close the menu (Back / ✕). | You land on the water, not on a bait list or another page. |
| 5 | **One catch.** Cast, hook, reel it in all the way, then close the catch card. | Cast and hook answer every tap; the fight feels smooth; the card closes on the first tap. |
| 6 | **Aquarium.** Open the Aquarium from the top bar, watch the fish for 10 seconds, switch its tabs. | Fish swim smoothly (no stutter); numbers on the bar are not cut. |
| 7 | **The shop.** Open the shop (Tackle or Rods) and look at the first items. Don't buy anything. | Prices readable, buttons fit, pets awake. |
| 8 | **Scroll a long page.** Open the Fish Log, swipe down to the bottom and back up quickly, then tap a fish far down the list. | Scrolling follows your finger and never drags the whole screen; the fish's details appear where you can see them. |
| 9 | **Leave and come back.** Go to the home screen, wait 5 seconds, open the app again from its icon. | It comes back where you were, still full screen, no "update" bar. |
| 10 | **Send the report.** Tap the "test build" pill, then **Copy report**. Director: paste it into the Driftline session. Cam: text it to the director. Add one line on anything from steps 1–9 that looked or felt wrong (a screenshot helps). | The report shows the screens you visited and "Errors (0)". |

**What Claude does with it:** compares both reports with the last build (fps per screen, worst stutters, errors and the screen they happened on), fixes anything new, and adds a check for anything a check could have caught (rule 5). Anything only a phone can show stays on the phone list.

**Takes longer than 5 minutes, or a step makes no sense?** Say so: the script is meant to be the same 10 steps every time, so it has to be quick and clear.

## The device report (test builds only)
- **Open it:** tap the small "test build" pill on the water (top left when sideways). The live game never has it.
- **What it records while you play:** how smooth each screen ran (frames per second, the worst frame, how many stutters over 50 ms), any error the game hit and the screen it was on, your screen size, iOS / Android version, whether you're in the installed app, and the build stamp. Nothing leaves the phone until you copy it.
- **Buttons:** **Copy report** (puts it on the clipboard as plain text), **Start over** (clears it; do this at step 1), **✕** (close).
- **It keeps counting** across reloads and app switches until you tap Start over or a new test build arrives.
- **A phone can't tell its model,** so the report shows the screen size and OS version instead; that's enough to tell your two phones apart.
