# SCF Floor Kiosk: clickable prototype (2026-10-09)

**EXAMPLE DATA ONLY.** Every job, quantity, temperature, step and caution here is made up for a demo.
Job numbers (99001xx) are fake. Customer names (Northland Turbine, Midwest Conveyor, etc.) and pattern numbers are
invented too. Nothing is connected to FileMaker.

## Run it
1. Unzip anywhere. Open `index.html` in Chrome (double-click or drag it in).
2. Press **F11** for full screen. The layout is built at 1920x1080 and scales to fit any window.
3. Scan or simulate:
   - **USB scanner:** plug in any keyboard-wedge scanner and scan a ticket from `qr/print-sheet.html`
     (or `qr/print-sheet.pdf`). It types the job number and Enter; no input box or click needed.
   - **No scanner:** click the small **DEMO** button bottom-left for scan buttons. They send the same
     keystrokes a scanner would. Typing a job number on the keyboard and pressing Enter also works.
   - `BAD-0000` (or any unknown code) shows the error screen.
   - **Esc** returns to the schedule.

URL options (add after `index.html`):
| Option | Effect |
|---|---|
| `?idle=10` | Seconds of no activity on a job screen before it returns to the schedule (default 45, set in `jobs.json`). |
| `?demo=0` | Kiosk mode: hides the DEMO button and the mouse cursor. |
| `?job=9900102` | Opens straight to a job (also how a WebDirect-style deep link would behave). |
| `?panel=1` | Opens with the demo panel showing. |

## Screens
- **Pour schedule** (default): pour time and status, job, customer, pattern, alloy (gray iron, ductile iron, Ni-Hard), qty, core or no core, live clock.
- **Job instructions:** job number, customer, pattern, alloy and grade, qty, pour temp, cope/drag weights, flask, pattern location, mold steps, core set, cautions, 3 photo placeholders, and an idle countdown bar.
- **Job not found:** shows what was scanned, then returns to the schedule after 10 s.
- **Auto-return:** any job screen goes back to the schedule after N idle seconds.

Sizing follows the project note: about 1 in of letter height per 10 ft, so the schedule rows use ~56 px bold caps
(about 1.4 in on a 55 in TV) and key numbers (job, pattern, temp) use 56 to 96 px. Step text is ~31 px, which is
readable closer in (about 8 to 10 ft); the job number, pattern, alloy and caution panel carry the 20 ft read.

## Files
| File | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | The app. Plain HTML/CSS/JS, no build step, no internet needed. |
| `jobs.json` | Stand-in for FileMaker: config, today's schedule, and job records. **Edit this one.** |
| `jobs-fallback.js` | Copy of `jobs.json` used when the page is opened from disk (`file://`), where Chrome blocks `fetch`. Regenerate with `python3 tools/make_fallback.py` after editing `jobs.json`. Over http(s) the app reads `jobs.json` directly. |
| `qr/` | QR PNGs (each holds only the job number) plus `print-sheet.html` / `print-sheet.pdf`. Regenerate with `python3 tools/make_qr.py` (needs `pip install qrcode pillow`). |
| `screenshots/` | 1920x1080 headless Chrome captures of each screen. |
| `tools/shoot.py` | Headless Playwright test that scans each job, checks the error and idle states, and retakes the screenshots. |

## Connecting to real FileMaker later (not set up)
None of this exists yet. These are the three likely paths, roughly in order of how much they change the prototype.
The app only needs one thing from FileMaker: JSON shaped like `jobs.json` (a schedule list plus job records by job number).

1. **Scheduled export (simplest).** A FileMaker Server schedule runs a script every 1 to 5 min that writes
   `jobs.json` (or a CSV turned into JSON) to a shared folder or a small web server the kiosk PC can read.
   The page already re-reads its data every 60 s. No credentials live on the kiosk. Data is only as fresh as the schedule.
2. **FileMaker Data API (REST).** A tiny proxy on the server side (IIS, Node, or a FileMaker-hosted page) logs in with a
   read-only account, calls `POST /fmi/data/vLatest/databases/<file>/sessions` for a token, then
   `POST .../layouts/<KioskSchedule>/_find` and `GET .../layouts/<KioskJob>/records?...` or `_find` on the job number,
   and returns the trimmed JSON. Keep the account and token in the proxy, not in the browser. Needs Data API enabled on the server.
3. **OData (FileMaker Server 19.x and later).** Same proxy idea with
   `GET /fmi/odata/v4/<file>/<Table>?$filter=JobNumber eq '9900102'` and `$select` for just the fields shown.
   Good if IT already uses OData tools (Power BI, Excel).

Things to decide with IT: which layouts or tables to expose, a read-only kiosk account, where photos are stored
(container fields served by URL, or a file share), and how the schedule for "today" is defined.
Alternative from the note: skip this web page and build a 1920x1080 WebDirect layout in FileMaker itself.

## Known limits
- Example data only; no network calls besides reading local `jobs.json`.
- Photos are placeholders.
- Fonts: designed for Windows (Arial Black / Segoe UI). Other systems fall back to a bold sans.
- The scanner listener treats keystrokes that arrive within 1.5 s of each other as one scan, ended by Enter.
  It ignores keys typed into the demo panel's number box.
- Tested in headless Google Chrome via Playwright at 1920x1080 only. Not tried on real TV hardware or a real scanner.
