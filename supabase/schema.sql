-- ======================================================
-- ABY TRIP TRACKER - PRACTICAL LOGISTICS (FULL RESET)
-- ======================================================
-- Fokus: Keuangan (Budget) & Kesiapan Barang (Checklist)
-- Serta sistem verifikasi setoran oleh Admin.

-- 1. BERSIHKAN SEMUA DATA LAMA (WIPE)
DROP TABLE IF EXISTS public.checklists CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.itinerary CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.poll_options CASCADE;
DROP TABLE IF EXISTS public.polls CASCADE;
DROP TABLE IF EXISTS public.contributions CASCADE;
DROP TABLE IF EXISTS public.weeks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. KONFIGURASI TABEL UTAMA

-- Profiles: Media penyimpanan personil
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  bio TEXT DEFAULT 'Ready for Lampung!',
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Weeks: Target tabungan per minggu
CREATE TABLE public.weeks (
  id SERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_amount INTEGER DEFAULT 35000
);

-- Contributions: Catatan setoran member (Honesty based with Admin Verification)
CREATE TABLE public.contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_id INTEGER REFERENCES public.weeks(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, week_id)
);

-- 3. LOGISTIK & BUDGET

-- Budgets: Rincian biaya pengeluaran grup
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'Villa', 'Transport', 'Makan', etc.
  allocated INTEGER DEFAULT 0,
  spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Checklists: Barang bawaan kelompok
CREATE TABLE public.checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT DEFAULT 'Umum', -- 'Obat-obatan', 'Elektronik', etc.
  is_packed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. POLLING & ITINERARY (Tetap ada karena penting)

CREATE TABLE public.polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL
);

CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(poll_id, user_id)
);

CREATE TABLE public.itinerary (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  time_range TEXT,
  activity TEXT NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. SEED DATA AWAL (WEEKS)
INSERT INTO public.weeks (id, start_date, end_date, target_amount) VALUES
(1, '2026-04-20', '2026-04-26', 35000),
(2, '2026-04-27', '2026-05-03', 35000),
(3, '2026-05-04', '2026-05-10', 35000),
(4, '2026-05-11', '2026-05-17', 35000),
(5, '2026-05-18', '2026-05-24', 35000),
(6, '2026-05-25', '2026-05-31', 35000);

-- 6. NONAKTIFKAN KEAMANAN (DISABLE RLS)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary DISABLE ROW LEVEL SECURITY;

-- 7. REFRESH CACHE
NOTIFY pgrst, 'reload schema';
