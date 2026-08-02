# Anchor revision 2 prompt and command record

Recorded: 2026-08-02
Tool path: built-in OpenAI `image_gen` for `M03`, `M08` and `M13`; deterministic FFmpeg composition for `M01` and all proof-size derivatives
Model/version: not exposed by the built-in image-generation tool
Seeds: not exposed

All source photographs are owner-attested ArmourX references used only for geometry, action physics and community-football context. Every generated person is fictional. No source identity, team, sponsor, event or result is transferred.

## M03 hero generation

Reference inputs:

1. `R13` venue geometry
2. `R18` venue geometry
3. `R27` action physics

```text
Use case: photorealistic-natural
Asset type: low-resolution website hero anchor for ArmourXSports in Iskandar Puteri, Johor
Input images: Images 1 and 2 are venue-geometry references only; Image 3 is football-physics reference only. Replace every real person and all branding.
Primary request: create a truthful, cinematic but natural 16:9 touchline-level photograph at the same modest Malaysian community football ground. A single fictional adult Malaysian male player occupies the right third, moving left with his left boot immediately behind a plain white football placed on a diagonal painted touchline. His pose, ball relationship, and the verified rectangular multi-panel floodlight array directly above and behind him must be exceptionally clear because all four features will be reused as a visual invariant in a contact-sheet transformation.
Scene/backdrop: preserve tall ball-stop netting, simple white goal scale, artificial turf, the real row of modern terrace houses on rising ground, and the slim tower landmark visible in the supplied venue references. Show one rectangular grid floodlight array on a straight pole, matching the reference shape. This is a local fenced ground, not a stadium.
Style/medium: premium natural sports editorial photography, realistic skin and fabric, slight humid blue-hour atmosphere, controlled contrast, no fantasy lighting.
Composition/framing: wide 16:9, camera near touchline at waist height, left 42 percent kept calm and dark enough for live page copy, full body of the player visible, ball fully visible, floodlight array not cropped.
Subject: fictional adult Malaysian man, neutral identity, solid matte deep navy jersey, solid black shorts and socks, smooth generic black football boots. No other foreground player. At most two distant soft background adults in completely plain kits.
Constraints: exactly two arms and two legs per person; natural hands and ankles; credible planted-foot balance, ball size and shadow; geometrically straight net and goal; consistent light direction; every garment and boot surface totally blank.
Avoid: any logo, crest, sponsor, number, letters, stripes, swoosh, product-like shoe panel, trademark, watermark, text, old operator identity, child, trophy, crowd, stadium bowl, grandstand, foreign skyline, circular floodlight bulbs, six-round-lamp fixtures, duplicated people, warped hands, merged limbs, extra balls, fake aerial view, neon glow, poster typography.
```

## M03 precise cleanup

```text
Use case: precise-object-edit
Asset type: ArmourXSports low-resolution hero anchor cleanup
Input image: Image 1 is the sole edit target.
Primary request: remove only the small white swoosh-like mark on the player's shorts and the tiny white rectangular mark near the lower hem of his jersey. Replace both with seamless solid fabric matching the surrounding navy and black.
Constraints: preserve the exact player identity, face, hair, pose, anatomy, hands, feet, smooth black boots, ball position, painted line, goal, netting, buildings, tower, rectangular multi-panel floodlight array, lighting, camera, crop, depth of field and every other pixel-level composition choice. Keep jersey, shorts, socks and boots completely blank. No text, crest, sponsor, number, stripe, badge, product mark, watermark or added object.
```

## M01 deterministic Match Cut composition

`M01` is composed entirely from the cleaned `M03` v2 pixels. This guarantees the transition invariant instead of asking a second generation to imitate it.

```powershell
ffmpeg -i M03-hero-anchor-v2.png -f lavfi -i color=c=0x0F1339:s=1280x720 `
  -filter_complex "[0:v]split=4[a][b][c][d]; `
  [a]crop=800:640:480:40,scale=780:620[hero]; `
  [b]crop=360:300:650:0,scale=350:280[light]; `
  [c]crop=500:300:500:300,scale=350:210[goal]; `
  [d]crop=600:180:420:520,scale=350:105[turf]; `
  [1:v][light]overlay=70:45[tmp1]; `
  [tmp1][goal]overlay=70:350[tmp2]; `
  [tmp2][turf]overlay=70:590[tmp3]; `
  [tmp3][hero]overlay=465:50[out]" `
  -map "[out]" -frames:v 1 M01-opening-anchor-v2.png
```

## M08 action generation

Reference inputs:

1. Cleaned `M03` v2 for campaign continuity
2. `R13` for venue hardware/neighbourhood
3. `R27` for action physics only

```text
Use case: photorealistic-natural
Asset type: low-resolution action anchor for the ArmourXSports homepage
Input images: Image 1 defines the campaign's venue, light, color and completely blank kit standard. Image 2 defines verified venue hardware and neighbourhood. Image 3 defines only credible two-player football physics; do not preserve either real person's identity or branding.
Primary request: create a grounded 3:2 sports editorial photograph of two fictional adult Malaysian male players contesting one plain white football at the same ArmourXSports community ground as Image 1. The navy player shields the ball while moving left; a plain off-white opponent presses from the side without fouling. Make the duel readable, balanced and physically exact.
Scene/backdrop: same tall ball-stop netting, artificial turf, simple white goal, modern terrace houses on rising ground, slim tower landmark, and a straight pole with the same rectangular multi-panel floodlight array as Image 1. Keep the modest local-ground scale.
Style/medium: natural premium football photography, crisp main action, realistic skin, sweat and fabric, shallow but not artificial depth of field, same blue-hour color response as Image 1.
Composition/framing: 3:2 landscape, both full bodies and the whole ball visible, camera at knee-to-waist height, action centered slightly right, enough venue context to prove continuity.
Subject: exactly two foreground fictional adults. Player one wears an entirely blank solid deep navy jersey, black shorts, black socks and smooth generic black boots. Player two wears an entirely blank matte off-white jersey, dark green shorts, off-white socks and smooth generic dark boots.
Constraints: exactly two arms and two legs each; natural fingers, knees, ankles and foot placement; one normal-size ball with credible contact and shadow; shirts, shorts, socks and boots must be seamless solid colors with zero marks; straight goal, net, fence and light pole; rectangular array only.
Avoid: all logos, crests, numbers, sponsors, letters, stripes, swooshes, shoe panels, trademarks, watermarks, text, children, crowd, stadium, grandstand, foreign skyline, circular or six-round floodlights, extra players near the duel, extra balls, merged limbs, tangled feet, floating ball, impossible tackle, neon glow.
```

## M13 team generation

Reference inputs:

1. Cleaned `M03` v2 for campaign continuity
2. `R13` for venue hardware/neighbourhood
3. `R21` for grouping scale only

```text
Use case: photorealistic-natural
Asset type: low-resolution Bring Your Team anchor for the ArmourXSports homepage
Input images: Image 1 locks the campaign venue, rectangular floodlight hardware, palette and blank-kit standard. Image 2 locks neighbourhood, pitch, net and goal geometry. Image 3 is grouping scale only; replace every person and every brand.
Primary request: create a natural 3:2 sports editorial photograph of exactly six fictional adult Malaysian football players walking together from the touchline toward the pitch before a casual game. Photograph mostly from behind and slight three-quarter angles so the group feels real without relying on close facial detail or handshakes. Their movement should feel relaxed, confident and social, not staged or victorious.
Scene/backdrop: same modest ArmourXSports ground as Image 1, with artificial turf, tall ball-stop net, simple white goal, terrace houses on rising ground, slim tower landmark, and one straight pole carrying the same rectangular multi-panel floodlight array. No stadium architecture.
Style/medium: premium natural community-football photography, realistic skin and fabric, humid blue-hour atmosphere matching Image 1, restrained depth of field.
Composition/framing: 3:2 landscape, full bodies and all feet visible, group occupies center and right two-thirds, venue context clearly visible, no one cropped at a joint.
Subject: exactly six fictional adult Malaysian men with varied realistic builds and skin tones. Three wear seamless solid navy jerseys, three wear seamless matte off-white jerseys. All wear plain black shorts, solid socks and smooth generic dark boots. Arms hang naturally or rest neutrally; no linked hands, no pile-on, no trophy.
Constraints: correct two arms and two legs per person; natural shoulders, elbows, hands, knees, ankles and gait; garments and footwear completely blank and unpatterned; goal, net, fence, pole and rectangular array geometrically straight; consistent light direction.
Avoid: all logos, crests, sponsors, numbers, letters, stripes, swooshes, brand-like shoe panels, trademarks, watermarks, text, children, crowd, celebration, trophy, result implication, stadium, grandstand, foreign skyline, circular or six-round floodlights, duplicated bodies, merged arms, tangled legs, floating feet, extra people near the group, extra balls, neon glow.
```

## Revised combined proof

- Output: `proofs/ANCHOR_CONTACT_SHEET-v2.png`
- Dimensions: 1600x900
- Bytes: 1,791,341
- SHA-256: `de3a969b9e44be9b5c1400ffaf6fe4330a050a70df5fe1775b614f9a83701eed`
- Layout: `M01` top left, `M03` top right, `M08` bottom left, `M13` bottom right
