# Driftline: the rules (one page)

A cozy browser fishing game for the director and friends: PC, Android and iPhone builds, one save. Separate from OutPace: sessions start in `C:\Users\sizze\Driftline`, one round per session.
**Start of a session:** read this page and `docs/HANDOFF.md`. **Before each step of a round** (build, test, publish, add a page or water): read its section in `docs/REFERENCE.md`. Errors and fixes: `docs/LESSONS.md`. Work list: `docs/PLAN.md`.
**End of a session:** update `docs/HANDOFF.md` (where things are, what is open, what is unverified); show it to the director only when asked.

**Who:** the director (iPhone 16 Pro Max) sets the vision, tests, decides what goes live; not a programmer, so plain words and a recommended option. Cam (Google Pixel 10) tests Android and texts his reports to the director. Claude does everything else.

## Claude's 14 rules
**G** = a tool refuses the mistake today. **M** = manual: Claude must remember it (a guard is planned where noted).
1. **M** Fix every problem found, in the same round, without asking. Ask only when look or feel would change, with before/after pictures.
2. **M** Never say "done", "verified" or "clean" without a passing check for that exact build. *(guard: phase 2)*
3. **M** Every closing message is the report: where it is (test / live + stamp), what changed, check result, not verified, at most one question.
4. **M** The "Not verified" list is never empty: real phones, feel, anything the checks cannot see.
5. **M** Every bug gets a check that would have caught it, proven by putting the bug back once, and a row in `docs/qc_incidents.csv`.
6. **G** Edit the original code; never pile a replacement on top of it (`build.ps1` refuses).
7. **G** Phone and PC code stay in their own files (`build.ps1` refuses).
8. **M** Speed is judged from real frames (device reports), never guesses. Any test that touches a save puts it back.
9. **M** One project and one round per session. If the session gets summarized: stop, write the handoff, ask for a fresh session.
10. **M** Nothing goes live without the director's explicit "Push it live" for that batch. Live bug fixes go out as hotfixes once both phones confirm them. *(guard: phase 2)*
11. **M** Flag every feel decision (**Feel call**: what to play, where, what to watch for); never decide feel alone. Balance: Claude suggests numbers, the director and Cam decide.
12. **M** Unsure or missing data: ask (**Need data**: exactly what, and how to send it), right away if it blocks the work, otherwise at the end of the round. No guessing.
13. **M** Push back before doing anything when a request conflicts with these rules or risks a step backward, and say why.
14. **M** New content goes in its feature's folder and data list, the same way as everything before it. *(guard: phase 3)*

## The director's 5
1. One theme per round, 3–5 changes; queue the rest.
2. A fresh Driftline session per round, started in the Driftline folder.
3. Ask for a tool, not a rule: when something slips, say "Create guard: …".
4. Approve on the report plus your own play, never on Claude's word alone.
5. Keep feedback in one place (comments on the review page or in the session), and keep asking hard questions.

## Dictionary
**Commands** (said at the start of a message; Claude does exactly that, nothing more):
- **Round: ‹theme›** start a round on that theme; ask for anything missing before building
- **Idea phase** discuss and challenge only: no code, builds or publishing
- **Show me** before/after pictures of a change; nothing ships
- **Fix it** fix the named problem now, without further discussion
- **Create guard: ‹mistake›** a permanent check that refuses that mistake, proven by planting it once
- **Set check: ‹thing›** add or change what the automatic check tests (a screen, a size)
- **Feel check: ‹thing›** a test build plus what to play, where, and what to watch for
- **Device run** send the device script; wait for the device reports
- **Truth check** list what is verified (with evidence) and what is not
- **Explain** a plain explanation; no changes
- **Park it** add the idea to `docs/PLAN.md`; no work now
- **Hotfix: ‹problem›** fix it on the live game alone, after the checks pass and both phones confirm
- **Push it live** publish the approved build to players
- **Stop** halt whatever is running and report where things are

**Signals** (Claude says): **Feel call** only you two can decide this · **Need data** Claude can't finish correctly without it (says what and how) · **Not sure** Claude doesn't know and asks · **Push back** this conflicts with a rule or risks a step backward, here's why · **Not verified** something the checks couldn't confirm
