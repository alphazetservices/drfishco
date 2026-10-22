(function () {
  'use strict';
  var body = document.body;

  // Sticky header shadow
  var header = document.querySelector('.site-header');
  function onScroll() { header && header.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal, [data-bars]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Tabs
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = wrap.querySelectorAll('[role="tab"]');
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        var next = tabs[(i + n + tabs.length) % tabs.length];
        next.focus(); select(next);
      });
    });
  });

  // Product gallery front/back
  document.querySelectorAll('[data-gallery]').forEach(function (g) {
    var main = g.querySelector('.pd-main img');
    g.querySelectorAll('.pd-thumbs button').forEach(function (b, _, all) {
      b.addEventListener('click', function () {
        all.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        main.style.opacity = 0;
        setTimeout(function () { main.src = b.dataset.src; main.alt = b.dataset.alt; main.style.opacity = 1; }, 200);
      });
    });
  });

  // Enquiry form -> WhatsApp
  var form = document.getElementById('enquiry-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    var pre = params.get('product');
    if (pre) { var sel = form.querySelector('#f-product'); Array.prototype.forEach.call(sel.options, function (o) { if (o.text === pre) sel.value = o.text; }); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var F = function (id) { return form.querySelector('#f-' + id); };
      var name = F('name').value.trim(), phone = F('phone').value.trim();
      [F('name'), F('phone')].forEach(function (f) { f.style.borderColor = f.value.trim() ? '' : '#459522'; });
      if (!name || !phone) { (name ? F('phone') : F('name')).focus(); return; }
      var msg = 'Hello Dr.Fishco,\n\nName: ' + name + '\nMobile: ' + phone + '\nI am a: ' + F('type').value +
        '\nProduct: ' + F('product').value + (F('loc').value ? '\nLocation: ' + F('loc').value : '') +
        (F('msg').value ? '\n\n' + F('msg').value : '');
      window.open('https://wa.me/919553345963?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }


  // Scroll showcase: one packet per screen
  var sc = document.querySelector('[data-showcase]');
  if (sc) {
    var slides = sc.querySelectorAll('.sc-slide'), dots = sc.querySelectorAll('.sc-dots i'), cur = -1;
    function setSlide(i) {
      if (i === cur) return; cur = i;
      sc.setAttribute('data-active', i);
      body.classList.toggle('on-green', i === 2 && sc.getBoundingClientRect().bottom > innerHeight * .5);
      slides.forEach(function (s, n) {
        s.classList.toggle('on', n === i); s.classList.toggle('past', n < i);
        s.setAttribute('aria-hidden', String(n !== i));
        var a = s.querySelector('a'); if (a) a.tabIndex = n === i ? 0 : -1;
      });
      dots.forEach(function (d, n) { d.classList.toggle('on', n === i); });
    }
    var ticking = false;
    function update() {
      ticking = false;
      var r = sc.getBoundingClientRect(), sticky = sc.querySelector('.sc-sticky').offsetHeight;
      var run = sc.offsetHeight - sticky, p = Math.min(Math.max(-r.top / run, 0), 0.9999);
      setSlide(Math.floor(p * slides.length));
      body.classList.toggle('on-green', cur === 2 && r.bottom > innerHeight * .5);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
