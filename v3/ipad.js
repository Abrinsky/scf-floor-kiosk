/* iPad controller: assign jobs to lines, pin lines, edit steps, start spotlight. */
(function (S) {
  'use strict';
  var e = S.esc, I = S.icon, pad = document.getElementById('pad');
  S.fit(document.getElementById('stage'), 1024, 1366);
  S.load();
  var q = new URLSearchParams(location.search);
  var ui = { tab: q.get('tab') || 'lines', job: null, pattern: q.get('pattern') || S.jobs[0].pattern, spotLine: 'L1' };

  function toast(m) { var t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 1800); }
  function lineName(id) { return S.lines.filter(function (l) { return l.id === id; })[0].name; }

  var views = {
    lines: function () {
      var a = S.state.assign;
      return '<h2>1. Tap a job</h2><div class="list two">' + S.jobs.map(function (j) {
        return '<button class="btn pick' + (ui.job === j.job ? ' sel' : '') + '" type="button" data-job="' + j.job + '">Job ' + j.job + ' <small>' + e(j.customer) + ', ' + e(j.pattern) + '</small></button>';
      }).join('') + '</div>' +
      '<h2>2. Tap a line to assign it</h2><p class="hint">' + (ui.job ? 'Assigning job ' + ui.job + '.' : 'Pick a job first.') + '</p><div class="list">' + S.lines.map(function (l) {
        var j = S.job(a[l.id]);
        return '<div class="line"><button class="btn pick" type="button" data-line="' + l.id + '">' + e(l.name) + ' <small>' + (j ? 'Job ' + j.job + ', ' + e(j.pattern) : 'Idle') + '</small></button>' +
          '<button class="btn" type="button" data-clear="' + l.id + '">Set idle</button></div>';
      }).join('') + '</div>' +
      '<div class="row"><button class="btn" type="button" id="undo"' + (S.state.undo.length ? '' : ' disabled') + '>' + I.undo + 'Undo</button></div>';
    },
    pins: function () {
      return '<h2>Pin up to 3 lines for the TV</h2><p class="hint">The TV shows every running line when 3 or fewer are running. With 4 running, it shows only the pinned ones.</p><div class="list">' +
        S.lines.map(function (l) {
          var on = S.state.pinned.indexOf(l.id) >= 0, j = S.job(S.state.assign[l.id]);
          return '<button class="btn pick' + (on ? ' sel' : '') + '" type="button" data-pin="' + l.id + '">' + (on ? I.pin + ' Pinned: ' : 'Not pinned: ') + e(l.name) + ' <small>' + (j ? 'Job ' + j.job : 'Idle') + '</small></button>';
        }).join('') + '</div>';
    },
    steps: function () {
      var list = S.state.steps[ui.pattern] || [];
      return '<h2>Step editor</h2><div class="row">' + S.jobs.map(function (j) {
        return '<button class="btn' + (j.pattern === ui.pattern ? ' on' : '') + '" type="button" data-pattern="' + e(j.pattern) + '">' + e(j.pattern) + '</button>';
      }).join('') + '</div>' + S.stations.map(function (st) {
        var group = list.filter(function (s) { return s.station === st.id; });
        return '<section class="group"><h3>' + e(st.name) + '</h3>' + (group.length ? group.map(function (s) {
          return '<div class="step" data-id="' + e(s.id) + '"><div class="ord"><button class="btn" type="button" data-move="-1" aria-label="Move up">' + I.up + '</button><button class="btn" type="button" data-move="1" aria-label="Move down">' + I.down + '</button></div>' +
            '<div><label>Step text<textarea data-f="text">' + e(s.text) + '</textarea></label><label>Short text (TV)<input type="text" data-f="short" value="' + e(s.short) + '"></label>' +
            '<label>Caution<input type="text" class="flagtxt" data-f="caution" value="' + e(s.caution) + '" placeholder="None"></label></div>' +
            '<div class="side">' + S.photo(s) + '<span class="btn file">' + I.camera + 'Take photo<input type="file" accept="image/*" capture="environment" data-photo></span>' +
            '<button class="btn toggle' + (s.tv ? ' on' : '') + '" type="button" data-tv>' + (s.tv ? 'TV check: on' : 'TV check: off') + '</button></div></div>';
        }).join('') : '<p class="hint">No steps at this station.</p>') + '</section>';
      }).join('');
    },
    spot: function () {
      var act = S.lines.filter(function (l) { return S.state.assign[l.id]; });
      if (act.every(function (l) { return l.id !== ui.spotLine; }) && act.length) ui.spotLine = act[0].id;
      var sp = S.state.spotlight && S.state.spotlight.until > Date.now() ? S.state.spotlight : null;
      return '<h2>Spotlight a station on the TV</h2><p class="hint">Shows one station full screen for 30 seconds, then the TV goes back to the grid.</p>' +
        '<h3>Line</h3><div class="row">' + act.map(function (l) { return '<button class="btn' + (l.id === ui.spotLine ? ' on' : '') + '" type="button" data-sline="' + l.id + '">' + e(l.name) + '</button>'; }).join('') + '</div>' +
        '<h3>Station</h3><div class="list two">' + S.stations.map(function (st) { return '<button class="btn primary pick" type="button" data-spot="' + st.id + '">' + I.spot + 'Spotlight ' + e(st.name) + '</button>'; }).join('') + '</div>' +
        (sp ? '<p class="hint">On the TV now: ' + e(sp.station) + ' on ' + e(lineName(sp.line)) + '.</p><div class="row"><button class="btn" type="button" id="endSpot">End spotlight</button></div>' : '');
    }
  };
  function render() {
    document.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === ui.tab); });
    var y = pad.scrollTop; pad.innerHTML = views[ui.tab](); pad.scrollTop = y;
  }
  function stepById(id) { return (S.state.steps[ui.pattern] || []).filter(function (s) { return s.id === id; })[0]; }

  document.getElementById('tabs').addEventListener('click', function (ev) { var b = ev.target.closest('[data-tab]'); if (b) { ui.tab = b.getAttribute('data-tab'); pad.scrollTop = 0; render(); } });
  pad.addEventListener('click', function (ev) {
    var t = ev.target.closest('button'); if (!t) return;
    var d = t.dataset, st = S.state;
    if (d.job) { ui.job = d.job; }
    else if (d.line) {
      if (!ui.job) { toast('Pick a job first'); return; }
      st.undo.push(JSON.stringify(st.assign)); st.undo = st.undo.slice(-10);
      for (var k in st.assign) if (st.assign[k] === ui.job) st.assign[k] = '';
      st.assign[d.line] = ui.job; toast('Job ' + ui.job + ' on ' + lineName(d.line)); ui.job = null; S.save();
    }
    else if (d.clear) { st.undo.push(JSON.stringify(st.assign)); st.assign[d.clear] = ''; S.save(); toast(lineName(d.clear) + ' set idle'); }
    else if (t.id === 'undo') { if (st.undo.length) { st.assign = JSON.parse(st.undo.pop()); S.save(); toast('Undone'); } }
    else if (d.pin) {
      var i = st.pinned.indexOf(d.pin);
      if (i >= 0) st.pinned.splice(i, 1); else if (st.pinned.length >= 3) { toast('Only 3 pins. Unpin one first.'); return; } else st.pinned.push(d.pin);
      S.save();
    }
    else if (d.pattern) { ui.pattern = d.pattern; pad.scrollTop = 0; }
    else if (d.move) {
      var id = t.closest('.step').getAttribute('data-id'), list = st.steps[ui.pattern], s = stepById(id);
      var same = list.filter(function (x) { return x.station === s.station; }), pos = same.indexOf(s), other = same[pos + (+d.move)];
      if (!other) return;
      var a = list.indexOf(s), b = list.indexOf(other); list[a] = other; list[b] = s; S.save();
    }
    else if (d.tv !== undefined) { var s2 = stepById(t.closest('.step').getAttribute('data-id')); s2.tv = !s2.tv; S.save(); }
    else if (d.sline) { ui.spotLine = d.sline; }
    else if (d.spot) { st.spotlight = { station: d.spot, line: ui.spotLine, until: Date.now() + 30000 }; S.save(); toast('Spotlight on the TV for 30 s'); }
    else if (t.id === 'endSpot') { st.spotlight = null; S.save(); }
    else return;
    render();
  });
  // Text fields save without re-rendering so focus stays put.
  pad.addEventListener('input', function (ev) {
    var f = ev.target.getAttribute('data-f'); if (!f) return;
    stepById(ev.target.closest('.step').getAttribute('data-id'))[f] = ev.target.value;
    clearTimeout(pad.t); pad.t = setTimeout(S.save, 300);
  });
  // Take photo: downscale to 480px wide JPEG on a canvas, store as data URL.
  pad.addEventListener('change', function (ev) {
    if (!ev.target.hasAttribute('data-photo') || !ev.target.files[0]) return;
    var s = stepById(ev.target.closest('.step').getAttribute('data-id')), img = new Image(), url = URL.createObjectURL(ev.target.files[0]);
    img.onload = function () {
      var w = 480, h = Math.round(img.height * w / img.width), c = document.createElement('canvas');
      c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h);
      s.photo = c.toDataURL('image/jpeg', 0.7); URL.revokeObjectURL(url); S.save(); render(); toast('Photo saved');
    };
    img.src = url;
  });
  S.onChange(render);
  render();
})(SCF);
