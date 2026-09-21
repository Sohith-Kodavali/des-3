// ============================================
// ABC Kitchen — App
// Nav, reveal, cart, modal, PWA, renderers
// ============================================
(function(){
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const S = window.SITE;

  const ICON = {
    home:   '<svg class="icon" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11h14V9"/><path d="M10 20v-6h4v6"/></svg>',
    menu:   '<svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>',
    utensils:'<svg class="icon" viewBox="0 0 24 24"><path d="M3 3v8a3 3 0 0 0 3 3v7"/><path d="M6 3v8"/><path d="M9 3v8"/><path d="M18 3c-2 0-3 2-3 5s1 4 3 4v9"/></svg>',
    map:    '<svg class="icon" viewBox="0 0 24 24"><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    phone:  '<svg class="icon" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.6 3.1a2 2 0 0 1-.5 1.9L8 10.1a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 1.9-.5l3.1.6a2 2 0 0 1 1.6 2"/></svg>',
    clock:  '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    wa:     '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-3.6-7.2L21 3l-1.2 3.6A9 9 0 0 1 21 12z"/><path d="M8 10.5c0 3.6 2.9 6.5 6.5 6.5.7 0 1.4-.1 2-.3l-2-1.4c-.7.2-1.4-.1-2-1s-.7-1.7-.4-2.3l-1.4-2c-.2.6-.3 1.3-.7 2.5z"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    cart:   '<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.7 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.5L22 8H6"/></svg>',
    x:      '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>',
    plus:   '<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    ig:     '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    fb:     '<svg class="icon" viewBox="0 0 24 24"><path d="M14 22v-9h3l1-4h-4V6a2 2 0 0 1 2-2h2V0h-3a5 5 0 0 0-5 5v4H7v4h3v9z" fill="currentColor" stroke="none"/></svg>',
    yt:     '<svg class="icon" viewBox="0 0 24 24"><path d="M22 8a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4z"/><path d="M10 9v6l5-3z" fill="currentColor" stroke="none"/></svg>',
    calendar:'<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>',
    heart:  '<svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    leaf:   '<svg class="icon" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.14C15.5 5 17 4.48 19.8 2c1 6-.5 12-3 14a7 7 0 0 1-5.8 4z"/><path d="M2 22c.5-4 3-8 7-10"/></svg>',
    sun:    '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2"/><path d="M12 19v2"/><path d="M4.2 4.2l1.5 1.5"/><path d="M18.3 18.3l1.5 1.5"/><path d="M3 12h2"/><path d="M19 12h2"/><path d="M4.2 19.8l1.5-1.5"/><path d="M18.3 5.7l1.5-1.5"/></svg>',
    truck:  '<svg class="icon" viewBox="0 0 24 24"><path d="M1 8h11v9H1z"/><path d="M12 11h5l4 4v2h-9z"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    recycle:'<svg class="icon" viewBox="0 0 24 24"><path d="M7 19H4a2 2 0 0 1-1.7-3l4-6"/><path d="m14 16-3 3 3 3"/><path d="M11 19h9"/><path d="M15 4H8"/><path d="m11 5-3 3 3 3"/><path d="M18.5 8.5 21 12l-3 6"/></svg>',
    coin:   '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 10c0-1.5-1.3-2.5-3-2.5s-3 1-3 2.3c0 3.2 6 2 6 5 0 1.5-1.3 2.7-3 2.7s-3-1-3-2.5"/></svg>',
    arrow:  '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    check:  '<svg class="icon" viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>',
    sparkle:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="M6 6l3 3"/><path d="M15 15l3 3"/><path d="M18 6l-3 3"/><path d="M9 15l-3 3"/></svg>',
    milk:   '<svg class="icon" viewBox="0 0 24 24"><path d="M8 2h8v3l1 2v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7l1-2z"/><path d="M8 8h8"/></svg>',
    grain:  '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22V2"/><path d="M12 6c-3 0-6 2-6 5s3 5 6 5"/><path d="M12 6c3 0 6 2 6 5s-3 5-6 5"/><path d="M12 12c-2 0-4 2-4 4s2 4 4 4"/><path d="M12 12c2 0 4 2 4 4s-2 4-4 4"/></svg>'
  };
  function icon(k, cls){ const s=ICON[k]||''; return cls ? s.replace('class="icon"','class="icon '+cls+'"') : s; }
  window.icon = icon;

  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
  window.escapeHtml = escapeHtml;

  function mapEmbedHtml(url, name, address){
    var isPlaceholder = !url || url.indexOf('!1s0x0%3A0x0') !== -1 || url.indexOf('YOUR_MAP_EMBED') !== -1;
    if (isPlaceholder){
      var q = encodeURIComponent(address || name || '');
      return '<div class="map map--fallback">'
        + '<div class="map__inner">'
        +   '<div class="map__ic">'+icon('map','icon--lg')+'</div>'
        +   '<h4>Find us on Google Maps</h4>'
        +   '<p>'+escapeHtml(address)+'</p>'
        +   '<a class="btn btn--primary" href="https://www.google.com/maps/search/?api=1&query='+q+'" target="_blank" rel="noopener">'+icon('map','icon--sm')+' Open in Maps</a>'
        + '</div>'
        + '</div>';
    }
    return '<iframe class="map" title="'+escapeHtml(name)+' location" src="'+url+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
  }
  window.mapEmbedHtml = mapEmbedHtml;

  function toast(msg, iconKey){
    let wrap = $('.toast-wrap');
    if (!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className='toast';
    t.innerHTML = (iconKey ? icon(iconKey, 'icon--sm') : '') + '<span>'+escapeHtml(msg)+'</span>';
    wrap.appendChild(t);
    setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(), 350); }, 2400);
  }
  window.toast = toast;

  // ---------- Nav ----------
  function initNav(){
    const nav = $('.nav');
    if (nav){
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
      document.addEventListener('scroll', onScroll, { passive:true }); onScroll();
    }
    const burger = $('.nav__burger');
    const drawer = $('.drawer');
    const drawerClose = $('.drawer__close');
    if (burger && drawer){
      burger.addEventListener('click', () => {
        drawer.classList.add('open');
        burger.setAttribute('aria-expanded','true');
        document.body.style.overflow = 'hidden';
      });
      const closeDrawer = () => { drawer.classList.remove('open'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; };
      if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
      drawer.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeDrawer(); });
    }
  }

  function initReveal(){
    const els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('seen')); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('seen'); io.unobserve(e.target); }});
    }, { rootMargin:'0px 0px -8% 0px', threshold:0.05 });
    els.forEach(el => io.observe(el));
  }

  // ---------- Modal ----------
  function openModal(id){
    const m = $('#'+id); if (!m) return;
    m.classList.add('open'); m.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    const first = m.querySelector('input,button,select,textarea,a');
    if (first) setTimeout(()=>first.focus(), 100);
  }
  function closeModal(id){
    const m = $('#'+id); if (!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  window.openModal = openModal;
  window.closeModal = closeModal;
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-modal-close]')){ const m = t.closest('.modal'); if (m) closeModal(m.id); }
    if (t.classList && t.classList.contains('modal__backdrop')){ const m = t.closest('.modal'); if (m) closeModal(m.id); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      const open = $('.modal.open'); if (open) closeModal(open.id);
      const cp = $('.cart-panel.open'); if (cp) closeCart();
    }
  });

  // ---------- Cart ----------
  const CART_KEY = 'abc3_cart_v1';
  const MODE_KEY = 'abc3_mode_v1';
  function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); } catch(e){ return []; } }
  function saveCart(c){ try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch(e){} renderCart(); }
  function loadMode(){ return localStorage.getItem(MODE_KEY) || 'Takeaway'; }
  function saveMode(m){ localStorage.setItem(MODE_KEY, m); renderCart(); }

  function findItem(name){ return (S.menu||[]).find(m => m.name === name); }

  window.addToCart = function(name, price){
    const c = loadCart();
    const p = parseInt(price)||0;
    const it = c.find(i => i.name === name);
    if (it) it.qty += 1;
    else {
      const m = findItem(name) || {};
      c.push({ name, price:p, qty:1, image: m.image || '' });
    }
    saveCart(c);
    toast(name + ' added', 'check');
  };
  window.changeQty = function(name, delta){
    const c = loadCart();
    const it = c.find(i => i.name === name);
    if (!it) return;
    it.qty += delta;
    saveCart(c.filter(i => i.qty > 0));
  };
  window.setMode = function(mode){ saveMode(mode); };
  window.clearCart = function(){ saveCart([]); };

  function cartCount(){ return loadCart().reduce((s,i)=>s+i.qty,0); }
  function cartTotal(){ return loadCart().reduce((s,i)=>s+i.price*i.qty,0); }

  function renderCart(){
    const c = loadCart();
    const count = cartCount();
    const total = cartTotal();

    // Sync qty on menu cards
    $$('.mcard').forEach(card => {
      const name = card.dataset.name;
      const it = c.find(i => i.name === name);
      const cell = card.querySelector('[data-action]');
      if (!cell) return;
      const price = card.dataset.price;
      if (it){
        cell.innerHTML = '<div class="qty"><button aria-label="Remove one" onclick="changeQty(\''+name.replace(/'/g,"\\'")+'\',-1)">−</button><span>'+it.qty+'</span><button aria-label="Add one" onclick="changeQty(\''+name.replace(/'/g,"\\'")+'\',1)">+</button></div>';
      } else {
        cell.innerHTML = '<button class="add" onclick="addToCart(\''+name.replace(/'/g,"\\'")+'\','+price+')">'+icon('plus','icon--sm')+' Add</button>';
      }
    });

    // FAB
    const fab = $('.cart-fab');
    if (fab){
      fab.classList.toggle('show', count > 0);
      const ct = fab.querySelector('.cart-fab__count'); if (ct) ct.textContent = count;
      const t = fab.querySelector('.cart-fab__text b'); if (t) t.textContent = '₹' + total;
    }

    // Cart panel body
    const body = $('#cartBody');
    if (body){
      if (c.length === 0){
        body.innerHTML = '<div class="cart-empty">'+icon('cart','icon--lg')+'<p>Your basket is empty</p><small>Add something delicious from the menu.</small></div>';
      } else {
        body.innerHTML = '<div class="cart-items">' + c.map(it =>
          '<div class="cart-row">' +
            '<div class="cart-row__img">'+(it.image ? '<img src="'+it.image+'" alt="" />' : '')+'</div>' +
            '<div class="cart-row__info"><div class="cart-row__name">'+escapeHtml(it.name)+'</div><div class="cart-row__price">₹'+it.price+' × '+it.qty+' = ₹'+(it.price*it.qty)+'</div></div>' +
            '<div class="qty"><button aria-label="Remove" onclick="changeQty(\''+it.name.replace(/'/g,"\\'")+'\',-1)">−</button><span>'+it.qty+'</span><button aria-label="Add" onclick="changeQty(\''+it.name.replace(/'/g,"\\'")+'\',1)">+</button></div>' +
          '</div>'
        ).join('') + '</div>';
      }
      const sum = $('#cartSummary');
      if (sum){
        const delivery = loadMode() === 'Delivery' && total > 0 ? (total >= 500 ? 0 : 30) : 0;
        const grand = total + delivery;
        sum.innerHTML =
          '<div class="row"><span>Subtotal</span><span>₹'+total+'</span></div>' +
          (loadMode()==='Delivery' ? '<div class="row"><span>Delivery '+(delivery===0?'(free over ₹500)':'')+'</span><span>₹'+delivery+'</span></div>' : '') +
          '<div class="row total"><span>Total</span><b>₹'+grand+'</b></div>';
      }
      const mode = loadMode();
      $$('.cart-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    }
  }
  window.renderCart = renderCart;

  window.openCart = function(){ const p=$('.cart-panel'); if(p){ p.classList.add('open'); document.body.style.overflow='hidden'; }};
  window.closeCart = function(){ const p=$('.cart-panel'); if(p){ p.classList.remove('open'); document.body.style.overflow=''; }};

  window.checkoutWA = async function(){
    const c = loadCart();
    if (c.length === 0){ toast('Your basket is empty', 'x'); return; }
    const mode = loadMode();
    const subtotal = cartTotal();
    const delivery = mode === 'Delivery' ? (subtotal >= 500 ? 0 : 30) : 0;
    const total = subtotal + delivery;

    if (window.API){
      try { await window.API.saveOrder({ mode, items: c, subtotal, delivery, total }); }
      catch(e){ console.warn('order save failed', e); }
    }

    let msg = '*New order — ' + S.brand.name + '*\n(' + mode + ')\n\n';
    c.forEach(it => { msg += '• ' + it.name + ' × ' + it.qty + ' — ₹' + (it.price * it.qty) + '\n'; });
    msg += '\nSubtotal: ₹' + subtotal;
    if (delivery > 0) msg += '\nDelivery: ₹' + delivery;
    msg += '\n*Total: ₹' + total + '*';
    const url = 'https://wa.me/' + S.contact.whatsapp + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
    toast('Order sent — kitchen has been notified', 'check');
  };

  function isOpen(){
    const [oh, om] = S.serviceHours.open.split(':').map(Number);
    const [ch, cm] = S.serviceHours.close.split(':').map(Number);
    const now = new Date();
    const mins = now.getHours()*60 + now.getMinutes();
    const openM = oh*60+om, closeM = ch*60+cm;
    if (openM <= closeM) return mins >= openM && mins < closeM;
    return mins >= openM || mins < closeM;
  }
  window.isRestaurantOpen = isOpen;

  window.reserveTable = async function(e){
    e.preventDefault();
    const name = $('#rvName').value.trim();
    const phone = $('#rvPhone').value.trim();
    const date = $('#rvDate').value;
    const time = $('#rvTime').value;
    const guests = parseInt($('#rvGuests').value) || 2;
    if (!name || !phone || !date || !time){ toast('Please fill all fields', 'x'); return false; }
    if (window.API){
      try { await window.API.saveReservation({ name, phone, date, time, guests }); }
      catch(e){ console.warn('reservation save failed', e); }
    }
    const msg = '*Table reservation — ' + S.brand.name + '*\nName: ' + name + '\nPhone: ' + phone + '\nDate: ' + date + '\nTime: ' + time + '\nGuests: ' + guests;
    window.open('https://wa.me/' + S.contact.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    toast('Sending on WhatsApp…', 'wa');
    return false;
  };

  let reviewStars = 5;
  const RV_LABELS = { 1:'Not great', 2:'Could be better', 3:'It was fine', 4:'Really liked it', 5:'Loved it' };
  window.setReviewStars = function(n){
    reviewStars = n;
    $$('.rv-star').forEach((s,i) => {
      const on = i < n;
      s.classList.toggle('on', on);
      s.setAttribute('aria-checked', i === n-1 ? 'true' : 'false');
    });
    const hid = $('#rvStars'); if (hid) hid.value = n;
    const lab = $('#rvStarLabel'); if (lab) lab.textContent = n + ' star' + (n>1?'s':'') + ' — ' + RV_LABELS[n];
  };
  window.rvCharCount = function(el){
    const n = el.value.length;
    const out = $('#rvCharCount'); if (out) out.textContent = n;
  };
  window.submitReview = async function(e){
    e.preventDefault();
    const name = $('#reviewName').value.trim();
    const text = $('#reviewText').value.trim();
    if (!name || !text){ toast('Please fill all fields', 'x'); return false; }
    if (window.API){
      try { await window.API.saveReview({ name, stars: reviewStars, text }); }
      catch(e){ console.warn('review save failed', e); }
    }
    const msg = '*Review for ' + S.brand.name + '*\n' + name + ' · ' + reviewStars + ' star(s)\n\n' + text;
    window.open('https://wa.me/' + S.contact.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    toast('Thanks, ' + name.split(' ')[0] + ' — sending on WhatsApp', 'wa');
    $('#reviewForm').reset(); setReviewStars(5);
    return false;
  };

  function maybeShowLogin(){
    if (!$('#loginModal')) return;
    if (localStorage.getItem('abc3_signed') === '1') return;
    setTimeout(() => { if (!$('.modal.open') && !$('.cart-panel.open')) openModal('loginModal'); }, 8000);
  }
  window.handleLogin = function(e){
    e.preventDefault();
    const name = $('#liName').value.trim();
    const phone = $('#liPhone').value.trim();
    if (!name || !phone){ toast('Please add name and phone', 'x'); return false; }
    localStorage.setItem('abc3_signed','1');
    closeModal('loginModal');
    toast('Welcome, ' + name.split(' ')[0] + '!', 'sparkle');
    return false;
  };

  function registerSW(){
    if ('serviceWorker' in navigator){
      window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(()=>{}); });
    }
  }

  // ---------- Renderers ----------
  function renderHome(){
    const hero = $('#renderHero');
    if (hero){
      hero.innerHTML = ''
        + '<div class="hero__bg" aria-hidden="true">'
        +   '<svg class="hero__leaf hero__leaf--a" viewBox="0 0 200 200"><path d="M100 20c-40 0-60 40-60 80s40 80 80 60 60-40 60-80-40-60-80-60zm-20 60c15-8 40-8 50 5-10 15-30 25-50 30 0-15 5-25 0-35z" fill="currentColor"/></svg>'
        +   '<svg class="hero__leaf hero__leaf--b" viewBox="0 0 200 200"><path d="M100 20c-40 0-60 40-60 80s40 80 80 60 60-40 60-80-40-60-80-60z" fill="currentColor"/></svg>'
        + '</div>'
        + '<div class="container hero__inner">'
        +   '<div class="reveal">'
        +     '<span class="kicker">'+icon('leaf','icon--sm')+' '+escapeHtml(S.hero.kicker)+'</span>'
        +     '<h1 class="hero__title">'+escapeHtml(S.hero.line1)+' <span class="accent">'+escapeHtml(S.hero.accent)+'<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M2 8 Q 50 2, 100 6 T 198 4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span> '+escapeHtml(S.hero.line2)+'</h1>'
        +     '<p class="hero__lead">'+escapeHtml(S.hero.lead)+'</p>'
        +     '<div class="hero__cta">'
        +       '<a href="menu.html" class="btn btn--primary">'+icon('utensils','icon--sm')+' See the menu</a>'
        +       '<button type="button" class="btn btn--ghost" onclick="document.getElementById(\'story\').scrollIntoView({behavior:\'smooth\'})">Our story '+icon('arrow','icon--sm')+'</button>'
        +     '</div>'
        +     '<div class="hero__stat-strip">'
        +       S.stats.map(st => '<div class="st"><b>'+st.value+st.suffix+'</b><span>'+st.label+'</span></div>').join('')
        +     '</div>'
        +   '</div>'
        +   '<div class="hero__figure reveal">'
        +     '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><clipPath id="blobMask" clipPathUnits="objectBoundingBox"><path d="M0.5 0.02 C 0.78 0.02 0.98 0.22 0.98 0.5 C 0.98 0.78 0.78 0.98 0.5 0.98 C 0.22 0.98 0.02 0.78 0.02 0.5 C 0.02 0.22 0.22 0.02 0.5 0.02 Z" /></clipPath></defs></svg>'
        +     '<svg viewBox="0 0 500 600" preserveAspectRatio="none"><path d="M 250 20 C 380 20 480 110 480 260 C 480 380 420 480 320 540 C 240 585 140 555 90 470 C 30 375 20 240 60 150 C 100 65 175 20 250 20 Z" fill="currentColor" style="color:var(--muted)"/></svg>'
        +     '<img src="'+S.hero.image+'" alt="'+escapeHtml(S.hero.imageAlt)+'" loading="eager" fetchpriority="high" />'
        +     '<div class="hero__figure__badge"><span>Farm<br>fresh<br>daily</span></div>'
        +   '</div>'
        + '</div>';
      // Use SVG mask via aspect-ratio: override the img shape with the svg path
      const fig = $('.hero__figure');
      if (fig) fig.style.background = 'transparent';
    }

    const featured = $('#renderFeatured');
    if (featured){
      const items = S.menu.filter(m => m.featured).slice(0, 3);
      featured.innerHTML = ''
        + '<div class="container">'
        +   '<div class="section__head reveal"><span class="eyebrow">Today\'s plate</span><h2>What we are loving right now.</h2><p>Three seasonal favourites the kitchen keeps sending out first.</p></div>'
        +   '<div class="dishes">'
        +     items.map(m => dishCard(m)).join('')
        +   '</div>'
        + '</div>';
    }

    const story = $('#renderStory');
    if (story){
      story.innerHTML = ''
        + '<div class="container">'
        +   '<div class="section__head reveal"><span class="eyebrow">Our story</span><h2>A short menu with long roots.</h2><p class="muted-text">We keep it small on purpose. Fewer dishes, more care. Every ingredient has a source we can point to.</p></div>'
        +   '<div class="sourcing reveal">'
        +     S.ingredients.map(i => '<div class="source-card"><div class="source-card__ic">'+icon(i.emoji)+'</div><b>'+escapeHtml(i.label)+'</b><span>'+escapeHtml(i.from)+'</span></div>').join('')
        +   '</div>'
        + '</div>';
    }

    const vals = $('#renderValues');
    if (vals){
      const icons = ['leaf','recycle','sun','coin'];
      vals.innerHTML = ''
        + '<div class="container">'
        +   '<div class="section__head reveal"><span class="eyebrow">How we work</span><h2>Small kitchen. Simple rules.</h2></div>'
        +   '<div class="values">'
        +     S.values.map((v,i) => '<article class="value reveal"><span class="value__num">0'+(i+1)+'</span><div class="value__ic">'+icon(icons[i%icons.length])+'</div><h4>'+escapeHtml(v.title)+'</h4><p>'+escapeHtml(v.desc)+'</p></article>').join('')
        +   '</div>'
        + '</div>';
    }

    const gal = $('#renderGallery');
    if (gal){
      gal.innerHTML = ''
        + '<div class="container">'
        +   '<div class="section__head reveal"><span class="eyebrow">The kitchen</span><h2>A look inside.</h2></div>'
        +   '<div class="gallery">'
        +     S.gallery.map(g => '<figure class="reveal"><img src="'+g.image+'" alt="'+escapeHtml(g.caption)+'" loading="lazy"/><figcaption>'+escapeHtml(g.caption)+'</figcaption></figure>').join('')
        +   '</div>'
        + '</div>';
    }

    const test = $('#renderTestimonials');
    if (test){
      test.innerHTML = ''
        + '<div class="container">'
        +   '<div class="section__head reveal"><span class="eyebrow">Kind words</span><h2>Guests keep coming back.</h2></div>'
        +   '<div class="tcards">'
        +     S.testimonials.map(t => '<article class="tcard reveal"><div class="stars">'+ '★'.repeat(t.stars)+'</div><p>'+escapeHtml(t.text)+'</p><footer><div class="tcard__avatar">'+t.name.charAt(0)+'</div><div><b>'+escapeHtml(t.name)+'</b><span>Regular guest</span></div></footer></article>').join('')
        +   '</div>'
        + '</div>';
    }

    const contact = $('#renderContact');
    if (contact){
      const today = new Date().toISOString().slice(0,10);
      contact.innerHTML = ''
        + '<div class="container">'
        +   '<div class="section__head reveal"><span class="eyebrow">Visit us</span><h2>Come sit down with us.</h2></div>'
        +   '<div class="contact-grid">'
        +     '<div class="reveal">'
        +       '<ul class="contact-list">'
        +         '<li><div class="ci">'+icon('phone')+'</div><div><h5>Phone</h5><p>'+escapeHtml(S.contact.phone)+'</p></div></li>'
        +         '<li><div class="ci">'+icon('wa')+'</div><div><h5>WhatsApp</h5><p>'+escapeHtml(S.contact.phone)+'</p></div></li>'
        +         '<li><div class="ci">'+icon('map')+'</div><div><h5>Address</h5><p>'+escapeHtml(S.contact.address)+'</p></div></li>'
        +         '<li><div class="ci">'+icon('clock')+'</div><div><h5>Open every day</h5><p>'+escapeHtml(S.contact.hours)+'</p></div></li>'
        +       '</ul>'
        +       mapEmbedHtml(S.contact.mapsEmbed, S.brand.name, S.contact.address)
        +     '</div>'
        +     '<div class="card reveal">'
        +       '<span class="eyebrow">Book a table</span><h3 style="font-size:26px;margin-bottom:14px">Save yourself a seat.</h3>'
        +       '<form class="form" onsubmit="return reserveTable(event)">'
        +         '<div class="field"><label for="rvName">Full name</label><input id="rvName" type="text" required placeholder="Your name" autocomplete="name" /></div>'
        +         '<div class="field"><label for="rvPhone">Phone</label><input id="rvPhone" type="tel" required pattern="[0-9 +]{7,}" placeholder="10-digit mobile" autocomplete="tel" /></div>'
        +         '<div class="field"><label for="rvDate">Date</label><input id="rvDate" type="date" min="'+today+'" required /></div>'
        +         '<div class="field"><label for="rvTime">Time</label><input id="rvTime" type="time" required min="'+S.serviceHours.open+'" max="'+S.serviceHours.close+'" /><p class="hint">We are open '+S.contact.hours+'</p></div>'
        +         '<div class="field"><label for="rvGuests">Guests</label><select id="rvGuests">'+[1,2,3,4,5,6,7,8].map(n=>'<option value="'+n+'">'+n+' guest'+(n>1?'s':'')+'</option>').join('')+'</select></div>'
        +         '<button type="submit" class="btn btn--primary btn--block">'+icon('calendar','icon--sm')+' Book on WhatsApp</button>'
        +       '</form>'
        +     '</div>'
        +   '</div>'
        + '</div>';
    }

    const rev = $('#renderReviewForm');
    if (rev){
      const starsHtml = [1,2,3,4,5].map(n =>
        '<button type="button" class="rv-star on" role="radio" aria-label="'+n+' star'+(n>1?'s':'')+'" aria-checked="'+(n===5?'true':'false')+'" tabindex="0" data-n="'+n+'" onclick="setReviewStars('+n+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();setReviewStars('+n+');}">★</button>'
      ).join('');
      rev.innerHTML =
        '<div class="container">' +
          '<div class="section__head reveal"><span class="eyebrow">Guest voices</span><h2>Share your evening.</h2><p>A line or two goes a long way — we read every review.</p></div>' +
          '<div class="rv-card reveal">' +
            '<form id="reviewForm" class="rv-form" onsubmit="return submitReview(event)" novalidate>' +
              '<div class="rv-field">' +
                '<label for="reviewName">Your name</label>' +
                '<input id="reviewName" type="text" required autocomplete="name" placeholder="How should we call you?" />' +
              '</div>' +
              '<div class="rv-field">' +
                '<label>Rating</label>' +
                '<div class="rv-stars" role="radiogroup" aria-label="Rating">' + starsHtml + '</div>' +
                '<p class="rv-star-label" id="rvStarLabel">5 stars — Loved it</p>' +
                '<input type="hidden" id="rvStars" value="5" />' +
              '</div>' +
              '<div class="rv-field">' +
                '<label for="reviewText">Your review</label>' +
                '<textarea id="reviewText" required placeholder="What did you love?" rows="4" maxlength="500" oninput="rvCharCount(this)"></textarea>' +
                '<p class="rv-hint"><span id="rvCharCount">0</span> / 500</p>' +
              '</div>' +
              '<button type="submit" class="btn btn--primary rv-submit">' + icon('heart','icon--sm') + ' Post review</button>' +
            '</form>' +
          '</div>' +
        '</div>';
      setTimeout(function(){ setReviewStars(5); }, 0);
    }

    const li = $('#renderLoginModal');
    if (li){
      li.innerHTML = ''
        + '<span class="modal__handle"></span>'
        + '<button class="modal__close" data-modal-close aria-label="Close">'+icon('x')+'</button>'
        + '<span class="eyebrow">Welcome to '+escapeHtml(S.brand.name)+'</span>'
        + '<h3>Get first taste of the new menu.</h3>'
        + '<p class="muted-text">Seasonal drops, chef notes and members-only tasting evenings. No spam, unsubscribe anytime.</p>'
        + '<form class="form" onsubmit="return handleLogin(event)">'
        +   '<div class="field"><label for="liName">Full name</label><input id="liName" type="text" required autocomplete="name" placeholder="Your name" /></div>'
        +   '<div class="field"><label for="liPhone">Phone</label><input id="liPhone" type="tel" required pattern="[0-9]{10}" placeholder="10-digit mobile" autocomplete="tel" /></div>'
        +   '<button type="submit" class="btn btn--primary btn--block">'+icon('sparkle','icon--sm')+' Join the list</button>'
        + '</form>'
        + '<ul class="benefits" aria-label="Benefits"><li>'+icon('leaf','icon--sm')+' Seasonal drops</li><li>'+icon('heart','icon--sm')+' Chef notes</li><li>'+icon('sparkle','icon--sm')+' Tasting evenings</li><li>'+icon('wa','icon--sm')+' WhatsApp community</li></ul>'
        + '<p class="hint" style="text-align:center;margin-top:12px">We respect your privacy.</p>';
    }

    maybeShowLogin();
  }

  function dishCard(m){
    return ''
      + '<article class="dish reveal">'
      +   '<div class="dish__img">'
      +     (m.tag ? '<span class="tag '+(m.tag==='Signature'||m.tag==='Sharing'?'tag--gold':'')+'">'+escapeHtml(m.tag)+'</span>' : '')
      +     '<img src="'+m.image+'" alt="'+escapeHtml(m.name)+'" loading="lazy" />'
      +   '</div>'
      +   '<div class="dish__body">'
      +     '<div class="dish__row">'
      +       '<h3 class="dish__title"><span class="diet-dot '+(m.diet==='nonveg'?'nv':'')+'" aria-label="'+(m.diet==='veg'?'Vegetarian':'Non-vegetarian')+'"></span>'+escapeHtml(m.name)+'</h3>'
      +       '<span class="dish__price">₹'+m.price+'</span>'
      +     '</div>'
      +     '<p class="dish__desc">'+escapeHtml(m.desc||'')+'</p>'
      +     '<div class="dish__cta"><span class="chip">'+icon('leaf','icon--sm')+' Chef pick</span><button class="add" onclick="addToCart(\''+m.name.replace(/'/g,"\\'")+'\','+m.price+')">'+icon('plus','icon--sm')+' Add</button></div>'
      +   '</div>'
      + '</article>';
  }

  function renderMenu(){
    const wrap = $('#renderMenu');
    if (!wrap) return;

    if (!isOpen()){
      wrap.innerHTML = '<div class="container"><div class="closed-banner"><h3>Sorry, we are closed</h3><p>Please come back during our hours: '+S.contact.hours+'</p></div></div>';
      return;
    }

    const cats = [{key:'all', label:'All'}].concat(S.categories);
    wrap.innerHTML = ''
      + '<div class="container menu-hero">'
      +   '<span class="eyebrow">Order online</span>'
      +   '<h1>Our seasonal menu.</h1>'
      +   '<p>A short menu that changes with the harvest. Order for delivery, takeaway, or dine in.</p>'
      +   '<div class="menu-search"><span aria-hidden="true">'+icon('search')+'</span><input id="menuSearch" type="search" placeholder="Search dishes…" aria-label="Search menu" /></div>'
      + '</div>'
      + '<div class="container"><div class="cats" role="tablist">'
      +   cats.map((c,i)=>'<button class="cat'+(i===0?' active':'')+'" data-cat="'+c.key+'" role="tab">'+escapeHtml(c.label)+'</button>').join('')
      + '</div>'
      + '<div class="menu-grid" id="menuList">'
      +   S.menu.map(m => menuCard(m)).join('')
      + '</div></div>';

    $$('.cat').forEach(btn => btn.addEventListener('click', () => {
      $$('.cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const k = btn.dataset.cat;
      $$('.mcard').forEach(row => { row.style.display = (k==='all' || row.dataset.cat===k) ? '' : 'none'; });
    }));

    const search = $('#menuSearch');
    if (search){
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase().trim();
        $$('.mcard').forEach(row => {
          if (!q){ row.style.display = ''; return; }
          const hay = (row.dataset.search||'');
          row.style.display = hay.indexOf(q) !== -1 ? '' : 'none';
        });
      });
    }
  }

  function menuCard(m){
    return ''
      + '<article class="mcard reveal" data-cat="'+m.category+'" data-name="'+escapeHtml(m.name).replace(/"/g,'&quot;')+'" data-price="'+m.price+'" data-search="'+escapeHtml((m.name+' '+(m.desc||'')+' '+m.category).toLowerCase())+'">'
      +   '<div class="mcard__img">'
      +     (m.tag ? '<span class="tag '+(m.tag==='Signature'||m.tag==='Sharing'?'tag--gold':'')+'">'+escapeHtml(m.tag)+'</span>' : '')
      +     '<img src="'+m.image+'" alt="'+escapeHtml(m.name)+'" loading="lazy" />'
      +   '</div>'
      +   '<div class="mcard__body">'
      +     '<div class="mcard__top"><span class="mcard__name"><span class="diet-dot '+(m.diet==='nonveg'?'nv':'')+'" aria-label="'+(m.diet==='veg'?'Veg':'Non-veg')+'"></span>'+escapeHtml(m.name)+'</span><span class="mcard__price">₹'+m.price+'</span></div>'
      +     '<p class="mcard__desc">'+escapeHtml(m.desc||'')+'</p>'
      +     '<div class="mcard__foot"><div><span class="chip">'+icon('leaf','icon--sm')+' Fresh</span></div><span data-action><button class="add" onclick="addToCart(\''+m.name.replace(/'/g,"\\'")+'\','+m.price+')">'+icon('plus','icon--sm')+' Add</button></span></div>'
      +   '</div>'
      + '</article>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const page = document.body.dataset.page;
    if (page === 'home') renderHome();
    if (page === 'menu') renderMenu();
    $$('[data-brand]').forEach(el => el.textContent = S.brand.name);
    $$('[data-tagline]').forEach(el => el.textContent = S.brand.tagline);
    $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    $$('[data-wa]').forEach(a => a.href = 'https://wa.me/'+S.contact.whatsapp);
    renderCart();
    initReveal();
    registerSW();
  });
})();
