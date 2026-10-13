/* Home: job cards, scan ticket button, search by job number. */
(function (K) {
  'use strict';
  function chipClass(s) { s = (s || '').toLowerCase(); return s === 'poured' ? 'done' : s === 'need cores' ? 'hazard' : s === 'pouring' ? 'info' : 'neutral'; }
  K.renderHome = function () {
    var e = K.esc, I = K.icon;
    var cards = K.jobs.map(function (j) {
      return '<button class="card" type="button" data-job="' + e(j.job) + '">' +
        '<span class="thumb">' + I.part + '</span>' +
        '<span class="info"><span class="jobno">Job ' + e(j.job) + '</span>' +
        '<span class="cust">' + e(j.customer) + '</span>' +
        '<span class="meta">Pattern ' + e(j.pattern) + ', pour ' + e(j.pourWindow) + '</span>' +
        '<span class="chip ' + chipClass(j.status) + '">' + e(j.status) + '</span></span></button>';
    }).join('');
    K.app.innerHTML =
      '<div class="homebar"><h1>Jobs on the floor today</h1>' +
      '<button class="btn primary" type="button" id="scanBtn">' + I.scan + 'Scan ticket</button>' +
      '<form class="search" id="searchForm" role="search"><label for="q" class="vh" hidden>Job number</label>' +
      '<input id="q" inputmode="numeric" autocomplete="off" placeholder="Job number" aria-label="Job number">' +
      '<button class="btn" type="submit">' + I.search + 'Find</button></form></div>' +
      '<p class="hint" id="hint">Tap a job, scan the ticket, or type the job number.</p>' +
      '<div class="grid">' + cards + '</div>';
    K.app.querySelector('.grid').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-job]'); if (b) K.open(b.getAttribute('data-job'));
    });
    document.getElementById('searchForm').addEventListener('submit', function (ev) {
      ev.preventDefault(); K.open(document.getElementById('q').value);
    });
    document.getElementById('scanBtn').addEventListener('click', function () {
      this.blur();
      var h = document.getElementById('hint');
      h.textContent = 'Ready. Hold the ticket under the scanner now.';
      h.style.color = 'var(--blue)';
    });
  };
})(Kiosk);
