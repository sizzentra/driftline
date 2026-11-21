# Cam's fight feel (answered questionnaire, received 2026-11-21)
Project 1 of the overnight roadmap (PLAN › Production queue › P0). **This file comes before everything else** (director, 2026-11-21); the earlier doc "Driftline — Fight feel (Cam)" is used only where something here isn't clear enough. Original: docs/cam/Fight_System_Questionnaire.docx. Text below as Cam sent it, line breaks kept (re-extracted 2026-11-21: the first copy had run 35 line breaks together; tables flattened: one cell per line).


FISHING GAME – FIGHT SYSTEM QUESTIONNAIRE
Design discussion between Cam, Claude and the Director
HOW TO USE THIS DOCUMENT
Cam writes how fights should feel.
Claude turns it into a tuning proposal with the maths.
The Director and Cam decide the numbers.
DECIDED: Rules Cam has settled.
OPEN QUESTIONS: Questions to be answered.
NEW IDEAS: Anything still loose.
Add new information under the section it belongs to. For topics without a section, copy the template in Section 9.
Numbers can be rough. Write "Feel call" when you want Claude to suggest one.

1. CORE IDEA
DECIDED
"Fight" works like stamina (keep the name Fight); temper sets how intense the fight actions are.
Reeling in is steadier: the fish doesn't flip between fight modes so quickly, so a run, head shake or jump means more when it happens.
Fight actions cost Fight meter. A fully tired fish can still do an action now and then.
OPEN QUESTIONS
Should temper go down again when you stop reeling, and how fast?
Answer: Temper should go down again when reeling stops; at 0 fight (tired) the strongest fish’s temper should go down to 0 within a maximum of 3 seconds of stopping reeling. Would scale down to 1 second for a tired, weakest fish. Fight is preserved more (reduces drain and fight action cost) at high temper. 
Should the player see the Fight meter and temper, or only feel them?
Answer: For now, the bars should remain visible.
NEW IDEAS
 
2. DISTANCE AND TIME
DECIDED
A cast to the far edge of the screen = 40 metres, on every device.
The weakest fish never runs out of Fight in under 15 seconds without fighting actions.
A Mythic hooked at maximum distance lands in 30–60 seconds; only a diving Mythic can go over 60.
If the numbers don't fit, Claude proposes a maths model that keeps these dynamics, with every rarity in line.
AVERAGE TARGET LANDING TIMES AT MAX CAST (WITH THE BEST GEAR)
Rarity
Shortest (seconds)
Longest (seconds)
Common
3
 10
Uncommon
 6
 20
Rare
 10
 30
Epic
 15
 40
Legendary
 20
 50
Mythic
30
60
OPEN QUESTIONS
Fill in the empty times above, or write "Feel call".
Should a shorter cast mean a shorter fight, in proportion?
How much should better gear shorten a fight?
Answers / Notes:

Yes, a shorter cast should mean a shorter fight, but proportionally rarer fish are already less likely to be caught with short casts. For common/uncommon fish, reference shortest landing times. For rare and above, at maximum they could reduce to the rarity prior’s shortest landing time – if those fish need to run a bit (take line out) at first to get some ground that would likely help the feel. All times are approximations and can vary if the situation calls for it. A completely tired fish epic-mythic would get reeled in faster than the “shortest”. The fish’s actions and fight behaviours are used to average out these fight times. For example, if someone waited 10 seconds without reeling whatsoever – a common fish wouldn’t then immediately be caught to fulfill this parameter. Fights in every stage of the game shouldn’t ever take overly long, need to keep the pace still arcade – not simulator quality. The best gear should assist mostly in mitigation of negative effects, with reel time pushing the ranges towards the minimums. 

NEW IDEAS
 Reminder: Hybrids and special shiny types can modify these values
3. WEIGHT RULES
DECIDED
Fish weight
What its fight actions can do
Under 1.5 lb
Nothing: it reels in at the same rate.
1.5–3 lb
Only slows your reeling.
3–5 lb
Can stop your reeling while it runs; never takes line.
Over 5 lb
Aims to take line when running or jumping away.
Running (over 5 lb) scales with strength, weight and rarity; jumping away scales with strength and rarity.
How much line a run takes depends on how much stronger and heavier the fish is than the average in that water.
OPEN QUESTIONS
Are these limits the same in every water, or bigger in deep and late waters where every fish is heavy? 
What if a run would take more line than is left: snap, or does the run just stop?
Answers / Notes:

The initial limits for under 1.5, 1.5-3, 3-5 are mainly to help feel in earlier waters. Later waters defer to the average in that water to dictate length of attempted run. The strongest/heaviest fish in the water would be capable of the most dangerous run, proportional to its actual weight. (Example: if the most capable fish in water A is 20 pounds, and the most capable fish in water B is 500 pounds – the 500 pound fish would still be capable of a longer run. Scalability within a water depends on average, intensity of the run scales on the independent fish stats. 

No reeling for 10 seconds (should never be forced to maintain this by a fish’s behaviour) will have the fish escape. If a fish somehow got to 150+ meters out (that’s just negligent at that point, or you’re incredibly ill-equipped for that area) you would “Spool-out” and lose the fight.

NEW IDEAS
 
4. TENSION
DECIDED
Fight actions raise tension depending on weight, with diminishing returns toward the lower & higher weight limits. Tension should always be a factor, but the absolute heaviest behemoth shouldn’t also immediately snap a line if it moves an inch the other direction if you’re still reeling.
Reeling during any fight action is always worse for tension than not reeling.
Holding back a big runner: short bursts of reeling work best (don't snap the line, don't let it run too far).
Tension-lowering boosts must never make the dive check impossible (see Section 7).
OPEN QUESTIONS
How fast should tension fall when you stop reeling?
Should the line snap at 100% at once, or after a short moment at full tension?
Answers / Notes:

Bit of a feel call. Tension now feels fine, but with heavier fish tension should definitely drop slower.

Line should snap after about a half second of reeling at 100%

NEW IDEAS
 
5. FIGHT ACTIONS
DECIDED
Action
How often
Scales with
Head shake
Most common
Strength, weight, rarity (intensity)
Run
Common
Strength, weight, rarity (line taken)
Jump
Rare
Strength, rarity (when away)
Dive
Rarest (Section 7)
See Section 7
Jumps can go toward the angler (reeling is good: you gain line faster) or away (the fish tries to take line; tension can snap it).
Fish whose behaviour names an action do that action more frequently, but are modified multipliers based on base proposed shares
Rest between actions while not tired: at least 1 second, at most 5 seconds for the least lively fish.
OPEN QUESTIONS
Rough share of each action (for example 50% shakes, 35% runs, 15% jumps)?
Action
Proposed share
Head shakes
 35
Runs
 45
Jumps
 20
Total
100%
Do runs and jumps away get a warning like the jump wind-up, or only jumps?
Can two actions chain (a jump straight after a run)?
Answers / Notes:

Runs shouldn’t ever snap a line immediately from 0 tension, so no warning. A jump wind up is the warning for a jump, its then on the angler to be perceptive of the angle of the jump based on the animation.

Yes two actions can chain, in fact up to 4 can depending on fish rarity. Common/Uncommon do not chain (can’t break 1 second minimum delay between actions), rares can chain two actions, epics can chain 3 actions, legendaries can chain 4, mythics can chain 5. Chaining functions to reduce the minimum action delay to 1 second or slightly below (0.5). “Can” doesn’t mean always. A chain fight action only happens in about 1/5 fight actions for eligible fish. 50/50 coin flip every chain attempt beyond the first for eligible fish. Once a fish reaches its chain limits or fails a coin toss – it must wait at least 5 seconds before attempting another chain.

NEW IDEAS
 The maximum amount of time a fish can attempt a run for is 5 seconds. It has a minimum time of 1.5 seconds. Once again, this is a bit of a feel call based on the math
6. TIRED FISH AND SECOND WIND
DECIDED
A tired fish's chance of a fight action drops very sharply.
If not reeled in within 10 seconds of tiring: always one "Second wind!", back to 50% Fight.
OPEN QUESTIONS
Only once per fight, or again after another 10 seconds?
Should the player see a sign that the fish is tired (it slows, the shadow rolls)?
Answers / Notes:

Second Winds are simply that, only once per fight. 
“Reel hard!” text, tired bar is at 0 for indicators.

NEW IDEAS
 
7. DIVES (WATERS DEEPER THAN 100 FT)
DECIDED
The shadow jolts down and away: a stronger run that adds distance without moving sideways.
Distance gained by a dive comes back at a 75% rate after it ends. Example: 10 m out, dives 10 m → of every 4 m reeled, 3 come off the dive and 1 off the cast.
During a dive, keep tension inside a zone 25% wide (its centre somewhere between 35% and 65%) to limit how far it dives.
The rarest action of all: seen most on Rare and above, occasional on Common and Uncommon.
DIVE LIMITS
Rarity
Maximum dives per fight
Maximum distance if zone is missed
Common
1
 3 m
Uncommon
2
 5 m
Rare
3
 10 m
Epic
4
 15 m
Legendary
5
20 m
Mythic
6
20 m
OPEN QUESTIONS
Maximum dive distance for Common to Epic?
Is the zone in the same place every dive, or does it move?
What does the zone look like on screen (a band on the tension bar)?
Which waters count as deeper than 100 ft?
Answers / Notes:

Q1: Now filled out in chart
Q2: It is in a random zone with its anchor middle point set between 35% and 65% on the tension bar. It does not move during a dive action, but if there were multiple dives in a singular fight it could be in different places.
Q3: Band in the tension bar, while inside bar is light magenta to indicate compliance
Q4: Reference Waters page. Each Water has a depth. If 100ft falls within the range or the range is deeper than 100ft, it counts. Maps that don’t specify depth with any actual measurement (joke measurements still count as a measurement) are assumed to be deep enough for dives.

NEW IDEAS
 
8. DIFFERENT FISH AND RARITIES
DECIDED
Fish whose behaviour names an action (runner, jumper, thrasher) do that action the most (from Section 5).
OPEN QUESTIONS
Besides lasting longer, how should a Rare fish feel different from a Common one?
Should predators, shinies, hybrids or titled fish fight differently?
Oddities and junk: keep snagging, or something else?
Any fish that felt wrong in a fight (name + what)?

Q1: Common fish should be lazier in taking actions. Common fish shouldn’t take as much line if they run, or jump as high as rares and above could. Rarity directly impacts intensity as shared earlier. 
Q2:  Predators should stick to their rule of going on a bit of a run after eating your previously hooked fish – with respect to new parameters given. The rarer/stronger the fish, the more intense the run. Shinies should fight the same as a normal version of that fish. Hybrids will follow weight rules. Titled/special shiny variants will fight much harder than normal.
Q3: Yep keep snagging oddities and junk, but do reduce their time to reel in. The rarity and assumed weight of the object should impact frequency of snags 
Q4: This will be an ongoing report that can be used as a template for feedback during more human gameplay tests

Fish name:
What felt wrong?

NEW IDEAS
 
9. NEW SECTIONS
Copy this block for any topic not covered above (for example hook timing, bait effects, the line breaking, sounds and shakes).
NEW SECTION: [TOPIC]
DECIDED
 
OPEN QUESTIONS
 
Answer / Notes:
NEW IDEAS
 

WHAT CLAUDE NEEDS NEXT
The rules above are clear enough to start a maths proposal. These answers matter most before that:
Section 2 – Target landing times: Fill in the target landing times for Uncommon to Legendary, or write "Feel call".
Section 5 – Fight action percentages: Give a rough share of head shakes, runs and jumps.
Section 6 – Second wind: Should it happen once per fight, or repeat after another 10 seconds?
Section 7 – Dive distance and tension zone: Maximum dive distance for Common to Epic, and how should the tension zone look?
Section 8 – Rarity differences: How should a Rare fish feel different besides lasting longer?
ADDITIONAL NOTES
 
Document status: Working questionnaire – decisions subject to Cam and Director approval.


## Director decisions after the questionnaire (2026-11-21)
- **Dives need a water at least 100 m deep** (director; Cam's Q4 said 100 ft; the game stores depths in metres). Cam's Q4 rule otherwise applies as written: a range that reaches 100 m, or is deeper, counts; **a joke measurement still counts as a measurement** (its number is used, e.g. Buffet "1–2 m (gravy)" and Corporate Pond "2 m (to the elevator)" are shallow); only a water with no measurement at all is assumed deep enough.
  - Dives: Brine Shelf (30–200 m), Midnight Deep (500–3,000 m), Hollow Trench (3,000 m+); no measurement, so assumed deep: Ember Springs ("Bubbling"), Starfall Lake ("Endless sky"), Mount Olympus ("above the clouds").
  - Circuit Lake ("0101 m") is deep enough: dives (director, 2026-11-21).
  - No dives: Willow Pond, Stonebrook River, the coast, Frost, the Reef, Blossom, Rockies, Florida Keys, Amazon, Farm, Buffet, Corporate Pond, Nile.
  - (Correction 2026-11-21: Claude's first reading told the director that joke depths count as deep; Cam's Q4 says the opposite.)
