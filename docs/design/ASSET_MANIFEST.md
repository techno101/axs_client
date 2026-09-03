# ArmourXSports Checkpoint 1 asset manifest

## Owner-authorized archive-first execution update - 2026-08-09

Status: `IMPLEMENTED` for static public fallback media. On 2026-08-09 all venue derivatives were regenerated brighter (+5% brightness, +4% contrast) from their original sources, and two session images were added: `venue/session-day.webp` (from the 4000×2252 `Players playing a poper match.jpg` day shot) for the Morning card and `venue/session-night.webp` (from the dusk-toned `team winning moment after match.jpg`) for the Evening card. The video backgrounds produced earlier the same day were removed after review (pulsing feel + network weight); `public/video/` and the `VideoBackground` component were deleted. The home page is now a static-image pure-white experience.

| Public derivative | Archive source | Role |
| --- | --- | --- |
| `venue/home-hero.webp` | `Players playing a poper match.jpg` | Home hero (3840px derivative from the 4000x2252 source). |
| `venue/opening-a.webp` | `a fllyingkick by a player with many playerrs around him.jpg` | Home opening detail frame A. |
| `venue/opening-b.webp` | `2 opposite temam players pushing with the ball.jpg` | Home opening detail frame B. |
| `venue/opening-c.webp` | `awesome jumping head to the ball around the dbox and cool moment.jpg` | Home opening detail frame C. |
| `venue/home-action.webp` | `cool moment of player rushing with the ball.jpg` | Home match-action chapter. |
| `venue/home-community.webp` | `referees and teams askaking hands in the middle of the match.jpg` | Home community chapter. |
| `venue/field-aerial-landscape.jpg` | `field aerial view landscape.jpg` | Home "The grounds at Iskandar Puteri." lead aerial. |
| `venue/gallery-1.webp` | `a fllyingkick by a player with many playerrs around him.jpg` | Home matchday gallery 1. |
| `venue/gallery-2.webp` | `extreme pushing and dribling between two players in the frame.jpg` | Home matchday gallery 2. |
| `venue/gallery-3.webp` | `player at the moment of beating the defenders grasp with the ball.jpg` | Home matchday gallery 3. |
| `venue/gallery-4.webp` | `succefully driblled and got out of the defenders graspp.jpg` | Home matchday gallery 4. |
| `venue/gallery-5.webp` | `awesome tavking and evading it by players with 2 of opponent tema and one of the other team.jpg` | Home matchday gallery 5. |
| `venue/gallery-6.webp` | `almost a foul where someone pushing another player but not fallen down just the moment depicted.jpg` | Home matchday gallery 6. |
| `venue/about-hero.webp` | `about to shot the ball and another player on the moment to stop it.jpg` | About hero. |
| `venue/about-pitches.webp` | `aeraial shot with the whole area also captured.jpeg` | About venue visual. |
| `venue/about-office.webp` | `armourxsports office.png` | About office visual. |
| `venue/contact-photo.webp` | `aeraial shot with the whole area also captured but from a different angle.jpeg` | Contact page hero. |
| `venue/venue-overview.webp` | `armourx field.jpg` | Venue/Fields visual context (PageHero default). |
| `venue/fields-hero.webp` | `Proper aerial shot taken from the middle properly with both the fields looks as landscaped take from the side tilted not perpendicular.jpeg` | Fields page hero. |
| `venue/field-one.webp` | `everyone playing in midfield of field 1.jpg` | Field 1 fallback. |
| `venue/field-two.webp` | `cool moment of the players passing ball between thenm'.jpg` | Field 2 fallback. |
| `venue/booking-hero.webp` | `awesme cool shot of the player about to hit the ball with a cool heroic moment.jpg` | Booking hero. |
| `venue/notes-hero.webp` | `player walking, referee behind and two players as well in the bg.jpg` | Field notes hero. |
| `venue/article-booking.webp` | `sprinting with the ball with full force.jpg` | Booking article. |
| `venue/article-sessions.webp` | `two players striker and defender tackling and dribbling.jpg` | Session article. |
| `venue/article-checklist.webp` | `player with the ball thinking where to pass also a cool moment.jpg` | Checklist article. |

The former generated Match Cut stills, the night-player image and all rejected visual fallbacks are removed from public source and from `public/images/` on 2026-08-06. `matchcut/hero-title-en.png` and `hero-title-bm.png` remain as flattened Ethnocentric display artwork (approved, non-AI font artwork) with live Exo 2 semantic fallback. The three night/AI renders in `project/assets/field/` were deleted on 2026-08-07. No owner archive original is deleted.

Status: `PARTIALLY IMPLEMENTED — STATIC-POSTER CANDIDATE`
Inventory date: 2026-08-02
Scope: pre-production references, 16 planned still masters, one required hero clip, at most one supporting clip

## Rights and provenance statement

The owner states that the 28 files in `RANDOM FIELD IMAGES FOR ARMOURX SPORTS` are ArmourX-owned references. This statement is recorded as owner attestation received in the Checkpoint 1 execution prompt on 2026-08-02. No separate photographer agreement, model release, minor release, team/sponsor clearance or property release was present in the workspace.

Until those documents are supplied, the local photographs are approved for internal venue/action reference and reference-guided fictional campaign generation only. Direct customer-facing publication of identifiable people, children, team marks, sponsors, former-operator marks, event banners or historical results remains `BLOCKED`.

Public Facebook/former-operator imagery is contextual research only and is not part of this generation source set. Google, OpenStreetMap and Esri imagery is map/context research only and must not be reused in campaign media.

## Local source inventory

All SHA-256 hashes were computed locally on 2026-08-02. Every file is unique by hash.

| Ref | Filename | Dimensions | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| `R01` | `2 opposite temam players pushing with the ball.jpg` | 1440x960 | 119556 | `186b4cff544b6839c2af1ed6af6687e2040889280159028abef380ab5fb560c4` |
| `R02` | `a fllyingkick by a player with many playerrs around him.jpg` | 960x640 | 54846 | `f0630ef74f6d5ec596f92d83e722b7a5f328d02d0ed5a2f7939394d1e5471e89` |
| `R03` | `about to shot the ball and another player on the moment to stop it.jpg` | 2048x1366 | 208599 | `3dda160db0b857b62b12c252301a67ecf96fc91a85555e01e3d836f01aa65559` |
| `R04` | `almost a foul where someone pushing another player but not fallen down just the moment depicted.jpg` | 960x640 | 60617 | `9a9e0e6bed6ff85e3b85506fb64e5915ee4050e40b020a8aa2bbe565b732d639` |
| `R05` | `awesme cool shot of the player about to hit the ball with a cool heroic moment.jpg` | 2048x1366 | 162084 | `6c28226a984c928448d9b8b5ffa6d54046c8c9b7760345abd823fba7aee8be4e` |
| `R06` | `awesome jumping head to the ball around the dbox and cool moment.jpg` | 2048x1366 | 334496 | `7bd333c827166caa5ed42abf0176f3f5c3da4f9aac5480ebc0b8ec3919e14f4c` |
| `R07` | `awesome tavking and evading it by players with 2 of opponent tema and one of the other team.jpg` | 2048x1366 | 263912 | `fe8eeaa1489341998817a6bc1fb7201cc3112e75b64c1fc3eeb4808a4b083b9f` |
| `R08` | `cool momen 3 playes and 3 playes of both teams with the refree as well in the frame twhen the player dribbling and passing all along.jpg` | 2048x1366 | 216380 | `3e5697d9562027e47a9fedaeb631abfebc5d5506eeca81dbdee6f8e5cc87b172` |
| `R09` | `cool moment of player rushing with the ball.jpg` | 2048x1366 | 144979 | `c03f3c697c90c000cfb55d9eb958c790c5ddb26e42a8de444dad036d5cc2165e` |
| `R10` | `cool moment of the players passing ball between thenm'.jpg` | 2048x1366 | 221206 | `cfe955dd0478262773c93b0fc7acb55da7a26766000a3248004e8f9190bed078` |
| `R11` | `cool shor of player from the side tired and tensed.jpg` | 960x640 | 46042 | `7b11b04dd3b640e2739d4e4d160d6f9c8e77526cacbeb30a5da2f876e9eb5a96` |
| `R12` | `cool shot of player walking between the match with a proper pose.jpg` | 5488x3659 | 6203681 | `60f642aca479d647a4d4fcd5f82c4a98269ff93a5d1c7055e7a8fa7e138efb32` |
| `R13` | `everyone playing in midfield of field 1.jpg` | 3840x2160 | 2031218 | `86f6f00022ae78827fc9080b1dab9671c2ae22fff6e2805c81b122a8ab9e914a` |
| `R14` | `extreme pushing and dribling between two players in the frame.jpg` | 960x640 | 57966 | `b9219700bb97f684136569071839c52fc768049f66717430a8469545bad333e6` |
| `R15` | `player at the moment of beating the defenders grasp with the ball.jpg` | 2048x1366 | 186443 | `b88458f9e46e1c4dd9c8d51c51cda4ae7f411c56b1c3025ae8d85875a1c8729d` |
| `R16` | `player walking, referee behind and two players as well in the bg.jpg` | 5289x3526 | 5670260 | `f9a61c77587b6cdc5a05c47e80faad24f13dcebeff063d8d5866d87a08ef9802` |
| `R17` | `player with the ball thinking where to pass also a cool moment.jpg` | 2048x1366 | 138125 | `c5152c70b72b08372f90913f29dd6d3d621b503d2cc4e088ced885c160fbf8ef` |
| `R18` | `Players playing a poper match.jpg` | 4000x2252 | 3296034 | `424655524f0e2d5e25333715bb024285a192eda1a2457b7b71e38f5ac3ab4e28` |
| `R19` | `random playr with ball.jpg` | 960x640 | 52662 | `3e37c09eb9ba242823b21c976f6e690551a6c77a97c4ba6c57cbf75513261e25` |
| `R20` | `random team 1 live match going.jpg` | 1440x960 | 118495 | `a073b6b3f61f1b86c68508faeb6e543ac2d31fd7e26a754ca510b248a84e02a1` |
| `R21` | `referees and teams askaking hands in the middle of the match.jpg` | 2048x1366 | 274223 | `4aa964f4f23ed66a0724729d16426e9916a4782ea53398a99427303d5af54f6a` |
| `R22` | `shooting the ball at full force.jpg` | 1440x960 | 112928 | `e66b2e25316b54d0644aca4edc55f458258352fd93af1ac112c8c5cade70093b` |
| `R23` | `sprinting with the ball with full force.jpg` | 1440x960 | 113198 | `ff3863c7e2178a6650f5cbfb515ff17c4ac4528afb0bbbdf8058e6b2bec4c47e` |
| `R24` | `succefully driblled and got out of the defenders graspp.jpg` | 1440x960 | 117708 | `07112212d9485234be91f1a768b68e93dc2a6c27f4cee364d634cb4ff5847bca` |
| `R25` | `team winning moment after match.jpg` | 2048x1366 | 398210 | `66bc1ac062d2e2e24234460cc975e66f299b2e668f72971de7c9b3962f0b5ce2` |
| `R26` | `team won the match.png` | 1080x799 | 1421235 | `3fbcd31d17c947dc44803a960c907d7dc4b10edc9392025feba2e6df5ccd681f` |
| `R27` | `two players striker and defender tackling and dribbling.jpg` | 4216x2811 | 4567383 | `eda0ae68da82da859448ee2603aafd25f5cf036ef92648086989bdda189b8f52` |
| `R28` | `winning the match.jpg` | 1440x960 | 264763 | `bf0a9a3fef7d2c2da8b5f38509011c17e6d2bbbc22ed94f755e8a604eb2b4298` |

Archive-wide restrictions:

- `R13` and `R18` are strong venue-geometry references but show event participants/children and signage; they are not direct campaign masters.
- `R25`, `R26` and `R28` depict winning/team moments and cannot be presented as ArmourXSports history.
- Every action/portrait file contains identifiable people and/or real kit marks. Use as pose, physics, light and venue reference only until releases exist.
- **Fictional face continuity rule:** every newly generated master must use a distinct fictional adult face from every other master by default. A repeated face is permitted only when the manifest explicitly names the same fictional player and the storyboard requires that continuity. Record that relationship before generation; never let a model repeat faces accidentally across unrelated roles.

## Planned master matrix

| Asset | Chapter/beat | Type | Source guidance | Target outputs | Status |
| --- | --- | --- | --- | --- | --- |
| `M01` | 1A opening contact sheet | Still anchor | Revised `M03`, `R13`, `R18`; exact player/ball/light invariant | 16:9 proof; later responsive cells | `PASSED V2 VERIFIER` |
| `M02` | 1B opening detail set | Still | Venue net/turf/light references across archive | 3:2 and square cells | `DEFERRED` until pack approval |
| `M03` | 1C hero poster | Still anchor | `R13`, `R18`, selected night colour references | 2:1 desktop, 4:5 mobile, 16:9 poster | `PASSED V2 VERIFIER` |
| `M04` | 1D hero living beat | Required clip | Approved `M03` through image-to-video | 5-8 s WebM/MP4 plus poster | `BLOCKED`, no provider route |
| `M05` | 2A the ground | Still | `R13`, `R18`; adjacent-pitch relationship | 3:2 desktop, 4:5 mobile | `DEFERRED` until pack approval |
| `M06` | 2B venue hardware | Still | `R13`, `R18`; rectangular arrays, net, goal and turf | 4:5 and 16:9 | `DEFERRED` until pack approval |
| `M07` | 3A sprint | Still | `R09`, `R23` | 3:2 and 4:5 | `DEFERRED` until anchor approval |
| `M08` | 3B duel | Still anchor | `R07`, `R27`; credible tackle/dribble physics | 3:2 proof, later 4:5 | `PASSED V3 IMPLEMENTED REVIEW` |
| `M09` | 3C pass | Still | `R10`, `R17` | 3:2 and 4:5 | `DEFERRED` until anchor approval |
| `M10` | 3D shot | Still; optional clip source | `R03`, `R05`, `R22` | 3:2 and 4:5 | `DEFERRED`; clip not approved |
| `M11` | 3E release/reaction | Still | `R08`, `R16`, `R21`; no result/history claim | 3:2 and 4:5 | `DEFERRED` until anchor approval |
| `M12` | 4A booking/touchline detail | Still | Venue turf, line and ball only | 16:9 shallow crop | `DEFERRED` until pack approval |
| `M13` | 5A bring your team | Still anchor | `R21`, `R25`, `R26`; composition only, fictional adults | 3:2 proof, later 4:5 | `PASSED V3 VERIFIER` |
| `M14` | 5B player ritual | Still | `R11`, `R12`, `R16` | 4:5 and 3:2 | `DEFERRED` until anchor approval |
| `M15` | 6A find the ground | Still | `R13`, `R18`; buildings, terrain, netting and road relationship | 16:9 desktop, 4:5 mobile | `DEFERRED` until pack approval |
| `M16` | 7A know before you go | Still | `R13`, `R18`; verified goal, net, ball and venue hardware | 2:1 desktop, 4:5 mobile | `DEFERRED` until pack approval |
| `M17` | 8A book your spot | Still | Team/exit composition only; fictional adults, no trophy | 3:2 and 4:5 | `DEFERRED` until pack approval |

Planned still count is 16 (`M01-M03`, `M05-M17`). `M04` is the required hero clip. At most one derivative clip of `M10` may be considered later; it is not included in the approved count today.

## Implemented candidate library

The candidate homepage deliberately uses only four approved masters: `M01` opening contact sheet, `M03` hero poster, `M08` action, and `M13` team. Their roles do not repeat except the explicitly documented `M01`/`M03` same-player opening-to-hero continuity invariant. `M08` v3 replaces both v2 player identities with two different fictional adults; its SHA-256 is `2fd9ed4a79638c7d1ed553682e8c6e79c640e75b7579464479045b8897ba3a57`. No full master batch is claimed and no generated video is substituted with parallax.

`hero-title-en.png` and `hero-title-bm.png` are static flattened Ethnocentric display artwork made locally from the supplied desktop font. They are not webfont files. Each is paired with live Exo 2 semantic heading text that becomes visible if the artwork fails.

`M08` v3 was made with the built-in ImageGen edit path on 2026-08-02, using the v2 action frame strictly as a venue/perspective reference. It preserves the goal, net, turf, ball, tower, buildings, embankment and floodlight geometry while replacing both people with named distinct fictional adult identities: a bearded Malaysian Indian central player and a clean-shaven Malay defender. There is no seed to record for this built-in tool. The independent implemented-home review approved the result; future newly generated masters remain subject to the same distinct-face rule.

## Four low-resolution anchor records

The actual output path, image dimensions, file size, SHA-256, generation tool/version, prompt and approval status must be entered immediately after each generation. No anchor may move to customer-facing media without both approvals.

### `M01` opening contact sheet

- Intended role: first visual statement; venue, turf/light and adult action fragments establish place/game/action.
- Source references: `R13`, `R18`, `R23`, `R27` for venue and physics only.
- Face/logo treatment: replace every visible person with fictional adults; plain fictional kits; no legible mark or sponsor.
- Superseded output: `anchors/M01-opening-anchor.png`, independently `REVISE`.
- Revised output: `anchors/M01-opening-anchor-v2.png`, 1280x720, 698,393 bytes, SHA-256 `9d89f0a510e9cbcdc90c2c79f1d073e4e7ddd8a938dec15b1a6b31e7841d984a`.
- Tool: deterministic FFmpeg contact-sheet composition from exact crops of cleaned `M03` v2; generated 2026-08-02. No additional person or venue content was synthesized.
- Prompt/command record: `ANCHOR_PROMPTS_V2.md`.
- Self-QA: `PASSED FOR RE-REVIEW`; the same player, ball, painted line, goal, terrace row and rectangular light array visibly expand into `M03`. No marks or new anatomy were introduced.
- Independent verifier: `PASSED` in revision 2 review.
- Owner: pending.
- Alt intent: content image; `Editorial matchday contact sheet from the ArmourXSports ground in Iskandar Puteri.`

### `M03` hero poster

- Intended role: stable hero poster/fallback, one real-place composition with protected copy area.
- Source references: `R13`, `R18` for venue geometry plus owner night set for lighting character.
- Face/logo treatment: fictional adults in plain kits; no old operator/team/sponsor identity.
- Superseded output: `anchors/M03-hero-anchor.png`, independently `REVISE`.
- Revised output: `anchors/M03-hero-anchor-v2.png`, 1280x720, 1,107,091 bytes, SHA-256 `3a7761cbd9fb2e258fd2b8f5f32ea6fa5f8f41bfe0c7ed536666c4cb928c8800`.
- Tool/model/version: OpenAI `image_gen` reference-guided generation plus one precise brand-cleanup edit; underlying model/version not exposed; generated 2026-08-02.
- Seed: not exposed.
- Prompt: full submitted generation and cleanup prompts are recorded in `ANCHOR_PROMPTS_V2.md`.
- Self-QA: `PASSED FOR RE-REVIEW`; blank kit and boots, credible anatomy/ball relationship, verified local skyline/net/goal relationship, rectangular light array and protected copy zone are clean at proof size.
- Independent verifier: `PASSED` in revision 2 review.
- Owner: pending.
- Alt intent: content image; `Adult community football at the ArmourXSports ground under the lights in Iskandar Puteri.`

### `M08` action duel

- Intended role: proof of credible anatomy and football physics for the pinned action chapter.
- Source references: `R07`, `R27` for tackle/dribble timing and venue character.
- Face/logo treatment: fictional adult Malaysian players, plain opposing kits, no sponsor or badge.
- Superseded output: `anchors/M08-action-anchor.png`, independently `REVISE` for generic venue continuity.
- Revised output: `anchors/M08-action-anchor-v2.png`, 1200x800, 1,294,071 bytes, SHA-256 `cf139eaf5bc3e4652c906fe5511b9445ba38b9837e1fa1c7ca6ec8f86fce9407`.
- Tool/model/version: OpenAI `image_gen` reference-guided generation; underlying model/version not exposed; generated 2026-08-02.
- Seed: not exposed.
- Prompt: full submitted prompt is recorded in `ANCHOR_PROMPTS_V2.md`.
- Self-QA: `PASSED FOR RE-REVIEW`; anatomy, balance, ball contact and blank kits remain credible, while the terrace row, slim tower, goal, netting and rectangular light array now match the hero's venue language.
- Independent verifier: `PASSED` in revision 2 review.
- Owner: pending.
- Alt intent: content image; `Two adult players contest the ball on a fenced night pitch in Iskandar Puteri.`

### `M13` team/location

- Intended role: prove believable adult community/team energy without copying a real result or team.
- Source references: `R21`, `R25`, `R26` for grouping only; no identity/history transfer.
- Face/logo treatment: entirely fictional adults, varied Malaysian community cast, plain kits, no trophy, sponsor or event mark.
- Superseded output: `anchors/M13-team-location-anchor.png`, independently `REVISE`.
- Revision 2 output: `anchors/M13-team-location-anchor-v2.png`, 1200x800, 1,321,882 bytes, SHA-256 `4071929046e3e742c86ccafbf8fee675ec2231cce971de55be83e42f80b68b18`; independently `REVISE` for an evenly staged lineup.
- Revision 3 output: `anchors/M13-team-location-anchor-v3.png`, 1200x800, 1,397,563 bytes, SHA-256 `203fb8810ef0c79b0fd61dfc57077f5537766994e3444d20edb6f008e182072a`.
- Tool/model/version: OpenAI `image_gen` reference-guided generation; underlying model/version not exposed; generated 2026-08-02.
- Seed: not exposed.
- Prompt: the revision 2 prompt is recorded in `ANCHOR_PROMPTS_V2.md`; the exact revision 3 edit prompt is recorded in `ANCHOR_PROMPTS_V3.md`.
- Self-QA: `PASSED FOR RE-REVIEW`; exactly six fictional adults, complete limbs/feet and blank kits remain against the same net, terrace row, tower, goal and rectangular light array. An asymmetric conversing pair, varied strides, a plain ball and a plain boot bag replace the lineup effect. There is no celebration or historical-result implication.
- Independent verifier: `PASSED` in revision 3 review.
- Owner: pending.
- Alt intent: content image; `A fictional adult community team gathers beside the ArmourXSports pitches in Iskandar Puteri.`

### Combined anchor proof

- Output: `proofs/ANCHOR_CONTACT_SHEET-v3.png`, 1600x900, 1,816,358 bytes, SHA-256 `ff62b3a999736e067b77a907bd47ba3230f041ff807ddd3aa7fbbcd34619d8c6`.
- Composition: deterministic FFmpeg four-panel sheet from `M01` v2, `M03` v2, `M08` v2 and `M13` v3. It adds no synthesized content.
- Independent verifier: `APPROVED` in revision 3 review.
- Owner: pending.

## Quarantined Client assets

The v12 assets below and all derivatives were excluded from Checkpoint 1 customer-facing use. On 2026-08-06, following the owner's explicit removal instruction, every file on this list was physically deleted from `public/images/`. The fixture server, visual captures and route smoke now serve the archive-derived venue images only.

1. `public/images/demo/night-stadium.jpg`
2. `public/images/night-stadium.webp`
3. `public/images/demo/night-player.jpg`
4. `public/images/night-player.webp`
5. `public/images/demo/textured-pitch.jpg`
6. `public/images/textured-pitch.webp`
7. `public/images/hero-aerial.png`
8. `public/images/hero-aerial.webp`
9. `public/images/demo/aerial-pitch.jpg`
10. `public/images/aerial-pitch.png`
11. `public/images/aerial-pitch.webp`
12. `public/images/matchcut/hero.png`
13. `public/images/matchcut/opening.png`
14. `public/images/matchcut/team.png`
15. `public/images/matchcut/action-v2.png`

Quarantine status: `REMOVED` — physically deleted from `public/images/` on 2026-08-06 with owner authority; only the approved flattened title artwork and the archive-derived venue set remain.

## Acceptance checks for every generated master

- real two-pitch venue geometry and Johor surroundings remain recognizable where the venue is shown;
- no invented stadium bowl, foreign skyline, grandstand or architecture;
- fictional adults only, with credible Malaysian community-football casting;
- correct number and placement of limbs, hands, feet, fingers and joints;
- credible ball size, trajectory, foot contact, player balance and shadows;
- net tension, goal scale, floodlight direction and architecture stay consistent;
- no real old-operator, team, sponsor, league or event branding;
- no fake history, score, trophy, testimonial or attendance implication;
- unique dominant role and no cross-chapter reuse;
- recorded prompt, tool/version, seed if exposed, date, output dimensions, bytes and SHA-256;
- verifier decision and owner decision both `APPROVED` before batch/production use.
