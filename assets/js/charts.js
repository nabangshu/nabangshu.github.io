/* Small SVG chart helpers for blog posts: line charts and bar charts drawn at the
   container's real width (so text stays readable on phones), themed with CSS
   variables, with hover tooltips and a "Show data" table for accessibility.

   Usage in a post:
     <figure class="chart" data-chart="/assets/data/x.json" data-key="hourly"></figure>
   where the JSON at data-chart holds { "<key>": spec }.

   spec (line):  { type:"line", title, x:[labels], xTicks:[indices], yLabel, unit,
                   series:[{name, values, tone:"accent"|"muted"}], note }
   spec (bar):   { type:"bar", horizontal:bool, title, labels:[], values:[], unit,
                   highlight:[indices], valueLabels:bool, yLabel, note }
*/
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function niceStep(v) {
    var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }
  // returns {max, ticks} with round tick values and at most ~5 gridlines
  function niceAxis(v) {
    var step = niceStep(v / 4), n = Math.ceil(v / step);
    return { max: step * n, ticks: n };
  }
  function fmt(v, unit) {
    var s = Math.abs(v) >= 100 ? Math.round(v) : Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1);
    return s + (unit ? ' ' + unit : '');
  }

  function tooltip(fig) {
    var t = document.createElement('div');
    t.className = 'chart-tip'; t.hidden = true;
    fig.appendChild(t);
    return {
      show: function (html, x, y) {
        t.innerHTML = html; t.hidden = false;
        var w = fig.clientWidth, tw = t.offsetWidth;
        t.style.left = Math.max(0, Math.min(w - tw, x - tw / 2)) + 'px';
        t.style.top = (y - t.offsetHeight - 10) + 'px';
      },
      hide: function () { t.hidden = true; }
    };
  }

  function table(fig, head, rows) {
    var d = document.createElement('details'); d.className = 'chart-table';
    var s = document.createElement('summary'); s.textContent = 'Show data'; d.appendChild(s);
    var tb = '<table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
    d.insertAdjacentHTML('beforeend', tb);
    fig.appendChild(d);
  }

  function frame(fig, spec, H) {
    fig.querySelectorAll('svg, .chart-tip, .chart-legend').forEach(function (n) { n.remove(); });
    var W = fig.querySelector('.chart-body').clientWidth;
    var svg = el('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': spec.title || '' });
    fig.querySelector('.chart-body').appendChild(svg);
    return { svg: svg, W: W, H: H };
  }

  function yAxis(svg, m, W, H, ymax, unit, ticks) {
    for (var i = 0; i <= ticks; i++) {
      var v = ymax * i / ticks, y = H - m.b - (H - m.t - m.b) * i / ticks;
      el('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, class: i ? 'grid' : 'axis' }, svg);
      var t = el('text', { x: m.l - 8, y: y + 4, 'text-anchor': 'end', class: 'tick' }, svg);
      t.textContent = (Math.round(v * 10) / 10).toString();
    }
  }

  function line(fig, spec) {
    var narrow = fig.clientWidth < 520;
    var H = narrow ? 260 : 300, f = frame(fig, spec, H), svg = f.svg, W = f.W;
    var m = { t: 16, r: 16, b: 34, l: 40 };
    var n = spec.x.length, all = [];
    spec.series.forEach(function (s) { all = all.concat(s.values); });
    var ax = niceAxis(Math.max.apply(null, all) * 1.02), ymax = ax.max;
    var X = function (i) { return m.l + (W - m.l - m.r) * i / (n - 1); };
    var Y = function (v) { return H - m.b - (H - m.t - m.b) * v / ymax; };
    yAxis(svg, m, W, H, ymax, spec.unit, ax.ticks);
    (spec.xTicks || []).forEach(function (i) {
      var t = el('text', { x: X(i), y: H - m.b + 20, 'text-anchor': 'middle', class: 'tick' }, svg);
      t.textContent = spec.x[i];
    });
    // draw muted series first so the accent sits on top
    var order = spec.series.slice().sort(function (a, b) { return (a.tone === 'accent') - (b.tone === 'accent'); });
    order.forEach(function (s) {
      var d = s.values.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1); }).join('');
      if (s.tone === 'accent') {
        el('path', { d: d + 'L' + X(n - 1) + ',' + Y(0) + 'L' + X(0) + ',' + Y(0) + 'Z', class: 'area' }, svg);
      }
      el('path', { d: d, class: 'line ' + (s.tone || 'muted') }, svg);
    });
    // legend (always, since >= 2 series)
    var lg = document.createElement('div'); lg.className = 'chart-legend';
    lg.innerHTML = spec.series.map(function (s) {
      return '<span><i class="sw ' + (s.tone || 'muted') + '"></i>' + s.name + '</span>';
    }).join('');
    fig.insertBefore(lg, fig.querySelector('.chart-body'));
    // hover
    var tip = tooltip(fig), cross = el('line', { y1: m.t, y2: H - m.b, class: 'cross', visibility: 'hidden' }, svg);
    var dots = spec.series.map(function (s) { return el('circle', { r: 4.5, class: 'dot ' + (s.tone || 'muted'), visibility: 'hidden' }, svg); });
    var hit = el('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' }, svg);
    function move(ev) {
      var r = svg.getBoundingClientRect(), px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      var i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / (W - m.l - m.r) * (n - 1))));
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
      spec.series.forEach(function (s, k) {
        dots[k].setAttribute('cx', X(i)); dots[k].setAttribute('cy', Y(s.values[i])); dots[k].setAttribute('visibility', 'visible');
      });
      tip.show('<strong>' + (spec.xFull ? spec.xFull[i] : spec.x[i]) + '</strong>' + spec.series.map(function (s) {
        return '<span><i class="sw ' + (s.tone || 'muted') + '"></i>' + s.name + ': ' + fmt(s.values[i], spec.unit) + '</span>';
      }).join(''), X(i), Math.min.apply(null, spec.series.map(function (s) { return Y(s.values[i]); })));
    }
    function leave() { tip.hide(); cross.setAttribute('visibility', 'hidden'); dots.forEach(function (d) { d.setAttribute('visibility', 'hidden'); }); }
    hit.addEventListener('mousemove', move); hit.addEventListener('touchstart', move, { passive: true });
    hit.addEventListener('touchmove', move, { passive: true }); hit.addEventListener('mouseleave', leave);
    return [[spec.xName || ''].concat(spec.series.map(function (s) { return s.name + (spec.unit ? ' (' + spec.unit + ')' : ''); })),
      spec.x.map(function (x, i) { return [spec.xFull ? spec.xFull[i] : x].concat(spec.series.map(function (s) { return fmt(s.values[i], ''); })); })];
  }

  function bar(fig, spec) {
    var n = spec.labels.length, hz = !!spec.horizontal, narrow = fig.clientWidth < 520;
    var band = hz ? 40 : 0;
    var H = hz ? n * band + 24 : (narrow ? 240 : 280);
    var f = frame(fig, spec, H), svg = f.svg, W = f.W;
    var ax = niceAxis(Math.max.apply(null, spec.values) * (spec.valueLabels ? 1.15 : 1.02)), ymax = ax.max;
    var tip = tooltip(fig), hl = spec.highlight || [];
    var tipFor = function (i) { return '<strong>' + (spec.full ? spec.full[i] : spec.labels[i]) + '</strong><span>' + fmt(spec.values[i], spec.unit) + '</span>' + (spec.extra ? '<span class="sub">' + spec.extra[i] + '</span>' : ''); };
    if (hz) {
      var lw = narrow ? 118 : 190, m = { t: 4, r: 56, b: 20, l: lw };
      var Xs = function (v) { return (W - m.l - m.r) * v / ymax; };
      el('line', { x1: m.l, x2: m.l, y1: m.t, y2: H - m.b, class: 'axis' }, svg);
      spec.labels.forEach(function (lab, i) {
        var y = m.t + i * band, bh = 22, by = y + (band - bh) / 2, w = Math.max(Xs(spec.values[i]), 2);
        var t = el('text', { x: m.l - 10, y: by + bh / 2 + 4, 'text-anchor': 'end', class: 'cat' + (hl.indexOf(i) >= 0 ? ' strong' : '') }, svg);
        t.textContent = lab;
        el('path', { d: 'M' + m.l + ',' + by + 'h' + (w - 4) + 'a4,4 0 0 1 4,4v' + (bh - 8) + 'a4,4 0 0 1 -4,4h' + (-(w - 4)) + 'Z', class: 'bar ' + (hl.indexOf(i) >= 0 ? 'accent' : 'muted') }, svg);
        if (spec.valueLabels) { var v = el('text', { x: m.l + w + 6, y: by + bh / 2 + 4, class: 'val' }, svg); v.textContent = fmt(spec.values[i], ''); }
        var hit = el('rect', { x: 0, y: y, width: W, height: band, fill: 'transparent' }, svg);
        hit.addEventListener('mousemove', function () { tip.show(tipFor(i), m.l + w / 2, y + 4); });
        hit.addEventListener('mouseleave', tip.hide);
      });
    } else {
      var m2 = { t: 16, r: 8, b: 34, l: 40 };
      var slot = (W - m2.l - m2.r) / n, bw = Math.min(24, slot - 4);
      var Y = function (v) { return H - m2.b - (H - m2.t - m2.b) * v / ymax; };
      yAxis(svg, m2, W, H, ymax, spec.unit, ax.ticks);
      spec.labels.forEach(function (lab, i) {
        var cx = m2.l + slot * (i + .5), y = Y(spec.values[i]), h = H - m2.b - y, x = cx - bw / 2;
        el('path', { d: 'M' + x + ',' + (H - m2.b) + 'v' + (-(h - 4)) + 'a4,4 0 0 1 4,-4h' + (bw - 8) + 'a4,4 0 0 1 4,4v' + (h - 4) + 'Z', class: 'bar ' + (hl.indexOf(i) >= 0 ? 'accent' : (spec.allAccent ? 'accent' : 'muted')) }, svg);
        if (!narrow || i % 2 === 0) { var t = el('text', { x: cx, y: H - m2.b + 20, 'text-anchor': 'middle', class: 'tick' }, svg); t.textContent = lab; }
        var hit = el('rect', { x: cx - slot / 2, y: m2.t, width: slot, height: H - m2.t - m2.b, fill: 'transparent' }, svg);
        hit.addEventListener('mousemove', function () { tip.show(tipFor(i), cx, y); });
        hit.addEventListener('mouseleave', tip.hide);
      });
    }
    return [['', spec.unit || 'value'], spec.labels.map(function (l, i) { return [spec.full ? spec.full[i] : l, fmt(spec.values[i], '')]; })];
  }

  function render(fig, spec) {
    var tb = spec.type === 'line' ? line(fig, spec) : bar(fig, spec);
    if (!fig.querySelector('.chart-table')) table(fig, tb[0], tb[1]);
  }

  var cache = {};
  document.querySelectorAll('figure.chart[data-chart]').forEach(function (fig) {
    var url = fig.dataset.chart;
    cache[url] = cache[url] || fetch(url).then(function (r) { return r.json(); });
    cache[url].then(function (data) {
      var spec = data[fig.dataset.key];
      if (!spec) return;
      fig.insertAdjacentHTML('afterbegin',
        (spec.title ? '<figcaption class="chart-title">' + spec.title + '</figcaption>' : '') +
        (spec.subtitle ? '<p class="chart-sub">' + spec.subtitle + '</p>' : '') + '<div class="chart-body"></div>');
      if (spec.note) fig.insertAdjacentHTML('beforeend', '<p class="chart-note">' + spec.note + '</p>');
      render(fig, spec);
      var last = fig.clientWidth;
      window.addEventListener('resize', function () {
        if (Math.abs(fig.clientWidth - last) > 4) { last = fig.clientWidth; render(fig, spec); }
      });
    });
  });
})();
