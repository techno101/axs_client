# The Match Cut design bible

Status: `REVISE`
Checkpoint: Client `v13`, Checkpoint 1 pre-production gate
Design intent: authentic Johor community football presented with cinematic editorial discipline

## Creative proposition

**Book your spot.**

The homepage should feel like an editor assembling a matchday story from truthful fragments. A contact sheet becomes the navigation, wordmark position and hero window. Each later chapter uses the same match-cut grammar: enter through a crop, pass behind a real football element, or let one frame yield to the next. It must never read as a loader followed by a separate template site.

The old `The field is yours`, daylight-versus-floodlights and six-hour campaign language is retired. The new voice is short, direct and useful. It does not beg for attention or turn operating details into poetry.

Primary action and key line:

- English: **Book your spot**
- Bahasa Melayu: **Tempah slot anda**

Audience: casual teams, clubs, school groups and corporate groups in and around Iskandar Puteri/Johor. The emotional register is local match night, not a fabricated professional stadium.

## Design dials

| Surface | Variance | Motion | Density | Scrolling |
| --- | ---: | ---: | ---: | --- |
| Desktop homepage marketing | 9/10 | 9/10 | 7/10 | Fine-pointer enhancement only; connected chapters |
| Touch/mobile homepage | 8/10 | 6/10 | 6/10 | Native scroll; shorter match cuts |
| Booking/auth/account | 6/10 | 3/10 | 6/10 | Native, calm and task-first |

The visual system has one dark match-night theme, one real green accent, sharp frames, high-contrast type and restrained blue brand blocks. It does not use a generic card library.

## Palette

Palette sources:

- approved ArmourXSports logo: brand blue `#17469E`, brand green `#7FC241`;
- owner-attested night action reference: night indigo, floodlight mist and turf values;
- floodlight/chalk neutral: a controlled near-white rather than a blue-white glow.

| Token | Value | Role | Contrast evidence |
| --- | --- | --- | --- |
| `night-950` | `#0F1339` | Primary background and media veil | Base |
| `chalk-050` | `#F5F7F1` | Primary text on night | 16.59:1 on `night-950` |
| `mist-200` | `#C9DAE7` | Secondary text and disabled calm state | 12.51:1 on `night-950` |
| `armour-blue-700` | `#17469E` | Brand field, link/focus support on light surfaces | 8.09:1 against `chalk-050`; white on blue is 8.73:1 |
| `armour-green-500` | `#7FC241` | Primary action, current state, short campaign accent | 8.27:1 against `night-950` in either direction |

Never set brand blue text directly on `night-950`; that combination is only 2.05:1. Use chalk, mist or green for readable night text. Focus indication must use both a visible outline and shape/position, not colour alone.

The revised visual proof is `proofs/TYPOGRAPHY_PALETTE_PROOF-v2.png`, SHA-256 `6b4c41b16b0f4217eee86a9cdab85bbddef3c1457b3c6096e5a4b679fcb64fa3`. It shows the actual supplied Ethnocentric face as flattened display artwork, Exo 2 ExtraBold live hierarchy, English/BM wrapping, a 390 px mobile composition and a 32 px body sample representing 16 px text at 200% zoom. The exact logo sampling found `#17469E` and `#7FC241`; the night reference palette included `#0F1339`, `#1D2350`, `#639A47`, `#99CA6C` and `#C9DAE7`.

## Typography gate

Readable system:

- **Exo 2 Variable**, weights 400-900, for body, navigation, controls, prices, schedules and readable English/BM headings;
- tabular numerals for times and money;
- sentence case for body and controls; uppercase only for short labels with tested tracking;
- no Clash Display, General Sans or JetBrains Mono in public marketing UI.

Display system:

- the owner supplied `fonts/ethnocentric/Ethnocentric-Regular.otf` on 2026-08-02 and directed its use;
- the accompanying Typodermic desktop licence permits commercial static graphics and webpages where the font is not embedded, but explicitly forbids embedded webpage use;
- therefore Ethnocentric is used only for flattened short display artwork such as the `BOOK YOUR SPOT.` campaign lockup. The OTF is never copied into `public`, served through CSS, converted to WOFF, committed inside Client or exposed to the browser;
- the same key line remains present as semantic Exo 2 text for accessibility and failure handling;
- keep the approved ArmourXSports logo as an image rather than recreating its lettering.

Current result: `PASSED FOR PRE-PRODUCTION`. The owner supplied both families. Exo 2 is authorized for live readable text under SIL OFL 1.1. Ethnocentric is authorized only through non-embedded flattened artwork under the supplied desktop EULA. This resolves the visual type choice without exceeding the licence supplied in the workspace.

Recorded source hashes:

| File | SHA-256 | Use |
| --- | --- | --- |
| `fonts/ethnocentric/Ethnocentric-Regular.otf` | `4d7ab140b0510b38e8714c5f64ce0f6bea7aa1ef5346e9565de20901eac40247` | Local flattening only |
| `fonts/ethnocentric/read-this.html` | `e5cec1ed1ad54828496fffac754aba43d2dee3c952e8d0bd9946ae8175a9d7f9` | Plain-language licence evidence |
| `fonts/ethnocentric/Typodermic Desktop EULA 2023.pdf` | `1bb2b43ff7702f56eda9db0e18890bcf65de62ab93ddbbe58107fcdd62949b68` | Governing supplied EULA |
| `fonts/exo_2/Exo2-Regular.otf` | `ebfec5f5c1598340e24229201189409665e92b1251bbaf225d16959e272a443f` | Live body text |
| `fonts/exo_2/Exo2-SemiBold.otf` | `b40e64b126fd0c400c618e264c6cf3479477b69cc33e2ef363daef63c1d0c794` | Live navigation and controls |
| `fonts/exo_2/Exo2-ExtraBold.otf` | `3504b9e1374da649d2bb6961a864cb0d3d82385904efbac941a964bc3c44ba7c` | Live readable headings |

Official Exo 2 sources:

- <https://github.com/google/fonts/tree/main/ofl/exo2>
- <https://github.com/google/fonts/blob/main/ofl/exo2/OFL.txt>

### Type scale

| Token | Desktop | Mobile | Weight | Use |
| --- | --- | --- | --- | --- |
| `display-xl` | clamp 72-132 px | clamp 46-68 px | 850-900 | One short hero line only |
| `display-l` | clamp 52-88 px | clamp 38-54 px | 800-900 | Chapter turn |
| `heading-m` | clamp 34-52 px | clamp 30-40 px | 700-800 | Readable English/BM heading |
| `body-l` | 20-24 px | 18-20 px | 450-550 | Lead copy |
| `body-m` | 16-18 px | 16-18 px | 400-500 | Supporting copy |
| `control` | 15-17 px | 16-18 px | 600-700 | CTA, nav, language switch |
| `label` | 12-14 px | 12-14 px | 650-750 | Short metadata only |

Minimum body line-height is 1.45. Long Malay lines receive more width or smaller display size rather than tighter tracking. Controls never drop below 16 px on touch. All type must survive 200% zoom without clipping or overlap.

## Grid and composition

Desktop:

- 12 columns; outer margin clamp 24-64 px; gutters clamp 12-24 px;
- use a 61.8/38.2 editorial split only when media and copy need unequal emphasis;
- hero copy occupies no more than seven columns; CTA remains in the first reading sweep;
- one deliberate pinned chapter may change axis; the rest stays in document flow.

Mobile:

- four columns; 16-20 px outer margin; 12 px gutters;
- hero is a single readable composition, not a desktop collage shrunk down;
- contact-sheet opening uses 3-5 cells, not a dense mosaic;
- native scrolling and normal document order remain visible if animation never starts.

Frame radii are sharp: `0`, `2`, `6` and at most `12` px for a functional floating control. There are no pill-shaped content cards. Borders are structural only, never decorative strings or random field markings.

## Media and crop rules

- Every master has one dominant chapter role. Cropping the same master differently does not create a new role.
- Preserve real venue geometry: adjacent pitches, net height, poles, goal scale, surrounding buildings and terrain.
- Keep the ball readable and physically plausible. Reject any frame with distorted limbs, feet, hands, ball, net, light direction or architecture.
- Generated people are fictional adults with Malaysian community-football character, natural skin texture and fictional plain kits.
- Remove or invent no real sponsor, team, old-operator, league or event identity.
- Desktop hero target is 16:9 or 2:1 with a protected copy zone; mobile hero has a separately approved 4:5 crop from the same composition.
- Do not reuse the hero as the final CTA, social proof, location or booking background.
- Content images receive meaningful alt text; purely transitional duplicate frames are empty-alt, `aria-hidden` and inert.

## Interaction appearance

- Primary CTA: green field, night text, sharp 2-6 px radius, minimum 48 px touch height.
- Secondary action: chalk text on night with an explicit underline or border-state change.
- Focus: 3 px chalk/green high-contrast outline with 3 px offset; never suppressed.
- Language switch: visible text labels `EN` and `BM`, persistent and keyboard operable.
- Availability, prices and pitch names come from Admin data. No fictional slots appear as decoration.
- Header remains one semantic SSR navigation. Choreographic copies must not enter the accessibility tree.

## Anti-pattern lockout

Reject any concept containing:

- a blocking loader, fake percentage, spinner or fixed delay;
- blobs, random geometry, decorative strings/lines, particles, dots, circles or watermarks;
- glassmorphic card kits, neon gradients or unrelated orange/purple accents;
- foreign stadiums, fabricated aerials, decorative 3D or a custom cursor;
- repeated hero imagery, generic fade-up section stacks or endless carousels;
- fake live availability, testimonials, sponsors, scores, attendance or venue claims;
- font lookalikes, unlicensed Ethnocentric files or a recreated wordmark;
- blur, blink, flash or motion that survives reduced-motion mode.

## Owner direction recorded on 2026-08-02

- Use the supplied Ethnocentric and Exo 2 font packages without further font-choice questions.
- Use **Book your spot** as the English key line.
- Retire every visible v12 homepage line and section concept quoted by the owner.
- Continue execution without pausing for non-blocking clarification.

The licence boundary above remains mandatory. Generated campaign assets continue to use fictional adults and fictional unbranded kits.
