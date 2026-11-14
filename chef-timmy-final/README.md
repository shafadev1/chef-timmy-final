# Website Portofolio Chef Timmy Pramudyo

Next.js + Tailwind CSS + Supabase. Konsep: serba hitam-putih, warna hanya dari foto makanan.

## Menjalankan di komputer

Butuh Node.js 22 atau lebih baru.

1. `npm install`
2. Salin `.env.local.example` menjadi `.env.local`, lalu isi (lihat bagian di bawah).
3. `npm run dev`, buka http://localhost:3000
4. Panel admin: http://localhost:3000/admin

## Setup Supabase (sekali saja)

1. Buat project di supabase.com.
2. SQL Editor: jalankan berurutan isi folder `supabase/`:
   `supabase-schema.sql`, `supabase-schema-additions.sql`, `supabase-schema-experience.sql`, `supabase-seed-cv.sql`, `supabase-schema-consulting.sql`, `supabase-schema-gallery-featured.sql`.
3. Authentication > Users > Add user: buat akun admin (email + password). Centang auto-confirm.
4. Jadikan akun itu admin (SQL Editor, ganti emailnya):

       insert into admins (user_id)
       select id from auth.users where email = 'email-admin@contoh.com';

5. Project Settings > API: salin Project URL dan anon key ke `.env.local`.

## Notifikasi email (Resend)

1. Daftar di resend.com, buat API key.
2. Isi di `.env.local`: `RESEND_API_KEY`, `NOTIFY_EMAIL` (email Chef), `NEXT_PUBLIC_SITE_URL`.
3. Sebelum domain diverifikasi di Resend, email hanya bisa dikirim ke alamat email pemilik akun Resend.
   Untuk mengirim ke email lain, verifikasi domain lalu ubah `RESEND_FROM`.

Tanpa pengaturan ini, request tetap tersimpan di database dan muncul di panel admin, hanya saja tidak ada email.

## Foto

- Foto hero: unggah lewat Admin > Site Content, atau simpan sebagai `public/images/hero.png` sebagai cadangan.
- Foto galeri: Admin > Gallery > Upload photos (bisa banyak sekaligus, otomatis diperkecil). Tombol bintang memilih 6 foto yang tampil di Home.
- CV dan autobiography: Admin > Site Content > Documents.
- Potret otomatis hitam-putih (class `photo-bw`), foto makanan selalu berwarna (class `photo-food`).

## Isi panel admin

Dashboard, Bookings (status, balas via WhatsApp/email, hapus), Site Content (teks, foto, link, PDF autobiografi),
Consulting Enquiries, Consulting Services, Consulting Process, Gallery, Packages, Sample Menus, FAQ, Highlights (angka pencapaian), Experience.

## Halaman publik

Home, Gallery (semua foto, filter kategori, lightbox), Private Chef, Consulting, Experience, Downloads (CV dan autobiography PDF).

## Belum dibuat

My Story per bab (tabel `story_chapters` sudah ada di database, belum ada halaman dan editornya) dan 
