# ArmourXSports venue context

Status: `REVISE`
Research capture: 2026-08-02, Asia/Singapore
Checkpoint: Client `v13`, Checkpoint 1 pre-production gate

## Decision summary

The map pin at `1.3940655, 103.6340126` lands inside the two-pitch parcel in Sunway City Iskandar Puteri. Current open map data resolves the pitch itself to **Jalan Medini Selatan 7, Sunway City Iskandar Puteri, 79250 Iskandar Puteri, Johor**. Persiaran Medini 3 is a nearby arterial and a broader Sunway City address used by neighbouring institutions. It is not evidence that the pitch has moved.

For visitor navigation, keep the verified coordinate and use Jalan Medini Selatan 7 as the access-road description. Do not replace the existing legal/postal line `LOT 165132, Persiaran Medini 3...` until the owner confirms which wording is registered and customer-facing. The legal/postal wording therefore remains `BLOCKED`; the physical pin and access-road finding are `PASSED`.

## Evidence ledger

| Item | Result | Evidence and limit |
| --- | --- | --- |
| Current Client pin | `PASSED` | `1.3940655, 103.6340126` lands within OpenStreetMap pitch way `1531152363`, whose current reverse-geocoded road is Jalan Medini Selatan 7 and postcode is 79250. |
| Specific access road | `PASSED` | OpenStreetMap and the legacy Waze place entry both use Jalan Medini Selatan 7. Waze's former name, phone, hours and `81550` postcode are legacy data and must not ship. |
| Persiaran Medini 3 difference | `PASSED` as a geographic explanation | OpenStreetMap maps Persiaran Medini 3 beside the venue; MBIP identifies it as a main Bandar Medini road; Sunway International School uses it as its campus address. This supports the conclusion that it is a broader nearby road/address, not a second venue. |
| Legal/postal ArmourXSports address | `BLOCKED` | No owner-signed document or current business listing was available to prove whether `LOT 165132` should pair with Persiaran Medini 3 or Jalan Medini Selatan 7. Owner confirmation is required before copy changes. |
| Satellite/context view | `PASSED` for design research | Esri World Imagery export captured 2026-08-02 shows the same two adjacent rectangular pitches, service access, shop/terrace blocks and surrounding road network. Underlying image date was not exposed, so it is corroborative context, not sole proof of current operations. Do not reuse it in the site. |
| Former-operator Facebook research | `BLOCKED` | The public page returned Facebook's temporary-block/login surface. No image, event, result or copy was taken from it. An owner-authorized browser session or export is required if that archive is needed later. |

## Source URLs

- Coordinate query: <https://www.google.com/maps/search/?api=1&query=1.3940655%2C103.6340126>
- OpenStreetMap pin: <https://www.openstreetmap.org/?mlat=1.3940655&mlon=103.6340126#map=19/1.3940655/103.6340126>
- OpenStreetMap reverse-geocode query used on 2026-08-02: <https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=1.3940655&lon=103.6340126&zoom=18&addressdetails=1&extratags=1&namedetails=1>
- Legacy Waze place entry, research only: <https://www.waze.com/live-map/directions/my/johor-darul-tazim/iskandar-puteri/j-arena-sunway?to=place.ChIJJdgxq-oJ2jERgpmwVUlroBw>
- MBIP road context: <https://www.mbip.gov.my/en/kalendar-aktiviti/event/203>
- Sunway City Persiaran Medini 3 address context: <https://www.sunwayschools.edu.my/sisj/apply/admissions>
- Esri World Imagery service used for context: <https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer>
- Former-operator Facebook page, research only: <https://www.facebook.com/p/J-Arena-100087782103274/>

## Physical venue observations

The following details are corroborated by the owner-attested local photographs and the map/satellite context:

- Two adjacent, fenced rectangular pitches occupy one venue parcel.
- Their long axes run approximately north-northwest to south-southeast. This is a visual estimate, not a surveyed bearing.
- Tall ball-stop netting encloses the playing areas. In night photographs, portions read blue under the lights.
- Multiple tall poles carry rectangular floodlight arrays.
- White pitch markings, portable small-sided goals and synthetic-looking green turf are visible. The exact surface specification and footwear rules remain unverified and must not be published.
- A low covered/service structure sits beside the pitches.
- Rows of shop/terrace buildings sit immediately north and northeast of the ground.
- White residential rows and rising terrain appear around the southern side; owner photographs also show a slim tower landmark and treeline/road lighting in the distance.
- Vehicle/service approach connects from the surrounding one-way road network. Parking arrangements, entrance hours and accessible drop-off details are not verified.

## Local reference archive

The folder `RANDOM FIELD IMAGES FOR ARMOURX SPORTS` contains 28 unique files. The owner attests that they are ArmourX-owned references. This attestation is recorded in `ASSET_MANIFEST.md`, but it does not prove model releases, child safeguarding clearance, team/sponsor releases or permission to publish every depicted person and mark.

Safe factual uses from the archive:

- venue geometry, pitch relationship, netting, goals, turf appearance, poles and floodlights;
- humid Johor night colour and community-football scale;
- football action and camera-position reference after fictionalizing people, kits, badges and sponsors.

Restricted uses:

- the team-winning and handshake/event images cannot be presented as ArmourXSports history;
- images containing children are geometry/event-context references only unless releases are documented;
- visible club, sponsor, old-operator or event branding must not survive into generated campaign assets;
- identifiable people must not be treated as endorsed campaign talent without releases.

## Publishing rules

Allowed now:

- `Iskandar Puteri, Johor`;
- the verified map pin;
- a restrained location line referring to Jalan Medini Selatan 7, pending final owner wording;
- one natural statement that two adjacent bookable pitches are present, subject to Admin/owner confirmation at release.

Not allowed without new evidence:

- FIFA, stadium, full-size, professional-grade, world-class, LED, premium surface or all-weather claims;
- parking, changing-room, shower, spectator, food, equipment, accessibility, footwear or operating-hour claims;
- testimonials, attendance, sponsors, historical results or former-operator events as ArmourXSports history;
- names of neighbouring buildings inferred only from imagery.

## Owner confirmations required

1. Choose the customer-facing address line and confirm whether `LOT 165132` is legally paired with Persiaran Medini 3 or Jalan Medini Selatan 7.
2. Confirm current entry, parking/drop-off and accessibility guidance, if any should be published.
3. Confirm current surface and footwear rules from an authoritative source.
4. Confirm which facilities and operating facts are approved for public copy.
5. Provide release/provenance records for any real participant intended for direct commercial use.
