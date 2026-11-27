---
name: quick-path
description: Driftline small change (a text fix, a number, one page's look, one water's art) - edit, build, gate, the one relevant check on the platform it touches, a test-notes line, publish to the test builds. Use for any small Driftline change instead of the full batch routine.
---
# Driftline: the quick path for small changes
(director, 2026-11-21: "overkilling the tests" cost time and usage)

A text fix, a number, one page's look or one water's art: edit → build → `next/sweep.html?only=gate&go` → only the check for what changed, **only on the platform it touches** (`?for=pc` for a PC file, `?for=phones` for a phone file, both only for shared code; `?only=phone`, `?only=content`, `?only=maps&water=<id>` …) → one test-notes line → publish to the test builds. Minutes, not the 40-minute sweep. No pictures unless the look changed; no new check tools in the middle of a feature (build one only when the same kind of bug has escaped twice). **The full checklist (the full-batch skill) runs once per batch before it is published, and always before anything goes live**; live hotfixes stay as strict as before.


## The same steps with the one-command tools (since 2026-11-26)
1. Edit `src/`.
2. `powershell -ExecutionPolicy Bypass -File build.ps1 -Preview` (5 seconds; it refuses garbled characters, bad bug-log rows, unused functions and new wrap layers).
3. Gate and the one check: `powershell -ExecutionPolicy Bypass -File tools/sweep_all.ps1 -Saves new -Only gate,boot` plus the part that covers the change (`-Only gate,content`, `-Only gate,qa`, `-Only gate,maps` ...). In the pane: `next/sweep.html?only=gate&go`.
4. A change that must not alter anything on screen: `tools/baseline.ps1 -Check` must pass. A change that is meant to alter the look: check, read the list of what changed (it must be only what you meant), then `tools/baseline.ps1 -Make`.
5. One line under `## New in this build` in `src/pc/notes_test.js` and/or `src/mobile/notes_test.js` (curly apostrophes only).
6. Publish: the `publish-test` skill. Update CLAUDE.md "Where we left off" (stamp and one line).
