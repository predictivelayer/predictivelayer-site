// predictivelayer.io — small bits of interactivity. No trackers, no network calls.

(function () {

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- product dropdown ---------- */
  var item = document.querySelector('.nav-item');
  var trig = item && item.querySelector('.nav-trigger');
  if (item && trig) {
    var setOpen = function (on) {
      item.classList.toggle('open', on);
      trig.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    trig.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!item.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!item.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    item.addEventListener('mouseleave', function () { setOpen(false); });
  }

  /* ---------- email, assembled at run time ----------
     The address is never written into the HTML, so a scraper reading the
     page source finds nothing. The buttons still open a normal mail client. */
  var MAIL = ['zfu126', 'gmail.com'].join('@');

  Array.prototype.forEach.call(document.querySelectorAll('[data-mail-open]'), function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'mailto:' + MAIL + '?subject=' +
        encodeURIComponent('Predictive Layer enquiry');
    });
  });

  var copy = document.querySelector('[data-mail-copy]');
  if (copy) {
    copy.addEventListener('click', function () {
      var text = MAIL;
      var done = function () {
        var old = copy.textContent;
        copy.textContent = 'Copied';
        setTimeout(function () { copy.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(el);
        done();
      }
    });
  }

  /* ---------- contact form -> pre-filled mailto (no backend) ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (n) {
        var f = form.elements[n];
        return f ? f.value.trim() : '';
      };
      var subject = 'Predictive Layer enquiry' + (get('company') ? ', ' + get('company') : '');
      var body = [
        'Name: ' + get('name'),
        'Company: ' + get('company'),
        'Use case: ' + get('usecase'),
        '',
        get('message')
      ].join('\n');
      window.location.href =
        'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- hero demo ----------
     Three examples in one panel. Arrows switch between them. Each one is a
     clock-driven loop: every frame works out the whole scene from elapsed
     time, so background-tab throttling can never put a later beat ahead of
     an earlier one. */
  var demo = document.getElementById('demo');
  if (!demo) return;

  var scenes = Array.prototype.slice.call(demo.querySelectorAll('[data-scene]'));
  if (!scenes.length) return;

  var MS_CHAR = 15;
  var ROLL    = 900;    // how long a scored cell spends settling
  var HOLD    = 16000;  // how long the finished table sits before replaying

  function set(el, cls, on) {
    if (el) el.classList[on ? 'add' : 'remove'](cls);
  }

  // Deterministic stand-in for randomness, so the same frame always draws
  // the same scramble and the reduced-motion path is reproducible.
  function noise(n) {
    var x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  /* Everything a single scene needs to draw itself at time t. Built once per
     scene, lazily, and kept. */
  function build(scene) {
    var pick = function (n) { return scene.querySelector('[data-el="' + n + '"]'); };

    var chips  = pick('chips');
    var bot1   = pick('bot1');
    var bot2   = pick('bot2');
    var result = pick('result');
    var steps  = ['s1', 's2', 's3', 's4'].map(pick).filter(Boolean);
    var rows   = Array.prototype.slice.call(scene.querySelectorAll('tbody tr'));

    var Q1 = scene.getAttribute('data-q1') || '';
    var Q2 = scene.getAttribute('data-q2') || '';

    var T_CHIPS  = 300;
    var T_Q1     = 900;
    var E_Q1     = T_Q1 + Q1.length * MS_CHAR;
    var T_BOT1   = E_Q1 + 750;
    var T_Q2     = T_BOT1 + 2300;
    var E_Q2     = Q2 ? T_Q2 + Q2.length * MS_CHAR : T_BOT1;
    var T_STEP   = E_Q2 + 550;
    var GAP      = 620;
    var T_RESULT = T_STEP + steps.length * GAP + 250;
    var ROW_GAP  = 110;
    var T_BOT2   = T_RESULT + rows.length * ROW_GAP + ROLL + 550;
    var T_LOOP   = T_BOT2 + HOLD;

    /* The appended columns count themselves in before they settle. Values
       are read out of the HTML once, so the markup stays the source of
       truth and the animation is only ever presentation. */
    var cells = [];
    var wordsByCol = {};
    rows.forEach(function (r, ri) {
      Array.prototype.slice.call(r.querySelectorAll('td.col-new')).forEach(function (el, ci) {
        var final = el.textContent.trim();
        var num = /^-?\d*\.?\d+$/.test(final) ? parseFloat(final) : null;
        cells.push({
          el: el, row: ri, col: ci, final: final, num: num,
          dp: (final.split('.')[1] || '').length,
          seed: ri * 31 + ci * 7 + 3
        });
        // A text column only ever flickers through its own values, so the
        // scramble shows things that could really have come back.
        if (num === null) {
          if (!wordsByCol[ci]) wordsByCol[ci] = [];
          if (wordsByCol[ci].indexOf(final) === -1) wordsByCol[ci].push(final);
        }
      });
    });

    var asks = [
      { msg: pick('ask1'), span: pick('typed1'), cur: pick('cur1'), text: Q1, start: T_Q1, end: E_Q1 },
      { msg: pick('ask2'), span: pick('typed2'), cur: pick('cur2'), text: Q2, start: T_Q2, end: E_Q2 }
    ].filter(function (a) { return a.msg && a.span && a.text; });

    function frame(t) {
      set(chips, 'show', t >= T_CHIPS);

      asks.forEach(function (a) {
        set(a.msg, 'show', t >= a.start);
        var n = t < a.start ? 0 : Math.min(a.text.length, Math.floor((t - a.start) / MS_CHAR));
        var want = a.text.slice(0, n);
        if (a.span.textContent !== want) a.span.textContent = want;
        if (a.cur) a.cur.style.visibility = (t >= a.start && t < a.end) ? 'visible' : 'hidden';
      });

      set(bot1, 'show', t >= T_BOT1);

      steps.forEach(function (el, i) {
        var at = T_STEP + i * GAP;
        set(el, 'show', t >= at);
        set(el, 'done', t >= at + 380);
      });

      set(result, 'show', t >= T_RESULT);
      rows.forEach(function (r, i) { set(r, 'in', t >= T_RESULT + i * ROW_GAP); });

      cells.forEach(function (c) {
        var at = T_RESULT + c.row * ROW_GAP;
        var p = t - at;
        var txt, rolling;

        if (p < 0) {
          txt = ''; rolling = false;
        } else if (p >= ROLL) {
          txt = c.final; rolling = false;
        } else {
          rolling = true;
          var r = noise(Math.floor(p / 55) * 3.7 + c.seed);
          if (c.num === null) {
            var w = wordsByCol[c.col] || [c.final];
            txt = w[Math.floor(r * w.length) % w.length];
          } else {
            // The spread narrows towards zero, so the number closes in on
            // its answer instead of jumping to it. Jitter is scaled to the
            // value, so a 0.92 confidence and a 5.4x multiple both work.
            var left = 1 - p / ROLL;
            var mag = Math.max(Math.abs(c.num), 0.2);
            var v = c.num + (r - 0.5) * 1.5 * mag * left * left;
            var hi = c.num <= 1 ? 0.99 : c.num * 1.9;
            var lo = c.num <= 1 ? 0.01 : c.num * 0.3;
            txt = Math.min(hi, Math.max(lo, v)).toFixed(c.dp);
          }
        }

        if (c.el.textContent !== txt) c.el.textContent = txt;
        set(c.el, 'rolling', rolling);
      });

      set(bot2, 'show', t >= T_BOT2);
    }

    return { frame: frame, loop: T_LOOP, end: T_BOT2 + 400 };
  }

  var built = [];
  function engine(i) {
    if (!built[i]) built[i] = build(scenes[i]);
    return built[i];
  }

  /* ---------- switching between the three ---------- */

  var pips  = document.getElementById('demo-pips');
  var label = document.getElementById('demo-label');
  var idx = 0, origin = null;

  if (pips) {
    scenes.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'pip';
      b.type = 'button';
      b.setAttribute('aria-label', s.getAttribute('data-label') || ('Example ' + (i + 1)));
      b.addEventListener('click', function () { go(i); });
      pips.appendChild(b);
    });
  }

  function go(i) {
    idx = (i + scenes.length) % scenes.length;
    scenes.forEach(function (s, k) { s.hidden = k !== idx; });
    if (pips) {
      Array.prototype.slice.call(pips.children).forEach(function (b, k) {
        set(b, 'on', k === idx);
      });
    }
    if (label) {
      label.textContent = (idx + 1) + ' of ' + scenes.length + '  ·  ' +
                          (scenes[idx].getAttribute('data-label') || '');
    }
    origin = null;
    if (reduced) engine(idx).frame(engine(idx).end);
  }

  var prev = document.querySelector('[data-demo-prev]');
  var next = document.querySelector('[data-demo-next]');
  if (prev) prev.addEventListener('click', function () { go(idx - 1); });
  if (next) next.addEventListener('click', function () { go(idx + 1); });

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  go(0);
  if (reduced) return;

  // Loops, but the finished table holds for HOLD before it replays, so the
  // thing worth reading is on screen far longer than the build-up to it.
  function tick(now) {
    var e = engine(idx);
    if (origin === null) origin = now;
    var t = now - origin;
    if (t >= e.loop) { origin = now; t = 0; }
    e.frame(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
