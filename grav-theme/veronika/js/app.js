(function(){
    document.documentElement.classList.add('js');
    var views=document.querySelectorAll('.view'), navBtns=document.querySelectorAll('nav.links button');
    function go(id){var f=false;views.forEach(function(v){var on=v.id===id;v.classList.toggle('active',on);if(on)f=true;});if(!f){id='uvod';document.getElementById('uvod').classList.add('active');}navBtns.forEach(function(b){b.classList.toggle('active',b.dataset.go===id);});document.querySelectorAll('.has-sub').forEach(function(hs){var t=hs.querySelector('.sub-toggle');if(!t)return;var on=false;hs.querySelectorAll('.submenu button').forEach(function(b){if(b.dataset.go===id)on=true;});t.classList.toggle('active',on);});try{history.replaceState(null,'','#'+id);}catch(e){}window.scrollTo({top:0});document.getElementById('navlinks').classList.remove('open');}
    document.addEventListener('click',function(e){var t=e.target.closest('[data-go]');if(t){e.preventDefault();go(t.dataset.go);}});
    document.getElementById('menuBtn').addEventListener('click',function(){document.getElementById('navlinks').classList.toggle('open');});
    document.querySelectorAll('.cform').forEach(function(form){ form.addEventListener('submit',function(e){e.preventDefault();var g=function(nm){var el=form.querySelector('[name='+nm+']');return el?el.value:'';};var n=g('name'),p=g('phone'),m=g('message');window.location.href='mailto:pmutoth@gmail.com?subject='+encodeURIComponent('Dopyt z webu — '+n)+'&body='+encodeURIComponent('Meno: '+n+'\nTelefón: '+p+'\n\n'+m);}); });
    document.getElementById('year').textContent=new Date().getFullYear();
    var navEl=document.querySelector('header.nav');
    var onScroll=function(){ if(!navEl) return; var y=window.pageYOffset||document.documentElement.scrollTop||0; if(!navEl.classList.contains('shrink')){ if(y>140) navEl.classList.add('shrink'); } else { if(y<80) navEl.classList.remove('shrink'); } };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

    // jemné odhalenie pri scrolle
    try {
      var revealEls = document.querySelectorAll('.head, .pillar, .svc, details.q, .care-step, .prow, .gal .frame, .about');
      revealEls.forEach(function(el){ el.classList.add('reveal'); });
      [['.gal','.frame'],['.svc-list','.svc'],['.pillars','.pillar'],['.care-list','.care-step']].forEach(function(pair){
        document.querySelectorAll(pair[0]).forEach(function(group){
          Array.prototype.slice.call(group.children).forEach(function(child,i){ if(child.classList.contains('reveal')){ child.style.transitionDelay=Math.min(i*70,350)+'ms'; } });
        });
      });
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold:0.08, rootMargin:'0px 0px -40px 0px' });
        revealEls.forEach(function(el){ io.observe(el); });
      } else { revealEls.forEach(function(el){ el.classList.add('in'); }); }
    } catch(e){}

    (function(){
      function loadMaps(){ document.querySelectorAll('.map-embed').forEach(function(box){ var ifr=box.querySelector('iframe'); if(ifr&&!ifr.src&&ifr.getAttribute('data-src')){ ifr.src=ifr.getAttribute('data-src'); ifr.hidden=false; } var ph=box.querySelector('.map-ph'); if(ph) ph.hidden=true; }); }
      document.querySelectorAll('.map-load').forEach(function(b){ b.addEventListener('click',loadMaps); });
      var consent; try{consent=localStorage.getItem('vt-consent');}catch(e){}
      if(consent==='yes') loadMaps();
      var bar=document.getElementById('cookiebar'); if(bar&&!consent) bar.hidden=false;
      function setC(v){ try{localStorage.setItem('vt-consent',v);}catch(e){} if(bar) bar.hidden=true; if(v==='yes') loadMaps(); }
      var a=document.getElementById('cbAccept'), d=document.getElementById('cbDecline');
      if(a) a.addEventListener('click',function(){setC('yes');});
      if(d) d.addEventListener('click',function(){setC('no');});
    })();

    (function(){
      var tiles=[].slice.call(document.querySelectorAll('#galeria .frame'));
      if(!tiles.length) return;
      var media=tiles.map(function(t){var v=t.querySelector('video'),im=t.querySelector('img');return v?{type:'video',src:v.getAttribute('src')}:{type:'img',src:im.getAttribute('src'),alt:(im.getAttribute('alt')||'')};});
      var lb=document.getElementById('lightbox'),stage=document.getElementById('lbStage'),idx=0;
      function render(){ var m=media[idx]; stage.innerHTML=''; var el; if(m.type==='video'){el=document.createElement('video');el.src=m.src;el.autoplay=true;el.loop=true;el.muted=true;el.playsInline=true;el.setAttribute('controls','');}else{el=document.createElement('img');el.src=m.src;el.alt=m.alt;} stage.appendChild(el); }
      function open(i){ idx=i; render(); lb.hidden=false; }
      function close(){ lb.hidden=true; stage.innerHTML=''; }
      function nav(d){ idx=(idx+d+media.length)%media.length; render(); }
      tiles.forEach(function(t,i){ t.addEventListener('click',function(){ open(i); }); });
      document.getElementById('lbClose').addEventListener('click',close);
      document.getElementById('lbPrev').addEventListener('click',function(e){e.stopPropagation();nav(-1);});
      document.getElementById('lbNext').addEventListener('click',function(e){e.stopPropagation();nav(1);});
      lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
      document.addEventListener('keydown',function(e){ if(lb.hidden) return; if(e.key==='Escape') close(); else if(e.key==='ArrowLeft') nav(-1); else if(e.key==='ArrowRight') nav(1); });
    })();

    var h=(location.hash||'').replace('#','');if(h)go(h);
  })();