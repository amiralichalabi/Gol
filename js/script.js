(function () {
  'use strict';

  /* اطلاعات شش گل؛ مختصات کارت از روی قاب‌های تصویر مرجع (پیکسل، نسبت به اندازه‌ی قاب) */
  var FLOWERS = [
    { id: 'rose',      fa: 'رز',          thumb: 'rose.jpg',           bg: 'bg-rose.jpg',      line: 'رز هم خیلی قشنگه',        size: [327, 502], card: [40, 216, 285, 348], off: [38, 75] },
    { id: 'lily',      fa: 'لیلیوم',      thumb: 'lily.jpg',           bg: 'bg-lily.jpg',      line: 'لیلیوم هم فوق‌العاده‌ست',  size: [329, 491], card: [56, 199, 288, 327], off: [37, 73] },
    { id: 'lotus',     fa: 'نیلوفر آبی',  thumb: 'lotus.jpg',          bg: 'bg-lotus.jpg',     line: 'نیلوفر آبی هم زیباست',    size: [335, 491], card: [48, 196, 287, 322], off: [38, 74] },
    { id: 'tulip',     fa: 'لاله',        thumb: 'tulip.jpg',          bg: 'bg-tulip.jpg',     line: 'لاله هم بسیار دوست‌داشتنیه', size: [327, 491], card: [42, 184, 285, 314], off: [38, 75] },
    { id: 'sunflower', fa: 'آفتابگردان',  thumb: 'sunflower.jpg',      bg: 'bg-sunflower.jpg', line: 'آفتابگردان هم خاصه',      size: [329, 513], card: [51, 181, 285, 311], off: [39, 77] },
    { id: 'cherry',    fa: 'شکوفه گیلاس', thumb: 'cherry-blossom.jpg', bg: 'bg-cherry.jpg',    line: 'شکوفه گیلاس هم قشنگه',    size: [335, 513], card: [47, 171, 283, 301], off: [40, 77] }
  ];

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = document.getElementById('stage');
  var dynamic = document.getElementById('dynamic');
  var live = document.getElementById('live');
  var timers = [];
  var chosen = null;
  var current = document.getElementById('s-intro');
  var skipHandler = null;

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function scale(ms) { return reduced ? Math.round(ms * 0.35) : ms; }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function pct(a, b) { return (a / b * 100).toFixed(2) + '%'; }

  /* ---------- ساخت سکانس‌های ۳ تا ۸ (برای هر گل یک صفحه) ---------- */
  FLOWERS.forEach(function (f) {
    var W = f.size[0], H = f.size[1], c = f.card;
    var s = el('section', 'screen');
    s.id = 's-' + f.id;
    s.setAttribute('aria-label', f.fa);
    s.style.setProperty('--ar', W + '/' + H);

    var fill = new Image();
    fill.className = 'bgfill'; fill.alt = ''; fill.setAttribute('aria-hidden', 'true');
    fill.dataset.src = 'images/' + f.bg;
    s.appendChild(fill);
    var canvas = el('div', 'canvas');
    var img = new Image();
    img.className = 'bg'; img.alt = ''; img.decoding = 'async';
    img.dataset.src = 'images/' + f.bg;
    canvas.appendChild(img);

    function line(cls, y, text, delay) {
      var p = el('p', 'card-line r ' + cls);
      p.style.left = pct(c[0], W);
      p.style.width = pct(c[2] - c[0], W);
      p.style.top = pct(c[1] + y, H);
      p.dataset.d = delay;
      p.appendChild(el('span', null, text));
      return p;
    }
    canvas.appendChild(line('l1', f.off[0], f.line, 1100));
    canvas.appendChild(line('l2', f.off[1], '...اما', 4600));
    s.appendChild(canvas);
    dynamic.appendChild(s);
  });

  /* ---------- سکانس ۹: پیام نهایی ---------- */
  var finalS = el('section', 'screen');
  finalS.id = 's-final';
  finalS.setAttribute('aria-label', 'پیام نهایی');
  finalS.style.setProperty('--ar', '327/513');
  finalS.innerHTML =
    '<img class="bgfill" data-src="images/bg-final.jpg" alt="" aria-hidden="true">' +
    '<div class="canvas">' +
      '<img class="bg" data-src="images/bg-final.jpg" alt="" decoding="async">' +
      '<p class="t r f-wrong" style="top:10%" data-d="1000"><span>جوابت غلطه!</span></p>' +
      '<p class="t r f-line" style="top:17.6%" data-d="3600"><span id="f-flower"></span></p>' +
      '<p class="t r f-but" style="top:23.6%" data-d="6000"><span>ولی</span></p>' +
      '<h2 class="t f-head" id="f-head" style="top:38.5%" data-d="7000">' +
        '<span class="w" style="transition-delay:0s">قشنگ‌ترین</span>' +
        '<span class="w" style="transition-delay:.55s">گل</span>' +
        '<span class="w" style="transition-delay:1.1s">دنیا</span><br>' +
        '<span class="w" style="transition-delay:2s">تویی</span>' +
      '</h2>' +
      '<p class="t r f-greet" style="top:59.5%" data-d="10800"><span>قشنگ‌ترین گل دنیا،<br>روزت مبارک!</span></p>' +
      '<p class="t r f-wish" style="top:69.2%" data-d="13000"><span>امیدوارم همیشه دلت خوش<br>و لبت خندون باشه.</span></p>' +
      '<div class="t r" style="top:75.2%" data-d="14600"><span><svg class="f-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6 C5 15.2 2.6 11.6 2.6 8.4 C2.6 5.6 4.7 3.6 7.3 3.6 C9.2 3.6 10.9 4.7 12 6.4 C13.1 4.7 14.8 3.6 16.7 3.6 C19.3 3.6 21.4 5.6 21.4 8.4 C21.4 11.6 19 15.2 12 20.6 Z"/></svg></span></div>' +
      '<div class="t r" style="top:83%" data-d="16000"><button class="btn ghost" id="restart" type="button">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5"/></svg><span>شروع دوباره</span></button></div>' +
    '</div>';
  dynamic.appendChild(finalS);

  /* ---------- بارگذاری تنبل تصویر پس‌زمینه‌ها ---------- */
  function hydrate(screen) {
    screen.querySelectorAll('img[data-src]').forEach(function (im) { if (!im.getAttribute('src')) im.src = im.dataset.src; });
  }
  function preloadAll() {
    var run = function () {
      document.querySelectorAll('img[data-src]').forEach(function (im) { if (!im.getAttribute('src')) im.src = im.dataset.src; });
      FLOWERS.forEach(function (f) { new Image().src = 'images/' + f.thumb; });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 2500 }); else setTimeout(run, 800);
  }

  /* ---------- نمایش تدریجی عناصر یک صفحه ---------- */
  function reveal(screen) {
    screen.querySelectorAll('[data-d]').forEach(function (n) {
      n.classList.remove('in');
      later(function () { n.classList.add('in'); }, scale(+n.dataset.d));
    });
  }

  function go(next) {
    if (next === current) return;
    clearTimers();
    if (skipHandler) { current.removeEventListener('click', skipHandler); skipHandler = null; }
    hydrate(next);
    var prev = current;
    setTimeout(function () { prev.querySelectorAll('[data-d]').forEach(function (n) { if (prev !== current) n.classList.remove('in'); }); }, 2000);
    current.classList.remove('active');
    next.classList.add('active');
    current = next;
    reveal(next);
  }

  /* ---------- سکانس ۱ -> ۲ ---------- */
  document.getElementById('start').addEventListener('click', function () {
    preloadAll();
    go(document.getElementById('s-choose'));
    var tiles = document.querySelectorAll('#grid .tile');
    tiles.forEach(function (t, i) { later(function () { t.classList.add('in'); }, scale(2200 + i * 260)); });
  });

  /* ---------- سکانس ۲: شش کارت گل ---------- */
  var grid = document.getElementById('grid');
  FLOWERS.forEach(function (f) {
    var b = el('button', 'tile');
    b.type = 'button';
    b.setAttribute('aria-label', f.fa);
    var im = new Image();
    im.src = 'images/' + f.thumb; im.alt = ''; im.decoding = 'async';
    b.appendChild(im);
    b.appendChild(el('span', null, f.fa));
    b.addEventListener('click', function () { choose(f, b); });
    grid.appendChild(b);
  });

  function choose(f, btn) {
    if (chosen) return;
    chosen = f; /* نام گل انتخاب‌شده برای پیام‌های بعدی ذخیره می‌شود */
    grid.classList.add('locked');
    btn.classList.add('picked');
    var target = document.getElementById('s-' + f.id);
    hydrate(target);
    later(function () {
      go(target);
      /* پس از «...اما» کمی مکث و سپس رفتن به پیام نهایی (با لمس هم می‌شود زودتر رفت) */
      var skipAt = scale(4600 + 1800);
      later(function () {
        skipHandler = function () { toFinal(); };
        target.addEventListener('click', skipHandler);
      }, skipAt);
      later(toFinal, scale(4600 + 5600));
    }, scale(900));
  }

  function toFinal() {
    if (current === finalS) return;
    document.getElementById('f-flower').textContent = chosen.fa + ' هم قشنگه‌ها...';
    go(finalS);
    later(burst, scale(7000));
    later(function () {
      live.textContent = 'جوابت غلطه! ' + chosen.fa + ' هم قشنگه‌ها... ولی قشنگ‌ترین گل دنیا تویی. قشنگ‌ترین گل دنیا، روزت مبارک!';
    }, scale(10800));
  }

  /* ---------- شروع دوباره ---------- */
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('#restart')) return;
    chosen = null;
    grid.classList.remove('locked');
    document.querySelectorAll('#grid .tile').forEach(function (t) { t.classList.remove('picked', 'in'); });
    live.textContent = '';
    go(document.getElementById('s-intro'));
  });

  /* ---------- گلبرگ‌های پس‌زمینه ---------- */
  var petalsBox = document.getElementById('petals');
  function rnd(a, b) { return a + Math.random() * (b - a); }
  if (!reduced) {
    for (var i = 0; i < 8; i++) {
      var p = el('i', 'petal');
      p.style.left = rnd(2, 96).toFixed(1) + '%';
      p.style.setProperty('--s', rnd(2.6, 4.4).toFixed(1) + 'cqw');
      p.style.setProperty('--dx', rnd(-12, 16).toFixed(1) + 'cqw');
      p.style.setProperty('--dur', rnd(24, 36).toFixed(1) + 's');
      p.style.setProperty('--del', '-' + rnd(0, 30).toFixed(1) + 's');
      petalsBox.appendChild(p);
    }
  }

  /* افکت نهایی: پخش شدن گلبرگ‌ها از وسط عنوان */
  function burst() {
    if (reduced || !petalsBox.animate) return;
    var w = stage.clientWidth, h = stage.clientHeight;
    var cx = w / 2, cy = h * 0.36;
    for (var i = 0; i < 18; i++) {
      var p = el('i', 'petal');
      p.style.animation = 'none';
      p.style.opacity = '0';
      p.style.top = '0'; p.style.left = '0';
      p.style.setProperty('--s', rnd(2.8, 4.8).toFixed(1) + 'cqw');
      petalsBox.appendChild(p);
      var ang = rnd(0, Math.PI * 2), dist = rnd(w * 0.25, w * 0.6);
      var x1 = cx + Math.cos(ang) * dist, y1 = cy + Math.sin(ang) * dist * 0.7;
      var x2 = x1 + rnd(-30, 30), y2 = y1 + rnd(h * 0.12, h * 0.3);
      var rot = rnd(-240, 240);
      var anim = p.animate([
        { transform: 'translate(' + cx + 'px,' + cy + 'px) rotate(0deg) scale(.4)', opacity: 0 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) rotate(' + rot / 2 + 'deg) scale(1)', opacity: 0.95, offset: 0.4 },
        { transform: 'translate(' + x2 + 'px,' + y2 + 'px) rotate(' + rot + 'deg) scale(.9)', opacity: 0 }
      ], { duration: rnd(4200, 6200), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
      anim.onfinish = (function (n) { return function () { n.remove(); }; })(p);
    }
  }

  /* شروع: ورود تدریجی صفحه‌ی اول */
  reveal(current);
  window.addEventListener('load', function () { later(preloadAll, 1500); });
})();
