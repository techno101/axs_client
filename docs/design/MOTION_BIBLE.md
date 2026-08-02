# The Match Cut motion bible

Status: `REVISE`
Checkpoint: Client `v13`, Checkpoint 1 pre-production gate

## Motion thesis

Motion behaves like a football edit, not a theme effect. A truthful visual fragment gains context, changes crop or passes behind a real match element, then resolves into the next useful state. Every transition must preserve navigation, CTA access, focus and scroll control.

There is one motion language:

1. **Assemble**: a small editorial contact sheet establishes place, game and action.
2. **Match**: one stable visual feature, such as turf edge, net, player silhouette or floodlight, links the outgoing and incoming frame.
3. **Settle**: the semantic destination is already present and becomes visually stable.

No secondary visual gimmick, decorative parallax, random float, cursor effect, 3D ornament, blur or flash is allowed.

## Opening sequence contract

The opening is part of the hero. It is never a loader.

### Semantic state at time zero

- One server-rendered navigation is visible to assistive technology and keyboard users.
- One server-rendered hero heading and `Book your spot` CTA are focusable and operable.
- The hero poster has intrinsic dimensions and a useful fallback colour.
- Animated copies are `aria-hidden="true"`, `inert`, have no interactive descendants and never duplicate exposed IDs.
- If JavaScript fails, the static hero remains composed.

### Direct entry / hard refresh beats

| Beat | Desktop target | Touch target | Visual action | Semantic guarantee |
| --- | ---: | ---: | --- | --- |
| 0. Ready | 0 ms | 0 ms | Stable SSR hero exists beneath choreography | Navigation and CTA work |
| 1. Place | 0-650 ms | 0-400 ms | Three to six low-weight frames assemble: venue, turf, light | No fake progress |
| 2. Game | 650-1,800 ms | 400-1,050 ms | Action/contact frames exchange crop and establish football rhythm | User input may settle immediately |
| 3. Word | 1,800-2,800 ms | 1,050-1,650 ms | Short `ISKANDAR PUTERI / JOHOR` and campaign fragments align with final grid | Text duplicates stay hidden |
| 4. Match cut | 2,800-4,100 ms | 1,650-2,350 ms | Selected cells become the header slots and hero media window | One semantic header only |
| 5. Settle | 4,100-5,000 ms | 2,350-3,000 ms | Final hero fully stable; temporary transforms cleared | CTA has always been usable |

Actual timing is asset- and capability-aware. There is no artificial minimum. An asset-ready fine-pointer desktop may settle in 3.5-5.0 seconds; touch/mobile in 1.8-3.0 seconds.

### Return and reduced variants

- In-app return to Home: one 0.45-0.8 second match cut from the selected route frame into the stable hero.
- Reduced motion: render the stable hero immediately; at most a 0.2 second opacity change, no transforms, autoplay or stagger.
- Back/forward cache restoration: retain/restores normal document state; never replay over restored scroll position.

## Interruption matrix

| Trigger | Required response | Maximum response |
| --- | --- | ---: |
| Wheel/trackpad | Cancel pending beats, finish current transform to stable hero | 300 ms |
| Touch/pointer drag | Settle, release pointer capture, allow native scroll | 300 ms |
| `Tab`, arrow, Page Up/Down, Space, Home/End | Settle before focus/scroll action completes | 300 ms |
| CTA or navigation activation | Cancel opener and honor route immediately | Immediate route start |
| `Escape` | Settle opener; close only the currently open menu/dialog | 300 ms |
| Critical poster not ready at 800 ms | Remove choreography and reveal stable poster/fallback | Immediate |
| Image/video error | Remove media-dependent timeline and reveal stable fallback | Immediate |
| Visibility hidden | Pause media and timelines; do not accumulate time | Immediate |
| Resize/orientation/font reflow | Recalculate once stable; never jump focus | After layout settles |
| `prefers-reduced-motion` change | Stop decorative motion and compose reduced state | Immediate |

Every cancellation path clears inline transforms, temporary `will-change`, timers, media listeners and ScrollTriggers it owns.

## Scroll chapter choreography

1. **Book your spot**: contact sheet becomes the real header and hero through the same player, ball relationship and rectangular floodlight array.
2. **The ground**: the hero frame widens into the truthful adjacent-pitch relationship, then verified venue hardware becomes the action-frame edge; no pin.
3. **Get the ball moving**: the only justified pinned sequence. Run, press, pass, shoot and release use distinct masters. Progress follows user scroll with linear scrub; mobile becomes stacked native cuts without pinning.
4. **Pick. Book. Play.**: the final ball/touchline edge matches into real availability rows and price. Data appears in normal reading order, never as fake HUD animation.
5. **Bring your team**: audience words and one group composition share an editorial grid, not four identical cards.
6. **Find the ground**: venue media yields to the map and existing address; native map controls remain usable.
7. **Know before you go**: a quiet goal/net detail anchors normal FAQ and policy disclosures. No cinematic interaction hides an answer.
8. **Book your spot**: a unique final team image resolves to the exact key line and CTA with no repeated hero media.

FAQ, contact and support details enter inside chapters 6-8 as readable disclosure/text blocks. They do not receive decorative reveal effects.

## Route transition grammar

- On capable browsers, use the View Transitions API to carry one selected editorial frame or typographic rail into the destination heading.
- Native/GSAP fallback uses a short 180-320 ms transform/opacity match cut on a non-interactive duplicate.
- Reduced-motion fallback uses a 120-180 ms cross-fade or immediate navigation.
- The browser history action, focus restoration and destination scroll position remain authoritative.
- Booking, authentication and account routes never use Lenis or cinematic pinning.

## Implementation constraints for the later approved phase

- Keep existing `gsap`, `@gsap/react`, `ScrollTrigger` and `lenis`; add no animation package.
- Register GSAP plugins once client-side.
- Scope all choreography through `useGSAP` and component refs; clean up on unmount and route change.
- Create ScrollTriggers in document order with `invalidateOnRefresh`; refresh only after fonts/media affect layout.
- Animate transform and opacity first. A measured clip-path is allowed only if it does not create long tasks or paint instability.
- Animate the child of a pinned element, never the pin container itself.
- Use `ease: "none"` for scrubbed motion and do not combine scrub with `toggleActions`.
- Lenis is an enhancement only on capable fine-pointer desktop marketing pages with no reduced-motion preference.
- Touch, mobile, booking, authentication, account and reduced-motion experiences use native scrolling.
- Pause video offscreen and on hidden pages. Posters and intrinsic dimensions are mandatory.

## Performance budgets

These are release targets, not pre-production results:

- no animation may delay semantic LCP content or CTA availability;
- opener poster timeout: 800 ms;
- input-to-settle: at most 300 ms;
- no single main-thread task over 50 ms attributable to choreography on the test profile;
- no layout shifts from media, fonts or pin spacers after initial composition;
- hero video starts muted, inline, after poster/critical UI; no supporting clip preloads before needed;
- all scroll-linked animations must remain usable at 200% zoom and with keyboard-only navigation.

## Media readiness result

`BLOCKED` on 2026-08-02.

- `ffmpeg` and `ffprobe`: available.
- `inference`, `inference.sh`, `runcomfy`, `belt` and `remotion` CLIs: unavailable.
- No recognized video-provider token/key environment variable was present.
- No callable video-generation tool was available in the active tool set.
- No credential was created, printed or committed.

Therefore the required low-cost representative motion test is `NOT PERFORMED`. Generic parallax, a Ken Burns move or an FFmpeg slideshow does not count as a provider/continuity pass. One authorized image-to-video route must be configured outside committed application files, then a single inexpensive test must pass anatomy, ball, net, kit, light and architecture continuity review before any hero clip is promised.

## Motion verifier checklist

- [ ] Semantic navigation/hero/CTA operate from time zero.
- [ ] Animated duplicates are hidden, inert and non-focusable.
- [ ] Direct, return, touch and reduced variants match the timing contract.
- [ ] Wheel, touch, keyboard, navigation and media-failure interrupts settle in 300 ms or less.
- [ ] No duplicate focus, trapped scroll, lost history state or hidden CTA.
- [ ] One pinned action chapter only; mobile stays native.
- [ ] No blur, blink, flash, decorative parallax, random motion or second gimmick.
- [ ] Provider-generated motion test passes continuity review.
