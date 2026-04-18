-- SEED DATA - PRACTICAL LOGISTICS
-- 1 Admin + 12 Members

-- 1. Bersihkan tabel profiles
TRUNCATE public.profiles CASCADE;

-- 2. Insert 1 Admin + 12 Member Inti
INSERT INTO public.profiles (username, password, name, role) VALUES
('admin', 'marshal', 'Admin', 'admin'),
('marshal', 'aby123', 'Marshal', 'member'),
('rifqi', 'aby123', 'Rifqi', 'member'),
('hashif', 'aby123', 'Hashif', 'member'),
('zaki', 'aby123', 'Zaki', 'member'),
('ziehan', 'aby123', 'Ziehan', 'member'),
('dafa', 'aby123', 'Dafa', 'member'),
('yusri', 'aby123', 'Yusri', 'member'),
('caesar', 'aby123', 'Caesar', 'member'),
('david', 'aby123', 'David', 'member'),
('nico', 'aby123', 'Nico', 'member'),
('zul', 'aby123', 'Zul', 'member'),
('zahir', 'aby123', 'Zahir', 'member');

-- 3. Seed Budgets (Alokasi Dana Kas)
INSERT INTO public.budgets (category, allocated, spent) VALUES
('Sewa Villa', 1200000, 0),
('Bensin & Tol', 400000, 0),
('Makan & Konsumsi', 600000, 0),
('Tiket & Wisata', 250000, 0),
('Dana Darurat', 70000, 0);

-- 4. Seed Checklist (Barang Bawaan Kelompok)
INSERT INTO public.checklists (item_name, category, is_packed) VALUES
('Obat-obatan Umum', 'Kesehatan', false),
('Powerbank & Terminal', 'Elektronik', true),
('Snack Ringan & Minuman', 'Konsumsi', false),
('Alat Snorkeling', 'Hobi', false),
('Sunblock & Moisturizer', 'Skin Care', false),
('Speaker Bluetooth', 'Hiburan', true);

-- 5. Seed Itinerary
INSERT INTO public.itinerary (day, time_range, activity, location, description) VALUES
(1, '08:00 - 10:00', 'Kumpul & Berangkat', 'Meeting Point Jakarta', 'Kumpul di gerbang Tol buat berangkat bareng.'),
(1, '13:00 - 15:00', 'Check-in Villa', 'Lampung Private Villa', 'Istirahat sejenak sambil nikmatin welcome drink.'),
(2, '09:00 - 12:00', 'Island Hopping', 'Pulau Pahawang', 'Snorkeling dan foto-foto underwater.'),
(3, '10:00 - 13:00', 'Cari Oleh-oleh', 'Pusat Kota', 'Beli keripik pisang khas Lampung sebelum pulang.');

-- 6. Insert Initial Contribution (For Verification Test)
INSERT INTO public.contributions (user_id, week_id, amount, is_verified) VALUES
((SELECT id FROM public.profiles WHERE username = 'marshal' LIMIT 1), 1, 35000, false);
