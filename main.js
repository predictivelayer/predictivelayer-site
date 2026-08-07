// predictivelayer.io — small bits of interactivity. No trackers, no network calls.

(function () {

  /* ---------- locale ----------
     One shared script for every page in both en/ and zh/. The <html lang>
     attribute is the only signal we need: "zh-CN" on every page under zh/,
     "en" everywhere else. */
  var ZH = /^zh/i.test(document.documentElement.lang || '');

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
  var SUBJECT = ZH ? '普微智能咨询' : 'Predictive Layer enquiry';

  Array.prototype.forEach.call(document.querySelectorAll('[data-mail-open]'), function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'mailto:' + MAIL + '?subject=' +
        encodeURIComponent(SUBJECT);
    });
  });

  function copyText(btn, text) {
    var old = btn.textContent;
    var done = function () {
      btn.textContent = ZH ? '已复制' : 'Copied';
      setTimeout(function () { btn.textContent = old; }, 1600);
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
  }

  var copy = document.querySelector('[data-mail-copy]');
  if (copy) {
    copy.addEventListener('click', function () { copyText(copy, MAIL); });
  }

  /* ---------- contact form -> pre-filled mailto (no backend) ---------- */
  var lastMessage = '';
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (n) {
        var f = form.elements[n];
        return f ? f.value.trim() : '';
      };
      var subject = SUBJECT + (get('company') ? (ZH ? '，' : ', ') + get('company') : '');
      var body = ZH ? [
        '姓名：' + get('name'),
        '公司：' + get('company'),
        '想预测什么：' + get('usecase'),
        '',
        get('message')
      ].join('\n') : [
        'Name: ' + get('name'),
        'Company: ' + get('company'),
        'Use case: ' + get('usecase'),
        '',
        get('message')
      ].join('\n');
      // A mailto: link does nothing at all on a machine with no mail app
      // registered, which is most browsers on a fresh laptop and every
      // browser where webmail was never made the handler. So show the same
      // message in a panel first, with a webmail link and a copy button,
      // and only then try the mail app. Whichever works, the person has a
      // way to send it.
      var panel = document.querySelector('#mail-fallback');
      if (panel) {
        var gmail = panel.querySelector('[data-mail-gmail]');
        if (gmail) {
          gmail.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
            encodeURIComponent(MAIL) + '&su=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
        }
        Array.prototype.forEach.call(panel.querySelectorAll('[data-mail-address]'), function (el) {
          el.textContent = MAIL;
        });
        // Read through the variable at click time, not at wiring time, so
        // editing a field and submitting again copies the new text.
        lastMessage = MAIL + '\n' + subject + '\n\n' + body;
        var cm = panel.querySelector('[data-mail-copy-message]');
        if (cm && !cm.dataset.wired) {
          cm.dataset.wired = '1';
          cm.addEventListener('click', function () { copyText(cm, lastMessage); });
        }
        panel.hidden = false;
      }

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
  var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-scene]'));
  if (!scenes.length) return;

  // Typing speed. The whole timeline is derived from character counts, and a
  // Chinese line carries the same meaning in roughly a third of the characters,
  // so the same value would race through the Chinese demo. Slow it to match.
  var MS_CHAR  = ZH ? 45 : 15;
  var STEP_GAP = 620;   // between one tick and the next
  var ROW_GAP  = 110;   // between one table row and the next
  var ROLL     = 900;   // how long a scored cell spends settling

  function set(el, cls, on) {
    if (el) el.classList[on ? 'add' : 'remove'](cls);
  }

  // Deterministic stand-in for randomness, so the same frame always draws
  // the same scramble and the reduced-motion path is reproducible.
  function noise(n) {
    var x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  /* Everything a single scene needs to draw itself at time t.

     The timeline is read out of the DOM in document order rather than
     hard-coded, so a scene can have two turns of conversation or five and
     nothing here has to change. Add a message to the HTML and it gets a
     beat. */
  function build(scene) {
    var body = scene.querySelector('.demo-body');
    var items = [];
    var cells = [];
    var wordsByCol = {};
    var t = 0;
    var seed = 0;

    Array.prototype.slice.call(body.children).forEach(function (el) {
      if (el.classList.contains('chips')) {
        t += 300;
        items.push({ kind: 'show', el: el, at: t });
        t += 620;

      } else if (el.classList.contains('msg-user')) {
        var text = el.getAttribute('data-q') || '';
        items.push({
          kind: 'type', el: el, at: t,
          span: el.querySelector('[data-typed]'),
          cur:  el.querySelector('.cursor'),
          text: text, end: t + text.length * MS_CHAR
        });
        t += text.length * MS_CHAR + 700;

      } else if (el.classList.contains('msg-bot')) {
        items.push({ kind: 'show', el: el, at: t });
        // Long answers hold longer, so a wall of text is not replaced before
        // anyone could have read it.
        t += 1000 + Math.min(3600, el.textContent.trim().length * 12);

      } else if (el.classList.contains('steps')) {
        t += 200;
        var steps = Array.prototype.slice.call(el.querySelectorAll('.step'));
        steps.forEach(function (st, i) { items.push({ kind: 'step', el: st, at: t + i * STEP_GAP }); });
        t += steps.length * STEP_GAP + 200;

      } else if (el.classList.contains('result')) {
        t += 200;
        var at = t;
        items.push({ kind: 'show', el: el, at: at });
        var rows = Array.prototype.slice.call(el.querySelectorAll('tbody tr'));
        rows.forEach(function (r, ri) {
          items.push({ kind: 'row', el: r, at: at + ri * ROW_GAP });
          Array.prototype.slice.call(r.querySelectorAll('td.col-new')).forEach(function (td, ci) {
            var final = td.textContent.trim();
            var num = /^-?\d*\.?\d+$/.test(final) ? parseFloat(final) : null;
            cells.push({
              el: td, at: at + ri * ROW_GAP, final: final, num: num, col: ci,
              dp: (final.split('.')[1] || '').length,
              seed: (seed += 13)
            });
            // A text column only flickers through its own values, so the
            // scramble shows things that could really have come back.
            if (num === null) {
              if (!wordsByCol[ci]) wordsByCol[ci] = [];
              if (wordsByCol[ci].indexOf(final) === -1) wordsByCol[ci].push(final);
            }
          });
        });
        t += rows.length * ROW_GAP + ROLL + 500;

      } else {
        items.push({ kind: 'show', el: el, at: t });
        t += 400;
      }
    });

    var END = t + 500;

    function frame(now) {
      items.forEach(function (it) {
        if (it.kind === 'type') {
          set(it.el, 'show', now >= it.at);
          var n = now < it.at ? 0
                : Math.min(it.text.length, Math.floor((now - it.at) / MS_CHAR));
          var want = it.text.slice(0, n);
          if (it.span && it.span.textContent !== want) it.span.textContent = want;
          if (it.cur) it.cur.style.visibility =
            (now >= it.at && now < it.end) ? 'visible' : 'hidden';
        } else if (it.kind === 'step') {
          set(it.el, 'show', now >= it.at);
          set(it.el, 'done', now >= it.at + 380);
        } else if (it.kind === 'row') {
          set(it.el, 'in', now >= it.at);
        } else {
          set(it.el, 'show', now >= it.at);
        }
      });

      cells.forEach(function (c) {
        var p = now - c.at;
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
            // its answer instead of jumping to it. Jitter scales with the
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
    }

    return { frame: frame, end: END };
  }

  var built = [];
  function engine(i) {
    if (!built[i]) built[i] = build(scenes[i]);
    return built[i];
  }

  /* ---------- which card is centred ----------
     The browser does the scrolling. We only watch it, so a trackpad swipe,
     a touch drag and the arrow buttons all end up in the same place. */

  var rail  = document.getElementById('carousel');
  var pips  = document.getElementById('demo-pips');
  var label = document.getElementById('demo-label');
  var prev  = document.querySelector('[data-demo-prev]');
  var next  = document.querySelector('[data-demo-next]');

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var idx = 0;
  var origin = null;
  var played = [];   // each example animates the first time you land on it

  if (pips) {
    scenes.forEach(function (sc, i) {
      var b = document.createElement('button');
      b.className = 'pip';
      b.type = 'button';
      b.setAttribute('aria-label', sc.getAttribute('data-label') || ('Example ' + (i + 1)));
      b.addEventListener('click', function () { scrollTo(i); });
      pips.appendChild(b);
    });
  }

  // Wraps rather than stops. Past the last card you land on the first, and
  // left from the first takes you to the last, so the arrows rotate.
  function scrollTo(i) {
    i = (i + scenes.length) % scenes.length;
    var card = scenes[i];
    if (!rail) return;
    rail.scrollTo({
      left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2,
      behavior: reduced ? 'auto' : 'smooth'
    });
  }

  // Whichever card's centre is nearest the rail's centre is the live one.
  function nearest() {
    if (!rail) return 0;
    var mid = rail.scrollLeft + rail.clientWidth / 2;
    var best = 0, bestD = Infinity;
    scenes.forEach(function (c, i) {
      var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function paint() {
    scenes.forEach(function (c, i) {
      c.classList.toggle('aside', i !== idx);
      c.classList.toggle('left',  i < idx);
      c.classList.toggle('right', i > idx);
    });
    if (pips) {
      Array.prototype.slice.call(pips.children).forEach(function (b, i) {
        b.classList.toggle('on', i === idx);
      });
    }
    if (label) {
      label.textContent = (idx + 1) + (ZH ? ' / ' : ' of ') + scenes.length +
                          '  ·  ' + (scenes[idx].getAttribute('data-label') || '');
    }
  }

  function activate(i) {
    if (i === idx) return;
    idx = i;
    paint();
    // A card that has not run yet starts from the top the moment it lands
    // in the middle. One that has already run keeps its finished state.
    if (!played[idx] && !reduced) origin = null;
  }

  if (rail) {
    var pending = null;
    rail.addEventListener('scroll', function () {
      if (pending) return;
      pending = requestAnimationFrame(function () {
        pending = null;
        activate(nearest());
      });
    }, { passive: true });
  }

  if (prev) prev.addEventListener('click', function () { scrollTo(idx - 1); });
  if (next) next.addEventListener('click', function () { scrollTo(idx + 1); });

  // Every card starts on its last frame, so the two lurking at the edges
  // look like finished work rather than empty panels.
  scenes.forEach(function (sc, i) {
    var e = engine(i);
    e.frame(e.end);
    played[i] = true;
  });
  played[0] = false;   // except the one you land on, which plays itself in
  paint();

  if (reduced) return;

  /* Each example runs once and stops on its last frame. It does not loop:
     thirty seconds of motion replaying beside the text you are reading is a
     distraction, not a demo. */
  function tick(now) {
    if (!played[idx]) {
      var e = engine(idx);
      if (origin === null) origin = now;
      var t = now - origin;
      if (t >= e.end) { e.frame(e.end); played[idx] = true; }
      else e.frame(t);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
