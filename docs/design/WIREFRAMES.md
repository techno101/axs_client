# Homepage wireframes

Status: `REVISED FOR VERIFICATION`
Concept: The Match Cut
Key line: **Book your spot.**

These wireframes replace the visible v12 hero, pricing bands, field cards, facility cards and final slogan. Rectangles represent real media frames, not generic cards. The semantic page remains available in normal document order before animation starts.

## Desktop, 1440 x 900

### Opening becomes hero

```text
+------------------------------------------------------------------------------+
| [ARMOURX]   BOOK YOUR SPOT   GROUND   ABOUT   FAQ   CONTACT      EN / BM      |
|                                                                              |
| +-----------+  +----------------------+  +-----------+  +------------------+ |
| | net/goal  |  | SAME PLAYER + BALL   |  | turf line |  | RECTANGULAR      | |
| | detail    |  | HERO INVARIANT       |  | detail    |  | FLOODLIGHT ARRAY | |
| +-----------+  +----------------------+  +-----------+  +------------------+ |
|                                                                              |
| BOOK YOUR SPOT.        +---------------------------------------------------+ |
| Football in Iskandar   | same player, same ball relationship and same     | |
| Puteri. Pick a date,   | verified floodlight array expand into hero       | |
| choose an available    |                                                   | |
| pitch, and get booked. |                                                   | |
| [Book your spot]       +---------------------------------------------------+ |
+------------------------------------------------------------------------------+
```

The header, heading and CTA are server-rendered and usable from time zero. Animated contact-sheet copies are inert and hidden from assistive technology. User input settles immediately to the final hero.

### The ground

```text
+------------------------------------------------------------------------------+
| THE GROUND.                                                                  |
| Two adjacent pitches at one Iskandar Puteri venue.                           |
| Book one, or check both when your group needs more space.                    |
|                                                                              |
| +--------------------------------------------+  +--------------------------+ |
| | truthful wide ground relationship         |  | verified goal, net and  | |
| | no field cards or field-number campaign   |  | rectangular light array | |
| +--------------------------------------------+  +--------------------------+ |
+------------------------------------------------------------------------------+
```

The two-pitch statement appears here once. Authoritative names remain in booking controls.

### Get the ball moving

```text
+------------------------------------------------------------------------------+
| GET THE BALL MOVING.                                                         |
|                                                                              |
| +------------------------------------------------------+  RUN                |
| |                                                      |  PRESS              |
| | one pinned editorial action frame on capable desktop|  PASS               |
| | unique media swaps through real player/ball edges    |  SHOOT              |
| |                                                      |                     |
| +------------------------------------------------------+                     |
+------------------------------------------------------------------------------+
```

This is the only pinned desktop chapter. The active word and matching unique image change together. There is no progress counter, decorative line or repeated hero crop.

### Pick. Book. Play.

```text
+------------------------------------------------------------------------------+
| +-------------------------------+  PICK. BOOK. PLAY.                          |
| | ball on real touchline        |  Choose a date, select what is available, |
| | edge becomes booking boundary |  and continue to payment.                 |
| +-------------------------------+                                             |
|                                                                              |
| [date]   [authoritative pitch]   [time]   [price]   [status]                 |
|                                                        [Book your spot]      |
+------------------------------------------------------------------------------+
```

Availability is real data in normal controls. No fake HUD, generic pricing cards or marketing claims surround it.

### Bring your team

```text
+------------------------------------------------------------------------------+
| BRING YOUR TEAM.                                                             |
|                                                                              |
| FRIENDS                 +-----------------------------------------------+     |
| CLUBS                   | fictional adult Malaysian community group    |     |
| SCHOOLS                 | one media composition, no four-card grid      |     |
| WORK TEAMS              +-----------------------------------------------+     |
+------------------------------------------------------------------------------+
```

### Find the ground

```text
+------------------------------------------------------------------------------+
| FIND THE GROUND.                                                             |
| Iskandar Puteri, Johor.                                                      |
|                                                                              |
| +--------------------------------------+  +--------------------------------+  |
| | verified ground-edge location image  |  | interactive map               |  |
| | real buildings, netting and terrain  |  | existing address              |  |
| +--------------------------------------+  | [Get directions] [Contact]     |  |
|                                           +--------------------------------+  |
+------------------------------------------------------------------------------+
```

### Know before you go

```text
+------------------------------------------------------------------------------+
| KNOW BEFORE YOU GO.                                                          |
| Booking, payment and venue answers in one place.                             |
|                                                                              |
| +----------------------------+  [booking answer disclosure]                  |
| | verified goal/net detail   |  [payment answer disclosure]                  |
| | quiet supporting master    |  [venue answer disclosure]                    |
| +----------------------------+  [policy/support links]                        |
+------------------------------------------------------------------------------+
```

### Final action

```text
+------------------------------------------------------------------------------+
| +-----------------------------------------+  BOOK YOUR SPOT.                  |
| | unique final team image                 |  Pick the date. Send the link.    |
| | never the hero or a winning-history shot|  Get the team together.          |
| +-----------------------------------------+  [Book your spot]                 |
|                                                                              |
| Ground   About   FAQ   Contact   Find booking   Policies   EN / BM            |
+------------------------------------------------------------------------------+
```

## Mobile, 390 x 844

### Opening and hero

```text
+--------------------------------+
| [ARMOURX]        EN/BM  [menu]  |
| +----------+ +---------------+  |
| | net/goal | | same hero     |  |
| +----------+ | invariant     |  |
| +----------+ +---------------+  |
| | turf     | | light array   |  |
| +----------+ +---------------+  |
|                                |
| BOOK YOUR SPOT.                |
| Football in Iskandar Puteri.   |
| Pick a date, choose an         |
| available pitch, and get your  |
| game booked.                   |
| [Book your spot]               |
| +----------------------------+ |
| | stable 4:5 hero crop       | |
| +----------------------------+ |
+--------------------------------+
```

Touch uses three to four contact-sheet cells, native scrolling and a shorter settle. It never pins or traps the viewport.

### Continuous chapters

```text
+--------------------------------+
| THE GROUND.                    |
| two-pitch copy, once           |
| [truthful venue 4:5]           |
+--------------------------------+
| GET THE BALL MOVING.           |
| [RUN unique still]             |
| [PRESS unique still]           |
| [PASS unique still]            |
| [SHOOT unique still]           |
| native sequence, no pin        |
+--------------------------------+
| PICK. BOOK. PLAY.              |
| [date]                         |
| [authoritative option]         |
| [authoritative option]         |
| [Book your spot]               |
+--------------------------------+
| BRING YOUR TEAM.               |
| Friends. Clubs. Schools.       |
| Work teams.                    |
| [unique group image]           |
+--------------------------------+
| FIND THE GROUND.               |
| [location image]               |
| [address] [Get directions]     |
| [map with native controls]     |
+--------------------------------+
| KNOW BEFORE YOU GO.            |
| [goal/net detail]              |
| [FAQ disclosures]              |
+--------------------------------+
| BOOK YOUR SPOT.                |
| [unique final team image]      |
| Pick the date. Send the link.  |
| Get the team together.         |
| [Book your spot]               |
| [support and policy links]     |
+--------------------------------+
```

## Failure and accessibility states

- Keyboard, wheel, touch, route selection or media error settles the opening within 300 ms.
- Reduced motion renders the final hero immediately with at most a short opacity transition.
- At 200% zoom, desktop becomes the same single-column native order as mobile.
- Failed media keeps every heading, CTA, booking control, address, FAQ and footer usable.
- Failed JavaScript renders the final navigation, hero and all chapters in normal document flow.
- The interactive map, live availability, CTA and disclosures never sit inside pinned or duplicated animation layers.
