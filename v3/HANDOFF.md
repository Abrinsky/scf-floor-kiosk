# SCF Floor Kiosk handoff

For Abe and SCF IT. All data in these demos is example data. Job numbers, customers and patterns are invented. Photos are labeled placeholders.

## Live links

- v1 (original pour schedule kiosk): https://abrinsky.github.io/scf-floor-kiosk/
- v2 (phone and TV job instructions): https://abrinsky.github.io/scf-floor-kiosk/v2/
- v3 start screen: https://abrinsky.github.io/scf-floor-kiosk/v3/
- v3 TV kiosk (1920 x 1080): https://abrinsky.github.io/scf-floor-kiosk/v3/tv.html
- v3 iPad controller (1024 x 1366): https://abrinsky.github.io/scf-floor-kiosk/v3/ipad.html
- v3 FileMaker data sheet: https://abrinsky.github.io/scf-floor-kiosk/v3/spec.html

To see live sync in v3, open the TV and the iPad pages as two tabs or windows in the same browser.

## Adding real photos

v2:
1. Put the image files in the v2 folder, for example `v2/photos/NT-7138-1.jpg`.
2. In `v2/steps.json`, find the pattern and step, and set `"photo": "photos/NT-7138-1.jpg"`.
3. A step with an empty `photo` shows the grey placeholder with its `photoLabel`.
4. Use 4:3 photos about 800 px wide to keep the page fast.

v3:
- On the iPad page, open Steps, pick the pattern, and tap Take photo on a step. The photo is shrunk to 480 px wide and saved in this browser only.
- To make a photo part of the demo for everyone, add it to the seed data in `v3/store.js` (the `seedSteps` function sets `photo: ''`). Set `photo` to an image path such as `photos/core-good.jpg` and put the file in `v3/photos/`.

## Resetting demo data

- v3: on the start screen, tap Reset demo data. This clears assignments, pins, spotlight, step edits and photos taken on the iPad.
- v2: the only saved data is step progress per job. Use the Reset steps button on a job page.
- Clearing site data for abrinsky.github.io in the browser also resets everything.

## Test URL parameters (v3 TV)

- `tv.html?only=L2` shows only the listed lines, for example `?only=L1,L3`. This is a view for demos and screenshots. It is not saved.
- `tv.html?spot=CHAP` starts a 30 second spotlight on a station. Add `&line=L2` to pick the line. Station codes are CORE, CHAP, PAINT, TURN and POUR. This one is saved to the shared state, so an open iPad tab sees it too.
- v2 job links: `v2/#/job/9900101` opens a job directly.

## Known limits

- Photos are stored in the browser's localStorage, which holds about 5 MB. That is roughly 50 to 100 photos. When it is full, the iPad shows a "storage is full" message.
- Sync between the iPad and the TV only works between tabs in the same browser on the same device. A real setup needs a shared database, which is what the FileMaker rebuild is for.
- GitHub Pages caches files for a few minutes. After an update, the pages load new files through a version number such as `?v=4`. If something looks old, add `?v=` with a new number to the URL or do a hard refresh.
- The 3-row TV grid is tight. Long captions or cautions can get cut off. Keep ShortText to about 5 words and cautions to one short sentence.

## FileMaker rebuild

See spec.html (https://abrinsky.github.io/scf-floor-kiosk/v3/spec.html) for the tables, fields, types and layout notes: FileMaker Go on the iPad with Insert from Device for photos, the TV on WebDirect or Go with a 5 to 10 second OnTimer refresh, one fixed layout per row count plus a spotlight layout, and up and down reorder instead of drag.
