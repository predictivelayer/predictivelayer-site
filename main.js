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

  /* ---------- copy email ---------- */
  var copy = document.querySelector('[data-copy]');
  if (copy) {
    copy.addEventListener('click', function () {
      var text = copy.getAttribute('data-copy');
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
      var subject = 'predictivelayer.io enquiry' + (get('company') ? ' — ' + get('company') : '');
      var body = [
        'Name: ' + get('name'),
        'Company: ' + get('company'),
        'Use case: ' + get('usecase'),
        '',
        get('message')
      ].join('\n');
      window.location.href =
        'mailto:zfu126@gmail.com?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- hero demo ----------
     One clock-driven loop. Every frame works out the scene from elapsed
     time, so background-tab throttling can never put a later beat ahead
     of an earlier one. */
  var demo = document.getElementById('demo');
  if (!demo) return;

  var pick = function (n) { return demo.querySelector('[data-el="' + n + '"]'); };
  var chips  = pick('chips');
  var bot1   = pick('bot1');
  var bot2   = pick('bot2');
  var result = pick('result');
  var steps  = ['s1', 's2', 's3', 's4'].map(pick);
  var rows   = Array.prototype.slice.call(demo.querySelectorAll('tbody tr'));

  var Q1 = 'We track 4,000 HVAC and plumbing companies. 84 of them sold in the last two years. Which of the rest are most likely to sell next?';
  var Q2 = 'Both count. Ignore anything under 20 staff.';

  var MS_CHAR = 15;

  var T_CHIPS = 300;
  var T_Q1    = 900;
  var E_Q1    = T_Q1 + Q1.length * MS_CHAR;
  var T_BOT1  = E_Q1 + 750;
  var T_Q2    = T_BOT1 + 2300;
  var E_Q2    = T_Q2 + Q2.length * MS_CHAR;
  var T_STEP  = E_Q2 + 550;
  var GAP     = 620;
  var T_RESULT = T_STEP + steps.length * GAP + 250;
  var ROW_GAP  = 110;
  var T_BOT2   = T_RESULT + rows.length * ROW_GAP + 550;
  var T_LOOP   = T_BOT2 + 7000;

  var asks = [
    { msg: pick('ask1'), span: pick('typed1'), cur: pick('cur1'), text: Q1, start: T_Q1, end: E_Q1 },
    { msg: pick('ask2'), span: pick('typed2'), cur: pick('cur2'), text: Q2, start: T_Q2, end: E_Q2 }
  ];

  function set(el, cls, on) {
    if (el) el.classList[on ? 'add' : 'remove'](cls);
  }

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
    set(bot2, 'show', t >= T_BOT2);
  }

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) { frame(T_LOOP); return; }

  var origin = null;
  function tick(now) {
    if (origin === null) origin = now;
    var t = now - origin;
    if (t >= T_LOOP) { origin = now; t = 0; }
    frame(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
