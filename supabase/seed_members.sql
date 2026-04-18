-- SEED 12 MEMBERS - ABY TRIP TRACKER
-- Data ini untuk sistem Zero-Auth (Username/Password)

-- 1. Bersihkan tabel profiles (Opsional, agar tidak duplikat jika di-run ulang)
TRUNCATE public.profiles CASCADE;

-- 2. Insert 12 Member Inti
INSERT INTO public.profiles (username, password, name, role) VALUES
('admin', 'marshal', 'Admin', 'admin'),
('marshal', 'aby123', 'Marshal', 'member'),
('rifqi', 'aby123', 'Rifqi', 'member'),
('hashif', 'aby123', 'Hashif', 'member'),
('zaki', 'aby123', 'Zaki', 'member');

-- Seed Announcements
INSERT INTO public.announcements (title, content, type, created_by) VALUES
('Villa Secured! 🏡', 'Kita resmi bakal stay di Villa private dekat Pantai Pahawang. View-nya gokil parah!', 'success', (SELECT id FROM public.profiles WHERE username = 'admin' LIMIT 1)),
('Persiapan Snorkeling 🤿', 'Pastiin bawa alat snorkeling sendiri kalau nggak mau sewa ya guys.', 'info', (SELECT id FROM public.profiles WHERE username = 'admin' LIMIT 1));

-- Seed Itinerary
INSERT INTO public.itinerary (day, time_range, activity, location, description) VALUES
(1, '08:00 - 10:00', 'Kumpul & Berangkat', 'Meeting Point Jakarta', 'Kumpul di gerbang Tol buat berangkat bareng.'),
(1, '13:00 - 15:00', 'Check-in Villa', 'Lampung Private Villa', 'Istirahat sejenak sambil nikmatin welcome drink.'),
(2, '09:00 - 12:00', 'Island Hopping', 'Pulau Pahawang', 'Snorkeling dan foto-foto underwater.'),
(3, '10:00 - 13:00', 'Cari Oleh-oleh', 'Pusat Kota', 'Beli keripik pisang khas Lampung sebelum pulang.');

-- Seed Initial Activity Log
INSERT INTO public.activity_log (user_id, action_text, type) VALUES
((SELECT id FROM public.profiles WHERE username = 'admin' LIMIT 1), 'Baru aja nambahin itinerary baru!', 'admin'),
((SELECT id FROM public.profiles WHERE username = 'marshal' LIMIT 1), 'Udah lunasin setoran Week 1!', 'payment');

INSERT INTO public.profiles (username, password, name, role) VALUES
('ziehan', 'aby123', 'Ziehan', 'member'),
('dafa', 'aby123', 'Dafa', 'member'),
('yusri', 'aby123', 'Yusri', 'member'),
('caesar', 'aby123', 'Caesar', 'member'),
('david', 'aby123', 'David', 'member'),
('nico', 'aby123', 'Nico', 'member'),
('zul', 'aby123', 'Zul', 'member'),
('zahir', 'aby123', 'Zahir', 'member');

-- 3. Reset urutan weeks dan pastikan week 1-6 ada
-- (Dijalankan di schema.sql, tapi di sini buat mastiin aja)
INSERT INTO public.weeks (id, start_date, end_date, target_amount) VALUES
(1, '2026-04-20', '2026-04-26', 35000),
(2, '2026-04-27', '2026-05-03', 35000),
(3, '2026-05-04', '2026-05-10', 35000),
(4, '2026-05-11', '2026-05-17', 35000),
(5, '2026-05-18', '2026-05-24', 35000),
(6, '2026-05-25', '2026-05-31', 35000)
ON CONFLICT (id) DO NOTHING;
