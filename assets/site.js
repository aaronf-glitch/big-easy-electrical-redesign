
(function(){
  var hero=document.getElementById('hero');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) hero.classList.add('go');
  /* menus: dropdown toggles (touch + keyboard) and the mobile menu. Runs before the motion code returns. No double ampersand (WordPress encodes it, L-045). */
  document.querySelectorAll('.mainnav .ddt').forEach(function(b){
    b.addEventListener('click', function(){
      var dd=b.parentNode, open=!dd.classList.contains('open');
      document.querySelectorAll('.mainnav .dd.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.ddt').setAttribute('aria-expanded','false'); });
      if (open) { dd.classList.add('open'); b.setAttribute('aria-expanded','true'); }
    });
  });
  document.addEventListener('click', function(e){
    if (e.target.closest('.mainnav .dd')) return;
    document.querySelectorAll('.mainnav .dd.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.ddt').setAttribute('aria-expanded','false'); });
  });
  var burger=document.querySelector('.burger'), mnav=document.getElementById('mnav');
  function setMenu(open){
    if (!mnav) return;
    mnav.hidden=!open; document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { mnav.querySelector('.mclose').focus(); } else if (burger) { burger.focus(); }
  }
  if (burger) burger.addEventListener('click', function(){ setMenu(true); });
  if (mnav) {
    mnav.querySelector('.mclose').addEventListener('click', function(){ setMenu(false); });
    mnav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ if (a.getAttribute('href').charAt(0)==='#') setMenu(false); }); });
  }
  document.addEventListener('keydown', function(e){
    if (e.key!=='Escape') return;
    if (mnav) { if (!mnav.hidden) setMenu(false); }
    document.querySelectorAll('.mainnav .dd.open').forEach(function(o){ o.classList.remove('open'); });
  });
  /* sticky nav: pin the nav once the visitor scrolls past the first screen of the hero */
  var navEl=document.querySelector('.hero > .nav');
  if (navEl) {
    var spacer=document.createElement('div'); spacer.className='navspace'; navEl.parentNode.insertBefore(spacer, navEl);
    var stuck=false;
    var onScroll=function(){
      var want=window.scrollY > 420;
      if (want===stuck) return;
      if (want) document.documentElement.style.setProperty('--navh', navEl.offsetHeight+'px');
      stuck=want; document.body.classList.toggle('stuck', want);
    };
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  }
  /* popup estimate form: the client's own LeadConnector form, built on first open so it never loads twice */
  var modal=document.getElementById('bee-modal');
  if (modal) {
    var lastFocus=null;
    var openModal=function(e){
      if (!modal.showModal) return;
      if (e) e.preventDefault();
      var body=modal.querySelector('.mbody');
      if (!body.querySelector('iframe')) {
        var f=document.createElement('iframe');
        f.id='bee-popup-form'; f.title='Get Your Free Estimate'; f.setAttribute('scrolling','yes');
        f.src='https://api.leadconnectorhq.com/widget/form/Pr6s4ptPugYTZ0iryjH3';
        body.appendChild(f);
      }
      lastFocus=document.activeElement; modal.showModal(); document.body.classList.add('modal-open');
      modal.querySelector('.mx').focus();
    };
    var closeModal=function(){ modal.close(); };
    modal.addEventListener('close', function(){ document.body.classList.remove('modal-open'); if (lastFocus) lastFocus.focus(); });
    modal.querySelector('.mx').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){ if (e.target===modal) closeModal(); });
    document.querySelectorAll('[data-popup]').forEach(function(b){ b.addEventListener('click', function(e){ if (mnav) { if (!mnav.hidden) setMenu(false); } openModal(e); }); });
  }
  if (reduce || !('IntersectionObserver' in window)) return;
  var vh=window.innerHeight;
  function done(el,cls){ el.classList.remove(cls); el.style.removeProperty('--d'); }
  function arm(el,cls,delay){
    var target = cls==='rv-img' ? el.querySelector('img') : el;
    if (delay) el.style.setProperty('--d', delay+'ms');
    el.classList.add(cls);
    if (target) target.addEventListener('animationend', function(){ done(el,cls); }, {once:true});
    setTimeout(function(){ done(el,cls); }, 2600 + delay);
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      var el=en.target; io.unobserve(el);
      arm(el, el.getAttribute('data-rv'), +el.getAttribute('data-delay') || 0);
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:0});
  function watch(sel, cls, stagger){
    document.querySelectorAll(sel).forEach(function(el){
      if (el.getBoundingClientRect().top < vh) return;          /* already on screen at load: leave it alone */
      var i = stagger ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.setAttribute('data-rv', cls); el.setAttribute('data-delay', Math.min(i, 8) * 70);
      io.observe(el);
    });
  }
  watch('.why .left > *, .blog .head > *, .svc .head > *, .process .head > *, .signs .txt > *, .about .acard, .areas .box > div:first-child, .blog .top, .faq .side > p, .faq .side > .h2, .faq .side > h2, .faq .side > .ctas, .close .txt > *', 'rv-up', false);
  watch('.why .list > *, .cinfo > li, .grid > *, .steps > li, .checks > li, .cities > li, .posts > *, .qa > details, .chips > li', 'rv-up', true);
  watch('.shot, .signs .photo, .close .cph, .faq .ask .ph', 'rv-img', false);
  /* signature: power on the process line once */
  var proc=document.querySelector('.process'); if (!proc) return; var steps=proc.querySelector('.steps');
  var pio=new IntersectionObserver(function(en){
    if (!en[0].isIntersecting) return; pio.disconnect();
    steps.style.setProperty('--run', (steps.getBoundingClientRect().width * 0.76 - 16) + 'px');
    proc.classList.add('live');
    setTimeout(function(){ proc.classList.remove('live'); }, 3200);
  }, {rootMargin:'0px 0px -25% 0px'});
  pio.observe(steps);
})();
