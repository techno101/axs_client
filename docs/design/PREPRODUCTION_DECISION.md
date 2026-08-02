# Checkpoint 1 pre-production decision

Decision: **APPROVED FOR STATIC-POSTER IMPLEMENTATION**
Recorded: 2026-08-02
Branch: Client `v13` from `origin/v12@35453aa`

This is the mandatory boundary before high-resolution batch generation or homepage component coding. The owner supplied the typefaces, corrected the key line to **Book your spot**, rejected the v12 public direction, and explicitly directed development to proceed on 2026-08-02. Independent revision 3 is approved. That authorizes the static-poster implementation below; it does not turn the unavailable provider clip into a pass or authorize production promotion.

## Pack reviewed

| Deliverable | Result | Evidence |
| --- | --- | --- |
| Venue context | `PASSED` | Verified coordinate remains the directions target. The existing customer-facing LOT/Persiaran Medini 3 line is retained rather than replaced from public references. |
| Design bible | `PASSED` | Owner supplied both font packages. Ethnocentric is restricted to non-embedded flattened artwork under its supplied desktop EULA; supplied Exo 2 is the live semantic family. |
| Motion bible | `PARTIALLY IMPLEMENTED` | The contact-sheet settle, keyboard/touch/scroll interruption, reduced-motion and native-scroll variants are implemented and tested; provider clip remains blocked. |
| Desktop and mobile wireframes | `PASSED` | Rewritten around the exact `Book your spot` key line and direct eight-chapter flow; the remaining navigation shorthand was corrected to `BOOK YOUR SPOT`. All rejected v12 section concepts are removed. |
| Eight-chapter storyboard | `PASSED` | English/BM copy uses direct functional language, mentions two adjacent pitches once and contains 16 unique still roles. Chapter 4 BM now says `pilih slot yang tersedia`. |
| Asset manifest/provenance | `PASSED` for review | 28 local sources, rights limits, 16 still roles and 11 quarantined v12 assets are recorded. |
| Typography/palette proof | `PASSED` | `TYPOGRAPHY_PALETTE_PROOF-v2.png` shows actual flattened Ethnocentric, Exo 2 ExtraBold, long English/BM text, 390 px wrapping and a 200% zoom sample. |
| Four low-resolution anchors | `PASSED` | `M01/M03/M08` v2 plus `M13` v3 and `ANCHOR_CONTACT_SHEET-v3.png` passed independent review. They use consistent verified venue language, blank kits and credible anatomy. `M01` uses exact `M03` crops so the Match Cut invariant is deterministic; `M13` uses asymmetric spacing, varied gait and natural interaction. |
| Representative motion test | `BLOCKED` | No authorized provider/CLI/token route is available. FFmpeg is not a generation provider; the site uses a clearly static poster fallback. |
| Reference screenshots | `PASSED` | Desktop/mobile headless captures for United in Football, The Performance Lab, Escape and Apple were inspected. Capture limits for blocked sources and incomplete third-party media are recorded in `REFERENCE_STUDY.md`. |

## Implementation authorization and remaining gates

The owner decision is **APPROVED FOR STATIC-POSTER IMPLEMENTATION**. It authorizes use of the four approved anchors and the flattened, licence-safe Ethnocentric title art in the candidate homepage. It is not a final English/BM desktop/mobile production acceptance.

1. One authorized image-to-video provider route must be configured outside committed application files, then one inexpensive test must pass independent continuity review before a hero clip is claimed.
2. The remaining unique-master roles (`M02`, `M05-M07`, `M09-M12`, `M14-M17`) need their own approved generation/provenance route before a complete 14-18-master library is claimed.
3. Final owner acceptance, controlled sandbox booking, deployment and canonical live English/BM verification remain release gates.

## Independent visual-verifier decision

The first review was **REVISE**, recorded in [INDEPENDENT_VISUAL_REVIEW.md](INDEPENDENT_VISUAL_REVIEW.md). The revision 2 review was also **REVISE**, recorded in [INDEPENDENT_VISUAL_REVIEW_V2.md](INDEPENDENT_VISUAL_REVIEW_V2.md). Its three still/copy findings were corrected. Revision 3 is **APPROVED**, recorded in [INDEPENDENT_VISUAL_REVIEW_V3.md](INDEPENDENT_VISUAL_REVIEW_V3.md). The implemented candidate was reviewed again and is **APPROVED**, recorded in [INDEPENDENT_VISUAL_REVIEW_IMPLEMENTED.md](INDEPENDENT_VISUAL_REVIEW_IMPLEMENTED.md). The provider-video and final live release gates remain open.

## Owner direction

`APPROVED FOR STATIC-POSTER IMPLEMENTATION` was recorded on 2026-08-02. The owner supplied the fonts, corrected the key line to **Book your spot**, rejected all quoted v12 homepage copy/flow/images/concept and explicitly directed continued execution without further non-blocking questions. It authorizes this rebuilt candidate, but does not fabricate final production visual acceptance before the provider/media and release gates exist.

## Scope lock

- High-resolution asset batch: `DEFERRED` (four approved anchors only)
- Homepage component coding: `PASSED` for the static-poster candidate
- Local validation/build gate: `PASSED`; release gate remains `BLOCKED`
- Remote `v13` push: recorded in the completion entry after the reviewed commit
- `origin/main` promotion: `NOT PERFORMED`
- Vercel/canonical live verification: `NOT PERFORMED`
- Checkpoint 2: `NOT PERFORMED`
