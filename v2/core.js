/* SCF Floor Kiosk v2 core: data, icons, routing, USB-wedge scan listener. EXAMPLE DATA ONLY. */
var Kiosk = (function () {
  'use strict';
  var K = { jobs: [], steps: {}, app: null };
  K.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function svg(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  K.icon = {
    camera: svg('<path d="M3 8h3l2-3h8l2 3h3v11H3z"/><circle cx="12" cy="13" r="4"/>'),
    scan: svg('<path d="M3 7V4h3M18 4h3v3M21 17v3h-3M6 20H3v-3"/><path d="M7 8v8M10 8v8M13 8v8M16 8v8"/>'),
    back: svg('<path d="M15 5l-7 7 7 7"/>'),
    search: svg('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>'),
    temp: svg('<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/><path d="M12 10v6"/>'),
    flask: svg('<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M3 12h18"/>'),
    weight: svg('<path d="M6 9h12l2 11H4z"/><circle cx="12" cy="6" r="2.5"/>'),
    pin: svg('<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
    warn: svg('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>'),
    check: svg('<path d="M5 12l5 5 9-10"/>'),
    next: svg('<path d="M9 5l7 7-7 7"/>'),
    part: svg('<rect x="4" y="6" width="16" height="12" rx="2"/><circle cx="12" cy="12" r="3.5"/><circle cx="7" cy="9" r=".8"/><circle cx="17" cy="9" r=".8"/><circle cx="7" cy="15" r=".8"/><circle cx="17" cy="15" r=".8"/>')
  };
  K.find = function (no) { for (var i = 0; i < K.jobs.length; i++) if (K.jobs[i].job === no) return K.jobs[i]; return null; };
  K.normalize = function (raw) {
    var s = String(raw || '').trim();
    var m = s.match(/[?&](?:job|param)=([^&#]+)/i);
    if (m) s = decodeURIComponent(m[1]);
    return s.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
  };
  // Scan or tap or search all go through here.
  K.open = function (raw) { var c = K.normalize(raw); if (c) location.hash = '#/job/' + encodeURIComponent(c); };
  K.home = function () { location.hash = '#/'; };
  function route() {
    var m = location.hash.match(/^#\/job\/(.+)$/);
    window.scrollTo(0, 0);
    if (!m) return K.renderHome();
    var no = decodeURIComponent(m[1]); var j = K.find(no);
    if (j) K.renderJob(j); else K.renderNotFound(no);
  }
  // USB keyboard-wedge scanner (same as v1): buffer keys, submit on Enter.
  var buf = '', last = 0;
  window.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    var now = Date.now(); if (now - last > 1500) buf = ''; last = now;
    if (e.key === 'Enter') { if (buf) { e.preventDefault(); var c = buf; buf = ''; K.open(c); } return; }
    if (e.key === 'Escape') { buf = ''; K.home(); return; }
    if (e.key && e.key.length === 1) buf += e.key;
  }, true);
  window.kioskScan = function (c) { K.open(c); };
  K.boot = function () {
    K.app = document.getElementById('app');
    Promise.all([fetch('jobs.json').then(function (r) { return r.json(); }), fetch('steps.json').then(function (r) { return r.json(); })])
      .then(function (d) { K.jobs = d[0].jobs; K.steps = d[1].patterns; window.addEventListener('hashchange', route); route(); })
      .catch(function (e) { K.app.innerHTML = '<p class="nf msg">Could not load job data: ' + K.esc(e.message) + '</p>'; });
  };
  return K;
})();
