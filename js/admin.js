// ============================================
// ABC Kitchen — Admin dashboard
// Live orders (Realtime), reservations, reviews, menu, settings
// ============================================
(function(){
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const S = window.SITE;

  const AD_KEY = 'abc3_admin_session';
  const AD_PASS_KEY = 'abc3_admin_pass_hash';
  const DEFAULT_PASS_HASH = null; // fallback in code below

  // ---------- Hash helper (SHA-256 hex) ----------
  async function sha256(msg){
    if (!crypto || !crypto.subtle){ return btoa(msg); } // very weak fallback
    const buf = new TextEncoder().encode(msg);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  const DEFAULT_HASH_PROMISE = sha256('admin1234'); // hash of default password

  // ---------- Session ----------
  function isSignedIn(){ try { return localStorage.getItem(AD_KEY) === '1'; } catch(e){ return false; } }
  function signIn(){ try { localStorage.setItem(AD_KEY, '1'); } catch(e){} }
  function signOut(){ try { localStorage.removeItem(AD_KEY); } catch(e){} }

  window.adLogout = function(){
    signOut();
    location.reload();
  };

  window.adLogin = async function(e){
    e.preventDefault();
    const pass = $('#adPass').value.trim();
    if (!pass){ return false; }
    const stored = localStorage.getItem(AD_PASS_KEY) || await DEFAULT_HASH_PROMISE;
    const typed = await sha256(pass);
    if (typed === stored){
      signIn();
      showDash();
      $('#adPass').value = '';
    } else {
      toast('Wrong password');
    }
    return false;
  };

  function showDash(){
    $('#adLogin').style.display = 'none';
    $('#adDash').hidden = false;
    bootDash();
  }

  // ---------- Icons for top nav / buttons ----------
  function injectIcons(){
    const set = (id, k) => { const el = document.getElementById(id); if (el) el.innerHTML = icon(k, 'icon--sm'); };
    set('adLogoutBtn','x');
    set('tab-ic-orders','cart');
    set('tab-ic-res','calendar');
    set('tab-ic-rev','heart');
    set('tab-ic-menu','utensils');
    set('tab-ic-set','sparkle');
    set('btn-refresh-ic','arrow');
    set('btn-add-ic','plus');
    set('menuModalClose','x');
  }

  // ---------- Tabs ----------
  let currentTab = 'orders';
  function initTabs(){
    $$('.ad-tab').forEach(btn => btn.addEventListener('click', () => {
      const t = btn.dataset.tab;
      $$('.ad-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $$('.ad-panel').forEach(p => p.classList.remove('active'));
      const panel = $('#panel-'+t);
      if (panel) panel.classList.add('active');
      currentTab = t;
      onTabEnter(t);
    }));
  }

  function onTabEnter(t){
    if (t === 'orders') loadOrders();
    if (t === 'reservations') loadReservations();
    if (t === 'reviews') loadReviews();
    if (t === 'menu') loadMenu();
    if (t === 'settings') loadSettings();
  }

  // ---------- Connection banner ----------
  function updateConnectBanner(){
    const el = $('#adConnect');
    const live = $('#adLive');
    if (window.isSupabaseConfigured()){
      el.classList.add('ok');
      el.innerHTML = '<div><b>Connected to Supabase.</b><span>Live orders arrive instantly via Realtime.</span></div>';
      if (live){ live.classList.remove('off'); live.innerHTML = '<span class="ad-live__dot"></span> Live'; }
    } else {
      el.classList.remove('ok');
      // keep default HTML
      if (live){ live.classList.add('off'); live.innerHTML = '<span class="ad-live__dot"></span> Offline'; }
    }
  }

  // ---------- Sample data (offline mode) ----------
  const SAMPLE_ORDERS = [
    { id:'demo-1', code:'#a1b2c3', mode:'Delivery',  items:[{name:'Paneer Butter Masala',price:240,qty:1},{name:'Butter Naan',price:50,qty:2}], subtotal:340, delivery:30, total:370, phone:'98xxx45678', status:'new',       created_at:new Date(Date.now()-3*60000).toISOString() },
    { id:'demo-2', code:'#d4e5f6', mode:'Takeaway',  items:[{name:'Veg Biryani',price:220,qty:2},{name:'Mango Lassi',price:120,qty:2}],       subtotal:680, delivery:0,  total:680, phone:'98xxx11111', status:'preparing', created_at:new Date(Date.now()-18*60000).toISOString() },
    { id:'demo-3', code:'#g7h8i9', mode:'Dine-in',   items:[{name:'Paneer Tikka',price:220,qty:1},{name:'Dal Makhani',price:200,qty:1}],       subtotal:420, delivery:0,  total:420, phone:'',           status:'completed', created_at:new Date(Date.now()-3*3600000).toISOString() }
  ];
  const SAMPLE_RES = [
    { id:'r-1', name:'Meera Rao',   phone:'98xxx45678', date:new Date().toISOString().slice(0,10), time:'20:00', guests:4, status:'new',      created_at:new Date(Date.now()-45*60000).toISOString() },
    { id:'r-2', name:'Aditya Puri', phone:'98xxx11111', date:new Date(Date.now()+86400000).toISOString().slice(0,10), time:'19:30', guests:2, status:'confirmed', created_at:new Date(Date.now()-6*3600000).toISOString() }
  ];
  const SAMPLE_REV = [
    { id:'rv-1', name:'Sneha V.',  stars:5, text:'The paneer tikka is exceptional. Warm room, kind service.',      is_public:false, created_at:new Date(Date.now()-2*3600000).toISOString() },
    { id:'rv-2', name:'Rahul M.',  stars:4, text:'Biryani was very good, a touch too salty for me but overall great.', is_public:true,  created_at:new Date(Date.now()-26*3600000).toISOString() }
  ];

  // ---------- Time ago ----------
  function ago(iso){
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + ' min ago';
    if (diff < 86400) return Math.floor(diff/3600) + ' hr ago';
    return Math.floor(diff/86400) + ' d ago';
  }

  // ---------- Orders ----------
  let ordersCache = [];
  let orderFilter = 'all';
  const orderStatusFlow = ['new','accepted','preparing','ready','completed'];
  const orderNextLabel = { new:'Accept', accepted:'Start prep', preparing:'Mark ready', ready:'Complete' };
  const orderNextStatus = { new:'accepted', accepted:'preparing', preparing:'ready', ready:'completed' };

  window.loadOrders = async function(){
    const list = $('#ordersList');
    if (window.API && window.API.configured()){
      list.innerHTML = '<div class="ad-empty">Loading…</div>';
      const res = await window.API.listOrders(100);
      ordersCache = res.rows && res.rows.length ? res.rows : [];
    } else {
      ordersCache = SAMPLE_ORDERS.slice();
    }
    renderOrders();
  };

  function renderOrders(){
    const list = $('#ordersList');
    let rows = ordersCache;
    if (orderFilter !== 'all') rows = rows.filter(o => o.status === orderFilter);
    if (rows.length === 0){
      list.innerHTML = '<div class="ad-empty">No orders here yet. New orders show up instantly.</div>';
      const badge = $('#tabBadgeOrders'); if (badge) badge.hidden = true;
      return;
    }
    list.innerHTML = rows.map(orderCard).join('');
    // Update "new" badge on tab
    const newCount = ordersCache.filter(o => o.status === 'new').length;
    const badge = $('#tabBadgeOrders');
    if (badge){ badge.textContent = newCount; badge.hidden = newCount === 0; }
  }

  function orderCard(o){
    const code = o.code || ('#' + (o.id||'').substring(0,6));
    const status = o.status || 'new';
    const nextLabel = orderNextLabel[status];
    const nextStatus = orderNextStatus[status];
    const items = (o.items || []).map(i => escapeHtml(i.name)+' × '+i.qty).join(' · ');
    return ''
      + '<article class="ad-card ad-card--'+status+'" data-id="'+o.id+'">'
      +   '<div class="ad-card__row">'
      +     '<span class="ad-card__code">'+code+'</span>'
      +     '<span class="ad-card__time">'+ago(o.created_at)+'</span>'
      +   '</div>'
      +   '<div class="ad-card__row">'
      +     '<span class="ad-card__mode ad-card__mode--'+o.mode+'">'+o.mode+'</span>'
      +     '<span class="ad-card__status ad-card__status--'+status+'">'+status+'</span>'
      +   '</div>'
      +   '<p class="ad-card__items">'+items+'</p>'
      +   '<div class="ad-card__row">'
      +     '<button class="btn btn--ghost btn--sm" onclick="viewOrder(\''+o.id+'\')">Details</button>'
      +     '<span class="ad-card__total">₹'+o.total+'</span>'
      +   '</div>'
      +   (nextStatus ? '<div class="ad-card__actions">'
      +     '<button class="btn btn--primary btn--sm" onclick="setOrderStatus(\''+o.id+'\',\''+nextStatus+'\')">'+nextLabel+'</button>'
      +     (status === 'new' ? '<button class="btn btn--ghost btn--sm" onclick="setOrderStatus(\''+o.id+'\',\'cancelled\')">Cancel</button>' : '')
      +   '</div>' : '')
      + '</article>';
  }

  window.setOrderStatus = async function(id, status){
    if (window.API && window.API.configured()){
      await window.API.updateOrderStatus(id, status);
    }
    // Optimistic update
    ordersCache = ordersCache.map(o => o.id === id ? Object.assign({}, o, { status: status }) : o);
    renderOrders();
    toast('Order updated');
  };

  window.viewOrder = function(id){
    const o = ordersCache.find(x => x.id === id); if (!o) return;
    const items = (o.items || []).map(i => '<li><span>'+escapeHtml(i.name)+' × '+i.qty+'</span><span>₹'+(i.price*i.qty)+'</span></li>').join('');
    $('#orderModalBody').innerHTML = ''
      + '<button class="modal__close" data-modal-close>Close</button>'
      + '<div class="ad-order-detail">'
      +   '<h3>Order '+(o.code || '#'+id.substring(0,6))+'</h3>'
      +   '<div class="row"><span>Placed</span><b>'+new Date(o.created_at).toLocaleString()+'</b></div>'
      +   '<div class="row"><span>Mode</span><b>'+o.mode+'</b></div>'
      +   '<div class="row"><span>Status</span><b>'+o.status+'</b></div>'
      +   (o.phone ? '<div class="row"><span>Phone</span><b>'+escapeHtml(o.phone)+'</b></div>' : '')
      +   (o.address ? '<div class="row"><span>Address</span><b>'+escapeHtml(o.address)+'</b></div>' : '')
      +   '<ul class="items">'+items+'</ul>'
      +   '<div class="row"><span>Subtotal</span><b>₹'+o.subtotal+'</b></div>'
      +   (o.delivery ? '<div class="row"><span>Delivery</span><b>₹'+o.delivery+'</b></div>' : '')
      +   '<div class="row"><span>Total</span><b>₹'+o.total+'</b></div>'
      + '</div>';
    openModal('orderModal');
  };

  // Filter chips
  function initOrderFilter(){
    $$('#panel-orders .ad-chip').forEach(c => c.addEventListener('click', () => {
      $$('#panel-orders .ad-chip').forEach(b => b.classList.remove('active'));
      c.classList.add('active');
      orderFilter = c.dataset.status;
      renderOrders();
    }));
  }

  // Realtime — subscribe to new orders + status changes
  let orderRt = { unsubscribe: function(){} };
  function initOrderRealtime(){
    orderRt.unsubscribe();
    if (!window.API || !window.API.configured()) return;
    orderRt = window.API.onNewOrder(function(row){
      ordersCache.unshift(row);
      renderOrders();
      // ping
      const first = $('.ad-card[data-id="'+row.id+'"]');
      if (first) first.classList.add('ad-card--just-in');
      try { new Audio('data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQwAAADq/9L/zP/T/9z/6f/o/93/1P/O/9j/6P/y/wYA').play(); } catch(e){}
      toast('New order: ' + row.mode);
    });
    window.API.onOrderChange(function(row){
      ordersCache = ordersCache.map(o => o.id === row.id ? row : o);
      if (currentTab === 'orders') renderOrders();
    });
  }

  // ---------- Reservations ----------
  window.loadReservations = async function(){
    const list = $('#reservationsList');
    let rows;
    if (window.API && window.API.configured()){
      const res = await window.API.listReservations(100);
      rows = res.rows && res.rows.length ? res.rows : [];
    } else {
      rows = SAMPLE_RES.slice();
    }
    if (rows.length === 0){
      list.innerHTML = '<div class="ad-empty">No reservations yet.</div>';
      $('#tabBadgeRes').hidden = true;
      return;
    }
    list.innerHTML = rows.map(resCard).join('');
    const newCount = rows.filter(r => r.status === 'new').length;
    const badge = $('#tabBadgeRes');
    badge.textContent = newCount; badge.hidden = newCount === 0;
  };

  function resCard(r){
    const status = r.status || 'new';
    return ''
      + '<article class="ad-card ad-card--'+status+'" data-id="'+r.id+'">'
      +   '<div class="ad-card__row">'
      +     '<span class="ad-res__when">'+escapeHtml(r.date)+' · '+escapeHtml(r.time)+'</span>'
      +     '<span class="ad-card__status ad-card__status--'+status+'">'+status+'</span>'
      +   '</div>'
      +   '<p class="ad-res__guest"><b>'+escapeHtml(r.name)+'</b> · '+escapeHtml(r.phone)+' · '+r.guests+' guest'+(r.guests>1?'s':'')+'</p>'
      +   '<div class="ad-card__actions">'
      +     (status === 'new' ? '<button class="btn btn--primary btn--sm" onclick="setResStatus(\''+r.id+'\',\'confirmed\')">Confirm</button>' : '')
      +     (status === 'confirmed' ? '<button class="btn btn--primary btn--sm" onclick="setResStatus(\''+r.id+'\',\'seated\')">Seated</button>' : '')
      +     (status !== 'cancelled' ? '<button class="btn btn--ghost btn--sm" onclick="setResStatus(\''+r.id+'\',\'cancelled\')">Cancel</button>' : '')
      +     (r.phone ? '<a class="btn btn--ghost btn--sm" href="tel:'+r.phone+'">Call</a>' : '')
      +   '</div>'
      + '</article>';
  }

  window.setResStatus = async function(id, status){
    if (window.API && window.API.configured()) await window.API.updateReservationStatus(id, status);
    loadReservations();
    toast('Reservation updated');
  };

  // ---------- Reviews ----------
  window.loadReviews = async function(){
    const list = $('#reviewsList');
    let rows;
    if (window.API && window.API.configured()){
      const res = await window.API.listReviews(100);
      rows = res.rows && res.rows.length ? res.rows : [];
    } else {
      rows = SAMPLE_REV.slice();
    }
    if (rows.length === 0){ list.innerHTML = '<div class="ad-empty">No reviews yet.</div>'; return; }
    list.innerHTML = rows.map(revCard).join('');
    const pending = rows.filter(r => !r.is_public).length;
    const badge = $('#tabBadgeRev');
    badge.textContent = pending; badge.hidden = pending === 0;
  };

  function revCard(r){
    const on = r.is_public;
    return ''
      + '<article class="ad-card">'
      +   '<div class="ad-rev__stars">'+'★'.repeat(r.stars)+'</div>'
      +   '<p class="ad-rev__text">"'+escapeHtml(r.text)+'"</p>'
      +   '<p class="ad-rev__by"><b>'+escapeHtml(r.name)+'</b> · '+ago(r.created_at)+'</p>'
      +   '<div class="ad-card__actions">'
      +     '<button class="btn '+(on ? 'btn--ghost':'btn--primary')+' btn--sm" onclick="toggleReview(\''+r.id+'\','+!on+')">'+(on ? 'Hide from site' : 'Show on site')+'</button>'
      +   '</div>'
      + '</article>';
  }

  window.toggleReview = async function(id, next){
    if (window.API && window.API.configured()){
      const sb = window.getSupabase();
      if (sb) await sb.from('reviews').update({ is_public: next }).eq('id', id);
    }
    loadReviews();
  };

  // ---------- Menu editor ----------
  let menuCache = [];
  window.loadMenu = async function(){
    const list = $('#menuList');
    if (window.API && window.API.configured()){
      const res = await window.API.listMenu();
      menuCache = res.rows && res.rows.length ? res.rows : [];
    } else {
      menuCache = (S.menu || []).map((m,i) => Object.assign({}, m, { id: 'local-'+i, sort_order: i*10, is_available: true }));
    }
    if (menuCache.length === 0){ list.innerHTML = '<div class="ad-empty">No menu items. Click "Add item" to create your first.</div>'; return; }
    list.innerHTML = menuCache.map(menuRow).join('');
  };

  function menuRow(m){
    return ''
      + '<article class="ad-menu-item" data-id="'+m.id+'">'
      +   '<div class="ad-menu-item__img">'+(m.image ? '<img src="'+m.image+'" alt="" />' : 'no img')+'</div>'
      +   '<div class="ad-menu-item__body">'
      +     '<div class="ad-menu-item__name">'+escapeHtml(m.name)+'</div>'
      +     '<div class="ad-menu-item__meta">'+escapeHtml(m.category)+' · '+(m.diet==='veg'?'Veg':'Non-veg')+(m.tag?' · '+escapeHtml(m.tag):'')+'</div>'
      +     '<div class="ad-menu-item__actions">'
      +       '<button class="btn btn--ghost btn--sm" onclick="editMenuItem(\''+m.id+'\')">Edit</button>'
      +       '<button class="btn btn--ghost btn--sm" onclick="removeMenuItem(\''+m.id+'\')">Delete</button>'
      +     '</div>'
      +   '</div>'
      +   '<div class="ad-menu-item__price">₹'+m.price+'</div>'
      + '</article>';
  }

  window.openMenuEditor = function(item){
    const sel = $('#mi_category');
    sel.innerHTML = (S.categories || []).map(c => '<option value="'+c.key+'">'+c.label+'</option>').join('');
    if (item){
      $('#menuModalTitle').textContent = 'Edit menu item';
      $('#mi_id').value = item.id || '';
      $('#mi_name').value = item.name || '';
      $('#mi_category').value = item.category || (S.categories && S.categories[0].key) || '';
      $('#mi_diet').value = item.diet || 'veg';
      $('#mi_desc').value = item.desc || item.description || '';
      $('#mi_price').value = item.price || 0;
      $('#mi_sort').value = item.sort_order || 100;
      $('#mi_image').value = item.image || '';
      $('#mi_tag').value = item.tag || '';
      $('#mi_featured').checked = !!item.featured;
      $('#mi_available').checked = item.is_available !== false;
    } else {
      $('#menuModalTitle').textContent = 'Add menu item';
      $('#menuForm').reset();
      $('#mi_id').value = '';
      $('#mi_available').checked = true;
    }
    openModal('menuModal');
  };

  window.editMenuItem = function(id){
    const m = menuCache.find(x => x.id === id); if (!m) return;
    openMenuEditor(m);
  };

  window.saveMenuItem = async function(e){
    e.preventDefault();
    const row = {
      name: $('#mi_name').value.trim(),
      category: $('#mi_category').value,
      diet: $('#mi_diet').value,
      description: $('#mi_desc').value.trim(),
      price: parseInt($('#mi_price').value) || 0,
      sort_order: parseInt($('#mi_sort').value) || 100,
      image: $('#mi_image').value.trim(),
      tag: $('#mi_tag').value.trim() || null,
      featured: $('#mi_featured').checked,
      is_available: $('#mi_available').checked
    };
    const id = $('#mi_id').value;
    if (id) row.id = id;
    if (window.API && window.API.configured()){
      await window.API.upsertMenu(row);
    } else {
      // Local: update menuCache
      if (id){ menuCache = menuCache.map(m => m.id === id ? Object.assign({}, m, row) : m); }
      else { menuCache.push(Object.assign({ id: 'local-'+Date.now() }, row)); }
    }
    closeModal('menuModal');
    loadMenu();
    toast('Menu item saved');
    return false;
  };

  window.removeMenuItem = async function(id){
    if (!confirm('Delete this menu item?')) return;
    if (window.API && window.API.configured()) await window.API.deleteMenu(id);
    else menuCache = menuCache.filter(m => m.id !== id);
    loadMenu();
    toast('Deleted');
  };

  // ---------- Settings ----------
  window.loadSettings = async function(){
    let s = null;
    if (window.API && window.API.configured()){
      const res = await window.API.listSettings();
      s = res.rows && res.rows[0];
    }
    if (!s){
      s = {
        brand_name: (S.brand && S.brand.name) || '',
        tagline: (S.brand && S.brand.tagline) || '',
        phone: (S.contact && S.contact.phone) || '',
        whatsapp: (S.contact && S.contact.whatsapp) || '',
        address: (S.contact && S.contact.address) || '',
        hours: (S.contact && S.contact.hours) || '',
        open_time: (S.serviceHours && S.serviceHours.open) || '11:00',
        close_time: (S.serviceHours && S.serviceHours.close) || '23:00'
      };
    }
    $('#setBrand').value = s.brand_name || '';
    $('#setTagline').value = s.tagline || '';
    $('#setPhone').value = s.phone || '';
    $('#setWa').value = s.whatsapp || '';
    $('#setAddress').value = s.address || '';
    $('#setOpen').value = s.open_time || '11:00';
    $('#setClose').value = s.close_time || '23:00';
    $('#setHours').value = s.hours || '';
    window._settingsId = s.id || null;
  };

  window.saveSettings = async function(e){
    e.preventDefault();
    const row = {
      brand_name: $('#setBrand').value.trim(),
      tagline: $('#setTagline').value.trim(),
      phone: $('#setPhone').value.trim(),
      whatsapp: $('#setWa').value.trim(),
      address: $('#setAddress').value.trim(),
      open_time: $('#setOpen').value,
      close_time: $('#setClose').value,
      hours: $('#setHours').value.trim(),
      updated_at: new Date().toISOString()
    };
    if (window._settingsId) row.id = window._settingsId;

    // Password change (local-only for now)
    const newPass = $('#setPass').value.trim();
    if (newPass){
      const hash = await sha256(newPass);
      localStorage.setItem(AD_PASS_KEY, hash);
      if (window.API && window.API.configured()) row.admin_pass_hash = hash;
      $('#setPass').value = '';
    }

    if (window.API && window.API.configured()){
      await window.API.upsertSettings(row);
      toast('Settings saved');
    } else {
      // Offline: store locally
      try { localStorage.setItem('abc3_local_settings', JSON.stringify(row)); } catch(e){}
      toast('Saved locally · connect Supabase to persist');
    }
    return false;
  };

  // ---------- Boot dashboard ----------
  function bootDash(){
    injectIcons();
    initTabs();
    initOrderFilter();
    updateConnectBanner();
    loadOrders();
    initOrderRealtime();
    // Preload other tabs quietly so badges show
    setTimeout(loadReservations, 400);
    setTimeout(loadReviews, 800);
    // Re-check for Supabase-ready event (SDK loads async)
    document.addEventListener('supabase-ready', () => {
      updateConnectBanner();
      loadOrders();
      loadReservations();
      loadReviews();
      initOrderRealtime();
    }, { once:true });
    // Refresh "time ago" labels every 30s
    setInterval(() => { if (currentTab === 'orders') renderOrders(); }, 30000);
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    injectIcons();
    if (isSignedIn()) showDash();
  });
})();
