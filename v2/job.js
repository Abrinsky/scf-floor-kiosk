/* Job screen: header with progress, key facts, all step cards with done tracking. */
(function (K) {
  'use strict';
  function load(no) { try { return JSON.parse(localStorage.getItem('kv2-done-' + no)) || {}; } catch (e) { return {}; } }
  function save(no, d) { try { localStorage.setItem('kv2-done-' + no, JSON.stringify(d)); } catch (e) {} }

  function openPhoto(step) {
    var e = K.esc, d = document.createElement('div');
    d.className = 'lightbox'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<button class="btn primary close" type="button">Close</button>' +
      '<div class="photo big">' + (step.photo ? '<img src="' + e(step.photo) + '" alt="' + e(step.photoLabel) + '">' : K.icon.camera + '<span>Photo: ' + e(step.photoLabel) + '</span>') + '</div>';
    d.querySelector('.close').addEventListener('click', function (ev) { ev.preventDefault(); d.remove(); });
    document.body.appendChild(d);
    d.querySelector('.close').focus({ preventScroll: true });
  }

  K.renderJob = function (j) {
    var e = K.esc, I = K.icon;
    var steps = K.steps[j.pattern] || [], n = steps.length, done = load(j.job);
    var cards = steps.map(function (s, i) {
      var photo = s.photo ? '<img src="' + e(s.photo) + '" alt="">' : I.camera + '<span>Photo: ' + e(s.photoLabel) + '</span>';
      return '<div class="step' + (done[i] ? ' done' : '') + '" data-i="' + i + '" role="checkbox" tabindex="0" aria-checked="' + !!done[i] + '">' +
        '<button class="photo" type="button" data-photo="' + i + '" aria-label="Open photo: ' + e(s.photoLabel) + '">' + photo + '</button>' +
        '<div class="body"><div class="numrow"><span class="badge-num">' + (i + 1) + '</span><span class="tick">' + I.check + '</span></div>' +
        '<div class="instr">' + e(s.text) + '</div>' +
        (s.caution ? '<div class="caution" role="note">' + I.warn + '<span>' + e(s.caution) + '</span></div>' : '') +
        '</div></div>';
    }).join('');
    function fact(cls, icon, lbl, val) { return '<div class="fact ' + cls + '"><div class="lbl">' + icon + lbl + '</div><div class="val">' + val + '</div></div>'; }
    K.app.innerHTML =
      '<div class="back"><button class="btn" type="button" id="backBtn">' + I.back + 'Back to jobs</button></div>' +
      '<div class="progress" id="prog" aria-live="polite"></div>' +
      '<div class="jobwrap"><aside class="jobside">' +
        '<div class="jobhead"><h1>Job ' + e(j.job) + '</h1><div class="sub">' + e(j.customer) + ', ' + e(j.description) + '</div>' +
        '<dl><div><dt>Pattern</dt><dd>' + e(j.pattern) + '</dd></div><div><dt>Alloy</dt><dd>' + e(j.alloy) + ' ' + e(j.grade) + '</dd></div><div><dt>Qty</dt><dd>' + e(j.qty) + '</dd></div></dl>' +
        '</div>' +
        '<div class="facts">' +
          fact('hot', I.temp, 'Pour temp', e(j.pourTempF) + ' F') +
          fact('', I.flask, 'Flask', e(j.flask)) +
          fact('', I.weight, 'Cope / drag', e(j.copeLb) + ' / ' + e(j.dragLb) + ' lb') +
          fact('code', I.pin, 'Pattern location', e(j.location)) +
        '</div></aside>' +
        '<div class="stepcol"><div class="steps' + (n > 8 ? ' many' : '') + '" id="steps">' + cards + '</div>' +
        '<button class="btn reset" type="button" id="resetBtn">Reset steps</button></div></div>';

    var box = document.getElementById('steps'), prog = document.getElementById('prog');
    function count() { var c = 0; for (var k in done) if (done[k]) c++; prog.textContent = c + ' of ' + n + ' done'; }
    function toggle(card) {
      var i = card.getAttribute('data-i'); done[i] = !done[i];
      card.classList.toggle('done', done[i]); card.setAttribute('aria-checked', done[i]);
      save(j.job, done); count();
    }
    count();
    document.getElementById('backBtn').addEventListener('click', function (ev) { ev.preventDefault(); K.home(); });
    box.addEventListener('click', function (ev) {
      ev.preventDefault();
      var p = ev.target.closest('[data-photo]');
      if (p) { openPhoto(steps[+p.getAttribute('data-photo')]); return; }
      var c = ev.target.closest('.step'); if (c) toggle(c);
    });
    box.addEventListener('keydown', function (ev) {
      if ((ev.key === ' ' || ev.key === 'Enter') && ev.target.classList.contains('step')) { ev.preventDefault(); ev.stopPropagation(); toggle(ev.target); }
    });
    document.getElementById('resetBtn').addEventListener('click', function (ev) {
      ev.preventDefault(); done = {}; save(j.job, done);
      box.querySelectorAll('.step').forEach(function (c) { c.classList.remove('done'); c.setAttribute('aria-checked', 'false'); });
      count();
    });
  };
})(Kiosk);
