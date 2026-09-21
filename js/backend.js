// ============================================
// ABC Kitchen — Backend wrapper
// One API surface. Works with or without Supabase configured.
// Without Supabase: writes queue to localStorage (offline draft),
// reads fall back to SITE_DATA statics. WhatsApp handoff still works.
// With Supabase: writes hit Supabase, reads pull live tables.
// ============================================
(function(){
  'use strict';

  var LS_QUEUE = 'abc3_outbox_v1';   // pending writes to sync on next Supabase config
  var LS_ORDERS = 'abc3_local_orders'; // local echo for user's own recent orders

  function queue(row){
    try{
      var q = JSON.parse(localStorage.getItem(LS_QUEUE) || '[]');
      q.push(row);
      localStorage.setItem(LS_QUEUE, JSON.stringify(q));
    }catch(e){}
  }
  function readLocalOrders(){
    try{ return JSON.parse(localStorage.getItem(LS_ORDERS) || '[]'); }catch(e){ return []; }
  }
  function pushLocalOrder(o){
    try{
      var arr = readLocalOrders();
      arr.unshift(o);
      arr = arr.slice(0, 20);
      localStorage.setItem(LS_ORDERS, JSON.stringify(arr));
    }catch(e){}
  }

  async function insert(table, row){
    var sb = window.getSupabase && window.getSupabase();
    if (!sb){
      queue({ table: table, row: row, ts: Date.now() });
      return { ok: true, source: 'local', row: row };
    }
    try{
      var res = await sb.from(table).insert(row).select().single();
      if (res.error) throw res.error;
      return { ok: true, source: 'supabase', row: res.data };
    }catch(e){
      console.warn('insert '+table+' failed:', e && e.message);
      queue({ table: table, row: row, ts: Date.now() });
      return { ok: true, source: 'local-fallback', row: row };
    }
  }

  async function list(table, opts){
    opts = opts || {};
    var sb = window.getSupabase && window.getSupabase();
    if (!sb) return { ok: true, source: 'local', rows: [] };
    try{
      var q = sb.from(table).select(opts.select || '*');
      if (opts.eq) Object.keys(opts.eq).forEach(k => { q = q.eq(k, opts.eq[k]); });
      if (opts.order) q = q.order(opts.order.column, { ascending: !!opts.order.asc });
      if (opts.limit) q = q.limit(opts.limit);
      var res = await q;
      if (res.error) throw res.error;
      return { ok: true, source: 'supabase', rows: res.data || [] };
    }catch(e){
      console.warn('list '+table+' failed:', e && e.message);
      return { ok: false, source: 'error', rows: [], error: e && e.message };
    }
  }

  async function update(table, id, patch){
    var sb = window.getSupabase && window.getSupabase();
    if (!sb) return { ok: false, source: 'local' };
    try{
      var res = await sb.from(table).update(patch).eq('id', id).select().single();
      if (res.error) throw res.error;
      return { ok: true, source: 'supabase', row: res.data };
    }catch(e){
      console.warn('update '+table+' failed:', e && e.message);
      return { ok: false, source: 'error', error: e && e.message };
    }
  }

  async function remove(table, id){
    var sb = window.getSupabase && window.getSupabase();
    if (!sb) return { ok: false, source: 'local' };
    try{
      var res = await sb.from(table).delete().eq('id', id);
      if (res.error) throw res.error;
      return { ok: true, source: 'supabase' };
    }catch(e){
      console.warn('delete '+table+' failed:', e && e.message);
      return { ok: false, source: 'error', error: e && e.message };
    }
  }

  // Realtime — used by admin only
  function subscribe(table, event, handler){
    var sb = window.getSupabase && window.getSupabase();
    if (!sb) return { unsubscribe: function(){} };
    try{
      var ch = sb.channel('rt-'+table+'-'+event)
        .on('postgres_changes', { event: event, schema: 'public', table: table }, function(payload){ handler(payload); })
        .subscribe();
      return { unsubscribe: function(){ try{ sb.removeChannel(ch); }catch(e){} } };
    }catch(e){
      console.warn('subscribe '+table+' failed:', e && e.message);
      return { unsubscribe: function(){} };
    }
  }

  // ---------- High-level restaurant API ----------
  window.API = {
    async saveOrder(order){
      // order: { mode, items:[{name,price,qty}], total, subtotal, delivery, phone?, address?, notes? }
      order.created_at = new Date().toISOString();
      order.status = 'new';
      var r = await insert('orders', order);
      pushLocalOrder(Object.assign({}, order, { id: r.row && r.row.id }));
      return r;
    },
    async saveReview(review){
      review.created_at = new Date().toISOString();
      return await insert('reviews', review);
    },
    async saveReservation(res){
      res.created_at = new Date().toISOString();
      res.status = 'new';
      return await insert('reservations', res);
    },

    async listOrders(limit){ return await list('orders', { order:{column:'created_at', asc:false}, limit: limit || 50 }); },
    async listReviews(limit){ return await list('reviews', { order:{column:'created_at', asc:false}, limit: limit || 50 }); },
    async listReservations(limit){ return await list('reservations', { order:{column:'created_at', asc:false}, limit: limit || 50 }); },
    async listMenu(){ return await list('menu_items', { order:{column:'sort_order', asc:true} }); },
    async listSettings(){ return await list('settings', { limit:1 }); },

    async updateOrderStatus(id, status){ return await update('orders', id, { status: status, updated_at: new Date().toISOString() }); },
    async updateReservationStatus(id, status){ return await update('reservations', id, { status: status, updated_at: new Date().toISOString() }); },
    async upsertMenu(row){ return row.id ? update('menu_items', row.id, row) : insert('menu_items', row); },
    async deleteMenu(id){ return await remove('menu_items', id); },
    async upsertSettings(row){ return row.id ? update('settings', row.id, row) : insert('settings', row); },

    // Realtime — pass a callback that receives the new row
    onNewOrder(handler){ return subscribe('orders', 'INSERT', function(p){ handler(p.new); }); },
    onOrderChange(handler){ return subscribe('orders', 'UPDATE', function(p){ handler(p.new); }); },
    onNewReview(handler){ return subscribe('reviews', 'INSERT', function(p){ handler(p.new); }); },
    onNewReservation(handler){ return subscribe('reservations', 'INSERT', function(p){ handler(p.new); }); },

    outbox(){ try{ return JSON.parse(localStorage.getItem(LS_QUEUE) || '[]'); }catch(e){ return []; } },
    clearOutbox(){ try{ localStorage.setItem(LS_QUEUE, '[]'); }catch(e){} },

    localOrders: readLocalOrders,
    configured: function(){ return window.isSupabaseConfigured(); }
  };
})();
