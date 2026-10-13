/* SCF kiosk v3 shared data and state. EXAMPLE DATA ONLY: names and numbers are invented.
   State lives in localStorage and syncs between tabs with the storage event. */
var SCF = (function () {
  'use strict';
  var KEY = 'scf-v3-state';
  var S = {};
  S.lines = [
    { id: 'L1', name: 'Roller line 1' }, { id: 'L2', name: 'Roller line 2' },
    { id: 'L3', name: 'Roller line 3' }, { id: 'L4', name: 'Roller line 4' }
  ];
  S.stations = [
    { id: 'CORE', name: 'Cores' }, { id: 'CHAP', name: 'Chaplets' },
    { id: 'PAINT', name: 'Paint' }, { id: 'POUR', name: 'Close and pour' }
  ];
  S.jobs = [
    { job: '9900101', customer: 'Northland Turbine', pattern: 'NT-7138', alloy: 'Ductile Iron 65-45-12', qty: 3, pourTempF: 2600 },
    { job: '9900102', customer: 'Midwest Conveyor', pattern: 'MC-730', alloy: 'Gray Iron Class 30', qty: 9, pourTempF: 2550 },
    { job: '9900103', customer: 'Prairie Pump Works', pattern: 'PP-4410', alloy: 'Ni-Hard 4', qty: 4, pourTempF: 2650 },
    { job: '9900104', customer: 'River City Ag', pattern: 'RC-2207', alloy: 'Gray Iron Class 40', qty: 20, pourTempF: 2500 },
    { job: '9900105', customer: 'Hawkeye Hydraulics', pattern: 'HH-510', alloy: 'Ductile Iron 80-55-06', qty: 8, pourTempF: 2600 }
  ];
  // Seed steps per pattern, grouped by station. Photo is a data URL or '' (placeholder).
  function seedSteps(j) {
    var p = j.pattern, n = 0, out = [];
    function add(st, text, short, tv, caution, photoLabel) { out.push({ id: p + '-' + (++n), station: st, text: text, short: short, tv: tv, caution: caution || '', photoLabel: photoLabel, photo: '' }); }
    var cores = p !== 'RC-2207';
    add('CORE', cores ? 'Check every core for cracks and soft spots before it goes in the mould.' : 'No cores on this job. If a core print shows, stop and call the lead.', cores ? 'Cores clean, no cracks' : 'No cores on this job', true, cores ? '' : 'Core print showing means wrong pattern', cores ? 'good core, no cracks' : 'no core prints');
    if (cores) add('CORE', 'Set cores in letter order. Seat each one fully in its print.', 'Set cores A, B, C in order', false, '', 'cores seated in prints');
    add('CHAP', cores ? 'Place chaplets on the marks. Size must match the layout sheet.' : 'No chaplets. Check the mould face is clean.', cores ? 'Chaplets on marks, right size' : 'Mould face clean', true, p === 'NT-7138' ? 'Check chaplet sizes against the layout before closing' : '', cores ? 'chaplets on marks' : 'clean mould face');
    add('PAINT', 'Coat both halves evenly. No runs, no bare sand. Torch dry until it stops smoking.', 'Even coat, no runs, dry', true, '', 'even coat, torch dried');
    add('PAINT', 'Blow out loose sand from the cavity before closing.', 'Blow out cavity', false, '', 'clean cavity');
    add('POUR', 'Close the mould. Clamp and set weights. Pour at ' + j.pourTempF + ' F.', 'Clamped, weighted, ' + j.pourTempF + ' F', true, /Ductile/.test(j.alloy) ? 'Ductile: pour within 10 min of treatment' : (/Ni-Hard/.test(j.alloy) ? 'Ni-Hard: leave in mould 8 hours' : ''), 'closed and clamped mould');
    return out;
  }
  function defaults() {
    var steps = {};
    S.jobs.forEach(function (j) { steps[j.pattern] = seedSteps(j); });
    return { assign: { L1: '9900101', L2: '9900102', L3: '9900103', L4: '' }, pinned: ['L1', 'L2', 'L3'], spotlight: null, steps: steps, undo: [] };
  }
  S.state = null;
  S.load = function () {
    try { S.state = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S.state = null; }
    if (!S.state || !S.state.steps) S.state = defaults();
    return S.state;
  };
  S.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(S.state)); }
    catch (e) { alert('Storage is full. Remove a photo and try again.'); }
  };
  S.reset = function () { S.state = defaults(); S.save(); };
  S.job = function (no) { for (var i = 0; i < S.jobs.length; i++) if (S.jobs[i].job === no) return S.jobs[i]; return null; };
  S.onChange = function (fn) { window.addEventListener('storage', function (e) { if (e.key === KEY) { S.load(); fn(); } }); };
  S.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // Scale a fixed-size stage to fit the window.
  S.fit = function (el, w, h) {
    function f() { var s = Math.min(innerWidth / w, innerHeight / h); el.style.transform = 'scale(' + s + ')'; el.style.left = (innerWidth - w * s) / 2 + 'px'; el.style.top = (innerHeight - h * s) / 2 + 'px'; }
    addEventListener('resize', f); f();
  };
  function svg(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  S.icon = {
    camera: svg('<path d="M3 8h3l2-3h8l2 3h3v11H3z"/><circle cx="12" cy="13" r="4"/>'),
    warn: svg('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>'),
    up: svg('<path d="M6 15l6-6 6 6"/>'), down: svg('<path d="M6 9l6 6 6-6"/>'),
    pin: svg('<path d="M9 3h6l-1 6 3 3H7l3-3z"/><path d="M12 12v9"/>'),
    spot: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'),
    back: svg('<path d="M15 5l-7 7 7 7"/>'), undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'),
    tv: svg('<rect x="2" y="4" width="20" height="13" rx="1"/><path d="M8 21h8"/>'), pad: svg('<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/>')
  };
  S.photo = function (step, cls) {
    return '<div class="ph ' + (cls || '') + '">' + (step.photo ? '<img src="' + step.photo + '" alt="">' :
      S.icon.camera + '<span>Should look like: ' + S.esc(step.photoLabel) + '</span>') + '</div>';
  };
  return S;
})();
