# Image slots — AI photo generation manifest

Every imagery slot on the site currently ships with a **brand-palette illustration** (SVG),
so the page looks finished today. To upgrade to photographic AI images:

1. Generate each image below (Midjourney / DALL·E / Flux / Firefly) at the listed size.
2. Save as **JPG (quality ~80)** with the same base filename into this folder
   (e.g. `family-streaming.jpg`).
3. Do a find-and-replace in `index.html`: `assets/img/` + `.svg"` → `.jpg"` for the
   photo slots (or swap each `src` by hand). Nothing else changes — dimensions, alt text,
   lazy-loading and hover/parallax treatments are already wired.

Shared style directive (append to every prompt):
> candid documentary photography, warm natural light, authentic diverse Midwest-American
> people, shallow depth of field, editorial quality, no text, no logos, no watermarks

| File | Size (px) | Used in | Prompt |
|---|---|---|---|
| `family-streaming.jpg` | 1200×900 | "Local life" strip, card 1 | Cozy evening living room, a family of four on a couch watching a bright TV, blue glow from the screen, popcorn bowl, laughter, seen from slightly behind the couch |
| `remote-work.jpg` | 1200×900 | "Local life" strip, card 2 | Sunny kitchen table home office, one person on a video call on a laptop, coffee mug, houseplant, relaxed confident expression, morning light through a window |
| `game-day.jpg` | 1200×900 | "Local life" strip, card 3 | Friends in team colors cheering at a TV showing a football game at home, foam finger, snacks on the table, joyful mid-cheer moment |
| `address-check.jpg` | 800×600 | "How it works", step 1 card | Charming Midwest house exterior on a sunny street, oversized red map pin hovering above the roof — conceptual real-estate-style shot, clean and bright |
| `pick-plan.jpg` | 800×600 | "How it works", step 2 card | Close-up of hands comparing internet plan options on a tablet at a kitchen table, warm light, shallow depth of field |
| `tech-install.jpg` | 800×600 | "How it works", step 3 card | Friendly broadband technician in a blue uniform and cap at a front door, holding a white Wi-Fi router, homeowner's porch, midday, welcoming smile |
| `phone-life.jpg` | 800×800 | 5G section, floating snapshot | Person walking in a leafy city park smiling at their smartphone, sunny day, candid street-style shot |

Notes
- Keep subjects generic (no real logos, jerseys with readable team names, or celebrity likenesses).
- The "Local life" cards carry a caption over a dark bottom gradient; keep the lower third
  uncluttered and prefer a slightly darker exposure.
- Compress with e.g. Squoosh (MozJPEG ~75) to keep each file under ~150 KB for PageSpeed.
