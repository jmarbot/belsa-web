/* BELSA · comportamiento compartido de subpáginas */
(function(){
  document.documentElement.classList.add('js');
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menú móvil
  var nav = document.getElementById('nav'), menuBtn = document.getElementById('menuBtn');
  if (menuBtn) menuBtn.addEventListener('click', function(){
    var o = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o);
  });

  // Revelados
  var io = new IntersectionObserver(function(es){
    es.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(function(el, i){
    if (RM || el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
    else { el.style.transitionDelay = ((i % 3) * 70) + 'ms'; io.observe(el); }
  });

  // Progreso, cabecera y WhatsApp flotante
  var pbar = document.getElementById('pbar'), hdr = document.getElementById('hdr'), wa = document.getElementById('waFloat'), ticking = false;
  function frame(){
    ticking = false;
    var y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
    if (pbar) pbar.style.transform = 'scaleX(' + (H > 0 ? y / H : 0) + ')';
    if (hdr) hdr.classList.toggle('scrolled', y > 30);
    if (wa) wa.classList.toggle('show', y > innerHeight * 0.4);
  }
  function req(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, {passive:true}); addEventListener('resize', req); frame();

  // Filtros del Journal
  var cats = [].slice.call(document.querySelectorAll('.cat')), posts = [].slice.call(document.querySelectorAll('[data-c]'));
  cats.forEach(function(c){ c.addEventListener('click', function(){
    cats.forEach(function(x){ x.setAttribute('aria-pressed', x === c); });
    posts.forEach(function(p){ p.hidden = !(c.dataset.f === 'all' || p.dataset.c.split(' ').indexOf(c.dataset.f) > -1); });
  }); });
})();

/* Antes y después: la división avanza con el scroll hasta que la persona la mueve */
(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].slice.call(document.querySelectorAll('.cmp')).forEach(function(cmp){
    var range = cmp.parentNode.querySelector('.cmp-ctrl input'), touched = false, drag = false;
    function setX(v){ v = Math.max(0, Math.min(100, v)); cmp.style.setProperty('--x', v + '%'); if (range) range.value = Math.round(v); }
    function fromE(e){ var r = cmp.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    function onScroll(){
      if (touched || RM) return;
      var r = cmp.getBoundingClientRect(), p = (innerHeight - r.top) / (innerHeight + r.height);
      setX(88 - Math.max(0, Math.min(1, p)) * 76);
    }
    cmp.addEventListener('pointerdown', function(e){ touched = drag = true; setX(fromE(e)); try{ cmp.setPointerCapture(e.pointerId); }catch(_){} });
    cmp.addEventListener('pointermove', function(e){ if (drag || e.pointerType === 'mouse') { if (e.pointerType === 'mouse') touched = true; setX(fromE(e)); } });
    cmp.addEventListener('pointerup', function(){ drag = false; });
    cmp.addEventListener('pointercancel', function(){ drag = false; });
    if (range) range.addEventListener('input', function(){ touched = true; setX(+range.value); });
    addEventListener('scroll', onScroll, {passive:true}); onScroll();
  });
})();
