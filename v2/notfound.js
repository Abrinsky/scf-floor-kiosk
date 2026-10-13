/* Not-found state for an unknown job number. */
(function (K) {
  'use strict';
  K.renderNotFound = function (no) {
    var e = K.esc, I = K.icon;
    K.app.innerHTML = '<div class="nf"><div class="caution">' + I.warn + '<span class="msg">We couldn\'t find job ' + e(no) + '. Check the ticket or ask your lead.</span></div>' +
      '<div class="row"><button class="btn primary" type="button" id="retry">' + I.scan + 'Try again</button>' +
      '<button class="btn" type="button" id="browse">' + I.back + 'Browse jobs</button></div></div>';
    document.getElementById('browse').addEventListener('click', K.home);
    document.getElementById('retry').addEventListener('click', function () { K.home(); setTimeout(function () { var q = document.getElementById('q'); if (q) q.focus(); }, 0); });
  };
})(Kiosk);
