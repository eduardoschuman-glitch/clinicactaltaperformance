/* ============================================================
   CT ALTA PERFORMANCE — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sticky header ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Gallery carousel ---------- */
  var track = document.getElementById('track');
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var total = slides.length;
    var index = 0;
    var dotsWrap = document.getElementById('dots');
    var prevBtn = document.getElementById('carPrev');
    var nextBtn = document.getElementById('carNext');
    var timer = null;
    var INTERVAL = 4500;

    // build dots
    for (var i = 0; i < total; i++) {
      (function (i) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
        b.addEventListener('click', function () { go(i); restart(); });
        dotsWrap.appendChild(b);
      })(i);
    }
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
    }
    function go(i) { index = (i + total) % total; render(); }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function start() { timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    nextBtn.addEventListener('click', function () { next(); restart(); });
    prevBtn.addEventListener('click', function () { prev(); restart(); });

    var carousel = document.getElementById('carousel');
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    // pause when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    // basic swipe
    var startX = null;
    carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      startX = null;
      start();
    }, { passive: true });

    render();
    start();
  }
})();
