# SAFF SAFAII PUNE — mobile-first website starter

This is a custom-coded, responsive multi-section website and a starter admin dashboard. It is not yet a live website until you deploy it and configure Supabase.

## Included
- `index.html`: 12-section marketing homepage and booking form.
- `style.css`: responsive premium green/white styling.
- `app.js`: price calculator, booking form and WhatsApp request flow.
- `admin.html` + `admin.js`: Supabase email/password login and booking-status dashboard.
- `supabase-schema.sql`: booking table and initial Row Level Security policies.

## Current behavior
- Price calculator and WhatsApp booking request work without a database.
- Booking form currently opens WhatsApp; it does **not** save bookings to Supabase yet.
- The admin dashboard is a starter and can list/update records after Supabase is configured.
- Do not treat a WhatsApp request as a confirmed appointment.

## Step A — create the database (phone browser)
1. Open https://supabase.com/ and create a project.
2. In project Dashboard, open SQL Editor, create a query, paste all of `supabase-schema.sql`, and run it.
3. Open Authentication > Providers / Sign In settings. Disable public email signups before using this admin panel for real customer data.
4. Create your own admin user through the Supabase dashboard. Do not share its password.
5. Copy the project URL and public anon/publishable key from Project Settings > API (wording may vary). Never use a service-role/secret key in browser code.

## Step B — publish the static site
1. Open https://app.netlify.com/drop in your mobile browser, or create a Netlify account and use its manual deploy flow.
2. Upload the site folder contents (if the mobile UI cannot upload a folder, zip the contents first and use a supported deploy flow or connect a GitHub repository).
3. Open the resulting Netlify URL and test the homepage on your phone.
4. Visit `/admin.html`, enter the Supabase URL and public key, then log in with the admin account.

## Step C — database-backed booking form (next code change required)
Before launch, the public form handler in `app.js` must be updated to insert a row into `public.bookings` via the Supabase JS client, then optionally open WhatsApp. Add spam protection/rate limiting and test validation. Until that integration is added, bookings are WhatsApp-only and won't appear in the admin database.

## Security warning
The SQL file is a starter, not a final production security audit. Its authenticated read/update policy is broad. Before storing real customer data, disable public account signups and preferably replace these policies with an explicit admin allow-list (specific auth UID or admin-role table). Test with a separate non-admin account. Never expose a service-role key. Free hosting/database plans have limits and may change.

## Business details included
- Name: SAFF SAFAII PUNE
- WhatsApp: 8484915002
- Guide prices: 1 BHK ₹4,000 / ₹5,500–₹6,000 with walls; 2 BHK ₹4,500 / ₹7,500; 3 BHK ₹6,000 / ₹9,000; 4 BHK ₹8,000 / ₹12,000.

Confirm current pricing and service scope before public launch. Replace stock images with your own genuine work photos and add real reviews only with permission.
