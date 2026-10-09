/* SCF Floor Kiosk prototype. EXAMPLE DATA ONLY.
   Plain JS, no build step. jobs.json stands in for FileMaker. */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var DATA = null;
  var state = { screen: 'schedule', idleLeft: 0, idleTotal: 0, timer: null, source: '' };
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Scale the 1920x1080 stage to whatever window it is in ----------
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    var st = $('stage');
    st.style.transform = 'scale(' + s + ')';
    st.style.left = ((window.innerWidth - 1920 * s) / 2) + 'px';
    st.style.top = ((window.innerHeight - 1080 * s) / 2) + 'px';
  }
  window.addEventListener('resize', fit);

  // ---------- Data ----------
  // Over http(s) we fetch jobs.json (like polling FileMaker). Opened from disk (file://),
  // Chrome blocks fetch, so we fall back to jobs-fallback.js, a copy of the same JSON.
  function loadData() {
    return fetch('jobs.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { state.source = 'jobs.json'; window.kioskDataSource = state.source; return d; })
      .catch(function () {
        if (window.KIOSK_FALLBACK_DATA) { state.source = 'jobs-fallback.js'; window.kioskDataSource = state.source; return window.KIOSK_FALLBACK_DATA; }
        throw new Error('No job data found');
      });
  }

  function idleSeconds() {
    var p = parseInt(params.get('idle'), 10);
    if (p > 0) return p;
    return (DATA && DATA.config && DATA.config.idleReturnSeconds) || 45;
  }

  // ---------- Helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function alloyClass(a) {
    a = (a || '').toLowerCase();
    if (a.indexOf('ductile') >= 0) return 'alloy-ductile';
    if (a.indexOf('ni') === 0) return 'alloy-nihard';
    return 'alloy-gray';
  }
  function alloyShort(a) {
    a = (a || '').toLowerCase();
    if (a.indexOf('ductile') >= 0) return 'DUCTILE';
    if (a.indexOf('ni') === 0) return 'NI-HARD';
    return 'GRAY';
  }
  var CAMERA = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h3l2-3h8l2 3h3v11H3z"/><circle cx="12" cy="13" r="4"/></svg>';

  // ---------- Clock ----------
  function tickClock() {
    var d = new Date();
    $('clockTime').textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    $('clockDate').textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  }

  // ---------- Screens ----------
  function show(name) {
    state.screen = name;
    ['schedule', 'job', 'error'].forEach(function (n) {
      $('screen-' + n).classList.toggle('active', n === name);
    });
    $('screenLabel').textContent = name === 'schedule' ? (DATA.config.screenTitle || 'POUR SCHEDULE')
      : name === 'job' ? 'JOB INSTRUCTIONS' : 'SCAN ERROR';
    document.body.setAttribute('data-screen', name);
  }

  function renderSchedule() {
    var rows = DATA.schedule.map(function (s) {
      var j = DATA.jobs[s.job] || {};
      var st = (s.status || '').toUpperCase();
      var cls = st === 'POURED' ? 'done' : st === 'POURING' ? 'now' : '';
      return '<tr class="' + cls + '">' +
        '<td><span class="when">' + esc(s.pourWindow) + '</span><span class="status ' + esc(st.split(' ')[0]) + '">' + esc(st) + '</span></td>' +
        '<td>' + esc(s.job) + '</td>' +
        '<td class="cust">' + esc(j.customer) + '</td>' +
        '<td>' + esc(j.pattern) + '</td>' +
        '<td class="' + alloyClass(j.alloy) + '">' + alloyShort(j.alloy) + '</td>' +
        '<td class="num">' + esc(j.qty) + '</td>' +
        '<td>' + (j.coreRequired ? '<span class="chip core">CORE</span>' : '<span class="chip nocore">NO CORE</span>') + '</td>' +
        '</tr>';
    });
    document.querySelector('#schedTable tbody').innerHTML = rows.join('');
    $('schedLine').textContent = DATA.config.line || '';
    $('plantName').textContent = DATA.config.plantName || 'SIOUX CITY FOUNDRY';
  }

  function goSchedule() {
    stopTimer();
    renderSchedule();
    show('schedule');
  }

  function renderJob(no, j) {
    $('jJob').textContent = no;
    $('jCustomer').textContent = j.customer;
    $('jPattern').textContent = j.pattern;
    var a = $('jAlloy');
    a.textContent = (j.alloy || '').toUpperCase();
    a.className = 'val ' + alloyClass(j.alloy);
    $('jGrade').textContent = j.grade || '';
    $('jQty').textContent = j.qty;
    $('jTemp').textContent = j.pourTempF ? j.pourTempF + ' F' : '';
    $('jWeights').innerHTML = esc(j.copeLb) + ' / ' + esc(j.dragLb) + ' LB';
    $('jFlask').textContent = j.flask || '';
    $('jLoc').textContent = j.location || '';
    $('jMold').innerHTML = (j.moldSteps || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    var cores = j.coreSteps || [];
    document.querySelector('#jCores tbody').innerHTML = cores.length ? cores.map(function (c) {
      return '<tr><td class="cid">' + esc(c.id) + '</td><td class="ctype">' + esc(c.type) + '</td><td class="cnote">' + esc(c.note) + '</td><td class="cqty">x' + esc(c.qty) + '</td></tr>';
    }).join('') : '<tr><td class="nocores">NO CORES ON THIS JOB</td></tr>';
    $('jCautions').innerHTML = (j.cautions || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    $('jPhotos').innerHTML = (j.photos || []).slice(0, 3).map(function (p) {
      return '<div class="photo">' + CAMERA + '<div>' + esc(p) + '</div><small>PHOTO PLACEHOLDER</small></div>';
    }).join('');
  }

  // ---------- Idle auto-return ----------
  function stopTimer() { if (state.timer) { clearInterval(state.timer); state.timer = null; } }
  function startTimer(seconds, onTick) {
    stopTimer();
    state.idleTotal = seconds; state.idleLeft = seconds;
    onTick();
    state.timer = setInterval(function () {
      state.idleLeft -= 1;
      if (state.idleLeft <= 0) { goSchedule(); return; }
      onTick();
    }, 1000);
  }
  function jobTick() {
    $('idleSecs').textContent = state.idleLeft;
    $('idleFill').style.width = (100 * state.idleLeft / state.idleTotal) + '%';
  }
  function errTick() { $('errSecs').textContent = state.idleLeft; }
  function resetIdle() {
    if (state.screen === 'job') { state.idleLeft = state.idleTotal; jobTick(); }
  }

  // ---------- Scan handling ----------
  function normalize(raw) {
    var s = String(raw || '').trim();
    // Accept a bare job number (recommended) or a URL with ?job= / ?param= (fmp:// or WebDirect style).
    var m = s.match(/[?&](?:job|param)=([^&#]+)/i);
    if (m) s = decodeURIComponent(m[1]);
    return s.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
  }

  function toast(msg, bad) {
    var t = $('scanToast');
    t.textContent = msg; t.classList.toggle('bad', !!bad); t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  function handleScan(raw) {
    var code = normalize(raw);
    if (!code) return;
    var job = DATA.jobs[code];
    var t = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (job) {
      renderJob(code, job);
      show('job');
      startTimer(idleSeconds(), jobTick);
      toast('SCANNED ' + code + '  ' + t);
    } else {
      $('errCode').textContent = String(raw).trim().slice(0, 40) || '(blank)';
      show('error');
      startTimer((DATA.config && DATA.config.errorReturnSeconds) || 10, errTick);
      toast('UNKNOWN CODE', true);
    }
  }
  window.kioskScan = handleScan; // handy for testing from the console

  // Hidden keyboard listener. A USB keyboard-wedge scanner "types" the QR text and presses Enter.
  // No visible input box is needed; we buffer printable keys and submit on Enter.
  var buf = '', lastKey = 0, GAP_MS = 1500;
  window.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    var now = Date.now();
    if (now - lastKey > GAP_MS) buf = '';
    lastKey = now;
    if (e.key === 'Enter') {
      e.preventDefault();
      var code = buf; buf = '';
      if (code) handleScan(code);
      return;
    }
    if (e.key === 'Escape') { buf = ''; goSchedule(); return; }
    if (e.key && e.key.length === 1) { buf += e.key; e.preventDefault(); resetIdle(); }
  }, true);
  ['mousedown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, resetIdle, { passive: true }); });

  // Simulated scan: dispatches real key events through the same listener as the scanner.
  function simulateScan(text) {
    var chars = String(text).split('');
    var i = 0;
    (function next() {
      if (i < chars.length) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: chars[i++], bubbles: true }));
        setTimeout(next, 12);
      } else {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      }
    })();
  }
  window.kioskSimulateScan = simulateScan;

  // ---------- Demo panel ----------
  function buildDemo() {
    if (params.get('demo') === '0') { document.body.classList.add('kiosk'); return; }
    var btns = Object.keys(DATA.jobs).map(function (no) {
      var j = DATA.jobs[no];
      return '<button type="button" tabindex="-1" data-scan="' + esc(no) + '">' + esc(no) + ' ' + esc(j.customer) + ' ' + esc(j.pattern) + '</button>';
    });
    $('demoButtons').innerHTML = btns.join('');
    $('demoPanel').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-scan]');
      if (b) { b.blur(); simulateScan(b.getAttribute('data-scan')); }
    });
    $('demoHome').addEventListener('click', function () { this.blur(); goSchedule(); });
    $('demoToggle').addEventListener('click', function () { this.blur(); $('demoPanel').classList.toggle('hidden'); });
    var idle = $('demoIdle');
    idle.value = idleSeconds();
    idle.addEventListener('change', function () { var v = parseInt(idle.value, 10); if (v > 0) { params.set('idle', v); } idle.blur(); });
    if (params.get('panel') === '1') $('demoPanel').classList.remove('hidden');
  }

  // ---------- Boot ----------
  fit();
  tickClock();
  setInterval(tickClock, 1000);
  loadData().then(function (d) {
    DATA = d;
    buildDemo();
    goSchedule();
    if (params.get('job')) handleScan(params.get('job'));
    // Re-read the data every 60 s, the way a real build would poll FileMaker.
    setInterval(function () {
      loadData().then(function (d2) { DATA = d2; if (state.screen === 'schedule') renderSchedule(); }).catch(function () {});
    }, 60000);
  }).catch(function (err) {
    document.querySelector('#schedTable tbody').innerHTML = '<tr><td colspan="7">NO JOB DATA: ' + esc(err.message) + '</td></tr>';
  });
})();
