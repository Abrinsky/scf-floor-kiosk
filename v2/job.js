/* Job screen: header, key-facts tiles, numbered step cards. */
(function (K) {
  'use strict';
  K.renderJob = function (j) {
    var e = K.esc, I = K.icon;
    var steps = K.steps[j.pattern] || [];
    var n = steps.length;
    var cards = steps.map(function (s, i) {
      var photo = s.photo ? '<img src="' + e(s.photo) + '" alt="' + e(s.photoLabel) + '">' : I.camera + '<span>Photo: ' + e(s.photoLabel) + '</span>';
      var last = i === n - 1;
      return '<section class="step' + (i === 0 ? ' cur' : '') + '" data-i="' + i + '">' +
        '<div class="num">Step ' + (i + 1) + ' of ' + n + '</div>' +
        '<div class="photo">' + photo + '</div>' +
        '<div class="instr">' + e(s.text) + '</div>' +
        (s.caution ? '<div class="caution" role="note">' + I.warn + '<span>' + e(s.caution) + '</span></div>' : '') +
        '<div class="stepnav">' +
          (i > 0 ? '<button class="btn" type="button" data-go="' + (i - 1) + '">' + I.back + 'Previous</button>' : '<span></span>') +
          (last ? '<button class="btn primary" type="button" data-done>' + I.check + 'Done</button>'
                : '<button class="btn primary" type="button" data-go="' + (i + 1) + '">Next' + I.next + '</button>') +
        '</div></section>';
    }).join('');
    function fact(cls, icon, lbl, val) { return '<div class="fact ' + cls + '"><div class="lbl">' + icon + lbl + '</div><div class="val">' + val + '</div></div>'; }
    K.app.innerHTML =
      '<div class="back"><button class="btn" type="button" id="backBtn">' + I.back + 'Back to jobs</button></div>' +
      '<div class="jobhead"><h1>Job ' + e(j.job) + '</h1><div class="sub">' + e(j.customer) + ', ' + e(j.description) + '</div>' +
      '<dl><div><dt>Pattern</dt><dd>' + e(j.pattern) + '</dd></div><div><dt>Alloy</dt><dd>' + e(j.alloy) + ' ' + e(j.grade) + '</dd></div><div><dt>Qty</dt><dd>' + e(j.qty) + '</dd></div></dl></div>' +
      '<div class="facts">' +
        fact('hot', I.temp, 'Pour temp', e(j.pourTempF) + ' F') +
        fact('', I.flask, 'Flask', e(j.flask)) +
        fact('', I.weight, 'Cope / drag', e(j.copeLb) + ' / ' + e(j.dragLb) + ' lb') +
        fact('', I.pin, 'Pattern location', e(j.location)) +
      '</div>' +
      '<h2 class="vh" hidden>Steps</h2><div class="steps paged" id="steps">' + cards + '</div>' +
      '<div id="doneMsg"></div>';
    document.getElementById('backBtn').addEventListener('click', K.home);
    var box = document.getElementById('steps');
    box.addEventListener('click', function (ev) {
      var g = ev.target.closest('[data-go]');
      if (g) {
        var to = +g.getAttribute('data-go');
        box.querySelectorAll('.step').forEach(function (s) { s.classList.toggle('cur', +s.getAttribute('data-i') === to); });
        box.scrollIntoView({ block: 'start' }); window.scrollBy(0, -100);
      }
      if (ev.target.closest('[data-done]')) {
        document.getElementById('doneMsg').innerHTML = '<p class="done-msg">All steps done for job ' + e(j.job) + '. Scan the next ticket or go back to jobs.</p>';
        document.getElementById('doneMsg').scrollIntoView({ block: 'center' });
      }
    });
  };
})(Kiosk);
