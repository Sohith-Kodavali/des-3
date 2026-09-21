// ============================================
// ABC Kitchen — Supabase client
// Paste project URL + anon key. Site works without them
// (falls back to WhatsApp-only + localStorage cache).
// ============================================
window.SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',        // e.g. 'https://xxxxx.supabase.co'
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // safe to expose in browser
};

// Detect config presence
window.isSupabaseConfigured = function(){
  var c = window.SUPABASE_CONFIG || {};
  return c.url && c.url.indexOf('YOUR_') !== 0
      && c.anonKey && c.anonKey.indexOf('YOUR_') !== 0;
};

// Lazy-load Supabase SDK from CDN only when configured
window.getSupabase = function(){
  if (!window.isSupabaseConfigured()) return null;
  if (window._sb) return window._sb;
  if (typeof window.supabase === 'undefined') return null;
  try {
    window._sb = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey,
      { auth: { persistSession: true, autoRefreshToken: true } }
    );
    return window._sb;
  } catch(e){
    console.warn('Supabase init failed:', e && e.message);
    return null;
  }
};

// Inject Supabase SDK <script> only when configured — no wasted request
(function(){
  if (!window.isSupabaseConfigured()) return;
  if (typeof window.supabase !== 'undefined') return;
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
  s.async = true;
  s.onload = function(){ window.getSupabase(); document.dispatchEvent(new Event('supabase-ready')); };
  s.onerror = function(){ console.warn('Supabase SDK failed to load'); };
  document.head.appendChild(s);
})();
