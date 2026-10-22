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
      window.open('https://wa.me/919553345964?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
