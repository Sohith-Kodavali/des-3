# ABC Kitchen — Restaurant PWA (Design 3)

Farm-to-table restaurant template. Mobile-primary PWA, pluggable Supabase backend, live admin dashboard.

## Structure

```
design 3/
├── index.html          # Home
├── menu.html           # Order online
├── admin.html          # Live dashboard (orders / reservations / reviews / menu / settings)
├── manifest.json       # PWA install
├── sw.js               # Service worker (offline shell)
├── favicon.svg
├── css/
│   ├── style.css       # Customer-facing styles
│   └── admin.css       # Admin dashboard styles
├── js/
│   ├── site-data.js    # Brand, menu items, testimonials (fallback data)
│   ├── supabase-client.js  # Supabase init (paste your creds here)
│   ├── backend.js      # API wrapper — talks to Supabase or falls back to WhatsApp + local
│   ├── app.js          # Customer site logic
│   └── admin.js        # Admin logic + Realtime subscriptions
├── db/
│   └── schema.sql      # Full Supabase schema + RLS + Realtime setup
└── img/                # Placeholder food photos (1.jpeg – 23.jpeg)
```

## Local preview

```bash
python -m http.server 5531 --directory "."
```

Open http://localhost:5531/ — customer site.
Open http://localhost:5531/admin.html — dashboard (default password `admin1234`).

## Connecting Supabase (5 minutes)

1. Create a free project at [supabase.com](https://supabase.com/).
2. Open the SQL editor and run `db/schema.sql`. This creates:
   - `settings`, `menu_items`, `orders`, `reservations`, `reviews`
   - Row Level Security policies (public read where safe, admin-only writes)
   - Realtime publication for `orders`, `reservations`, `reviews`
3. Grab your project URL and **anon** key from `Settings → API`.
4. Paste them into `js/supabase-client.js`:
   ```js
   window.SUPABASE_CONFIG = {
     url:     'https://xxxxx.supabase.co',
     anonKey: 'eyJhbGciOi...'
   };
   ```

That's it. The customer site starts writing orders to Supabase, the admin dashboard picks them up in real time.

**Never paste the `service_role` key here** — it bypasses row security and can be read by anyone visiting the site.

## Admin dashboard

- **Live orders** — new orders arrive instantly via Realtime subscription (no polling → no bandwidth waste)
- **Reservations** — confirm, mark seated, cancel
- **Reviews** — moderate (approve for public display or hide)
- **Menu editor** — add / edit / delete items, categories, prices, images
- **Settings** — brand name, hours, phone, WhatsApp number, admin password

Default admin password: `admin1234` (change on first login → Settings → Change admin password).

The dashboard shows **sample data** until Supabase is connected — useful for previewing before commit.

## Backend capacity (Supabase free tier)

With Realtime admin (not polling) and default client-side menu cache:

| Load                                      | Free tier verdict |
|-------------------------------------------|-------------------|
| 500 customers + 300 orders/day            | ~5% quota used |
| 1,500 customers + 1,000 orders/day        | ~15% quota |
| 3,000 customers + 2,000 orders/day        | ~30% quota |
| 5,000+ customers/day per restaurant       | comfortable |
| 3–5 restaurants on one Supabase project   | fits within free 5 GB egress |

Upgrade path: Supabase Pro ($25/mo) → 100 GB egress + 8 GB DB. Handles ~80k customers/day.

## What still works without Supabase

- Full customer site (menu, cart, checkout, reserve, review) — hands off to WhatsApp
- Static testimonials from `site-data.js`
- Admin dashboard shows sample data + local menu editor (writes go into localStorage until Supabase is added)

## PWA install

Users can install to their home screen. Set your own `theme_color`, `background_color`, and icon in `manifest.json`. Replace `favicon.svg` with your brand mark.

## Production checklist

- [ ] Set your Supabase project URL + anon key in `js/supabase-client.js`
- [ ] Run `db/schema.sql` once
- [ ] Change admin password (Settings tab, first login)
- [ ] Update `js/site-data.js` — brand name, phone, address, hours
- [ ] Update `manifest.json` — name, theme colour, icons
- [ ] Replace `img/` placeholders with real food photos
- [ ] Add a real Google Maps embed URL to `SITE.contact.mapsEmbed`
- [ ] Enable HTTPS (required for PWA install and Realtime)
- [ ] (Optional) Migrate admin auth to Supabase Auth for stronger security
