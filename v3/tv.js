/* TV: line by station grid, idle lines collapse, spotlight with countdown. */
(function (S) {
  'use strict';
  var e = S.esc, tv = document.getElementById('tv');
  S.fit(document.getElementById('stage'), 1920, 1080);
  S.load();
  var q = new URLSearchParams(location.search);
  if (q.get('spot')) { S.state.spotlight = { station: q.get('spot'), line: q.get('line') || 'L1', until: Date.now() + 30000 }; S.save(); }

  function stepsFor(job, st) { return (S.state.steps[job.pattern] || []).filter(function (s) { return s.station === st; }); }
  function tvStep(list) { for (var i = 0; i < list.length; i++) if (list[i].tv) return list[i]; return list[0]; }
  function activeLines() { return S.lines.filter(function (l) { return S.state.assign[l.id]; }); }

  function renderGrid() {
    var act = activeLines(), shown = act;
    if (act.length >= 4) shown = act.filter(function (l) { return S.state.pinned.indexOf(l.id) >= 0; }).slice(0, 3);
    var hidden = S.lines.filter(function (l) { return shown.indexOf(l) < 0; });
    if (!shown.length) { tv.innerHTML = '<div class="empty">No lines running</div>'; return; }
    var rows = shown.map(function (l) {
      var j = S.job(S.state.assign[l.id]);
      var cells = S.stations.map(function (st) {
        var s = tvStep(stepsFor(j, st.id));
        if (!s) return '<div class="cell"></div>';
        var cau = stepsFor(j, st.id).filter(function (x) { return x.caution; })[0];
        return '<div class="cell">' + S.photo(s) + '<div class="txt"><div class="chk">' + e(s.short) + '</div>' +
          (cau ? '<div class="flag">' + S.icon.warn + '<span>' + e(cau.caution) + '</span></div>' : '') + '</div></div>';
      }).join('');
      return '<div class="row"><div class="linecell"><div class="lname">' + e(l.name) + '</div><div class="tag">Job ' + e(j.job) + '</div>' +
        '<div class="meta">' + e(j.pattern) + '<br>' + e(j.alloy) + '<br>Qty ' + e(j.qty) + '</div></div>' + cells + '</div>';
    }).join('');
    tv.innerHTML = '<div class="colhead"><div>Line</div>' + S.stations.map(function (s) { return '<div>' + e(s.name) + '</div>'; }).join('') + '</div>' +
      '<div class="grid r' + shown.length + '" style="grid-template-rows:repeat(' + shown.length + ',1fr)">' + rows + '</div>' +
      (hidden.length ? '<div class="idle">' + hidden.map(function (l) { return '<span>' + e(l.name) + (S.state.assign[l.id] ? ': running, not pinned' : ': idle') + '</span>'; }).join('') + '</div>' : '');
  }

  function renderSpot(sp) {
    var st = S.stations.filter(function (x) { return x.id === sp.station; })[0];
    var line = S.lines.filter(function (x) { return x.id === sp.line; })[0] || S.lines[0];
    var j = S.job(S.state.assign[line.id]) || S.job(S.state.assign[activeLines()[0] && activeLines()[0].id]);
    if (!st || !j) { S.state.spotlight = null; return renderGrid(); }
    var list = stepsFor(j, st.id), main = tvStep(list) || {};
    tv.innerHTML = '<div class="spot"><div>' + S.photo(main) + '</div><div><h1>Spotlight: ' + e(st.name) + '</h1>' +
      '<div class="tag">' + e(line.name) + ', job ' + e(j.job) + ', ' + e(j.pattern) + '</div><ol>' +
      list.map(function (s) { return '<li><div>' + e(s.text) + (s.caution ? '<div class="flag">' + S.icon.warn + '<span>' + e(s.caution) + '</span></div>' : '') + '</div></li>'; }).join('') +
      '</ol><div class="count"><span id="cd"></span><div class="bar"><i id="cdbar"></i></div></div></div></div>';
    tick();
  }
  function tick() {
    var sp = S.state.spotlight; if (!sp) return;
    var left = Math.max(0, Math.ceil((sp.until - Date.now()) / 1000));
    var cd = document.getElementById('cd');
    if (cd) { cd.textContent = 'Back to grid in ' + left + ' s'; document.getElementById('cdbar').style.width = (left / 30 * 100) + '%'; }
  }
  function render() {
    var sp = S.state.spotlight;
    if (sp && sp.until > Date.now()) renderSpot(sp); else renderGrid();
  }
  setInterval(function () {
    var d = new Date(); document.getElementById('clock').textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    var sp = S.state.spotlight;
    if (sp) { if (sp.until <= Date.now()) { S.state.spotlight = null; S.save(); render(); } else tick(); }
  }, 1000);
  S.onChange(render);
  render();
})(SCF);
