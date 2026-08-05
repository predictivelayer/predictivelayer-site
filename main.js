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

  /* ---------- hero demo ---------- */
  var demo = document.getElementById('demo');
  if (!demo) return;

  var pick = function (n) { return demo.querySelector('[data-el="' + n + '"]'); };
  var chips  = pick('chips');
  var ask    = pick('ask');
  var typed  = pick('typed');
  var result = pick('result');
  var steps  = ['s1', 's2', 's3', 's4'].map(pick);
  var rows   = Array.prototype.slice.call(demo.querySelectorAll('tbody tr'));

  var LINE = 'Score my Q3 pipeline for fit. Use the closed accounts as examples.';

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var timers = [];
  var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
  var clear = function () {
    timers.forEach(clearTimeout);
    timers = [];
  };

  function settle() {
    // final state, no motion
    [chips, ask, result].forEach(function (el) { el.classList.add('show'); });
    steps.forEach(function (el) { el.classList.add('show', 'done'); });
    rows.forEach(function (r) { r.classList.add('in'); });
    typed.textContent = LINE;
    var c = demo.querySelector('.cursor');
    if (c) c.style.display = 'none';
  }

  function reset() {
    [chips, ask, result].forEach(function (el) { el.classList.remove('show'); });
    steps.forEach(function (el) { el.classList.remove('show', 'done'); });
    rows.forEach(function (r) { r.classList.remove('in'); });
    typed.textContent = '';
  }

  function type(text, ms, done) {
    var i = 0;
    (function step() {
      typed.textContent = text.slice(0, i);
      if (i++ <= text.length) at(ms, step);
      else if (done) done();
    })();
  }

  function run() {
    reset();

    at(400, function () { chips.classList.add('show'); });
    at(1100, function () {
      ask.classList.add('show');
      type(LINE, 26);
    });

    // steps land one at a time after the question is asked
    var base = 3400;
    steps.forEach(function (el, i) {
      at(base + i * 700, function () { el.classList.add('show'); });
      at(base + i * 700 + 420, function () { el.classList.add('done'); });
    });

    at(6400, function () { result.classList.add('show'); });
    rows.forEach(function (r, i) {
      at(6600 + i * 130, function () { r.classList.add('in'); });
    });

    at(15000, run);
  }

  if (reduced) {
    settle();
    return;
  }

  // only animate while the demo is on screen
  var running = false;
  var start = function () {
    if (running) return;
    running = true;
    run();
  };
  var stop = function () {
    running = false;
    clear();
    settle();
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) start();
        else stop();
      });
    }, { threshold: 0.15 }).observe(demo);
  } else {
    start();
  }
})();
