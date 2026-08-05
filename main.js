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
     time, so background-tab throttling can never put the steps ahead of
     the question being typed. */
  var demo = document.getElementById('demo');
  if (!demo) return;

  var pick = function (n) { return demo.querySelector('[data-el="' + n + '"]'); };
  var chips  = pick('chips');
  var ask    = pick('ask');
  var typed  = pick('typed');
  var result = pick('result');
  var cursor = demo.querySelector('.cursor');
  var steps  = ['s1', 's2', 's3', 's4'].map(pick);
  var rows   = Array.prototype.slice.call(demo.querySelectorAll('tbody tr'));

  var LINE = 'Score my Q3 pipeline for fit. Use the closed accounts as examples.';

  var T_CHIPS  = 400;
  var T_ASK    = 1100;
  var MS_CHAR  = 22;
  var T_TYPED  = T_ASK + LINE.length * MS_CHAR;   // question finished
  var T_STEP   = T_TYPED + 350;                   // first step lands after it
  var STEP_GAP = 650;
  var T_RESULT = T_STEP + steps.length * STEP_GAP + 150;
  var ROW_GAP  = 120;
  var T_LOOP   = T_RESULT + rows.length * ROW_GAP + 6500;

  function set(el, cls, on) {
    if (el) el.classList[on ? 'add' : 'remove'](cls);
  }

  function frame(t) {
    set(chips, 'show', t >= T_CHIPS);
    set(ask,   'show', t >= T_ASK);

    var chars = t < T_ASK ? 0 : Math.min(LINE.length, Math.floor((t - T_ASK) / MS_CHAR));
    if (typed.textContent !== LINE.slice(0, chars)) typed.textContent = LINE.slice(0, chars);
    if (cursor) cursor.style.visibility = (t >= T_ASK && t < T_TYPED) ? 'visible' : 'hidden';

    steps.forEach(function (el, i) {
      var at = T_STEP + i * STEP_GAP;
      set(el, 'show', t >= at);
      set(el, 'done', t >= at + 380);
    });

    set(result, 'show', t >= T_RESULT);
    rows.forEach(function (r, i) { set(r, 'in', t >= T_RESULT + i * ROW_GAP); });
  }

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    frame(T_LOOP);
    return;
  }

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
