-- Supabase Schema for INA Application
-- ══════════════════════════════════════════════════════════════════════════════
-- TABLES PATIENTS (app mobile)
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Profiles (patients)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    age INTEGER,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Moods (suivi quotidien — niveau 0-4 : Très bien → Très mal)
CREATE TABLE IF NOT EXISTS public.moods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level BETWEEN 0 AND 4),
    label TEXT,
    emoji TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Conversations (historique chatbot)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Experts (liste pour affichage)
CREATE TABLE IF NOT EXISTS public.experts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    location TEXT,
    coordinates TEXT,
    image_url TEXT,
    rating DECIMAL(3,2),
    reviews_count INTEGER DEFAULT 0
);

-- 5. Appointments (RDV)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    expert_id INTEGER REFERENCES public.experts(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Saved Resources
CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    resource_title TEXT NOT NULL,
    resource_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Journals
CREATE TABLE IF NOT EXISTS public.journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  mood_level INTEGER,
  mood_label TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Journal settings (ai_access = partagé avec spécialiste/IA)
CREATE TABLE IF NOT EXISTS public.journal_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  ai_access BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Diagnostics (résultats PHQ-9, GAD-7, PSQ, etc.)
CREATE TABLE IF NOT EXISTS public.diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tool_id TEXT NOT NULL,       -- e.g. "phq9", "gad7", "psq"
  tool_name TEXT NOT NULL,     -- e.g. "PHQ-9 (Dépression)"
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  interpretation TEXT,         -- e.g. "Léger", "Modéré", "Élevé"
  answers JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLES SPÉCIALISTES
-- ══════════════════════════════════════════════════════════════════════════════

-- 10. Specialists (liés à auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.specialists (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  specialty TEXT DEFAULT 'Psychologue clinicien(ne)',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Liaison Spécialiste ↔ Patient
CREATE TABLE IF NOT EXISTS public.specialist_patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID REFERENCES public.specialists(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','warning','new','archived')),
  diagnosis TEXT,                    -- Diagnostic principal (ex : "Anxiété généralisée")
  next_appointment DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(specialist_id, patient_id)
);

-- 12. Plan de suivi (étapes par patient)
CREATE TABLE IF NOT EXISTS public.follow_up_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID REFERENCES public.specialists(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Notes privées spécialiste sur un patient
CREATE TABLE IF NOT EXISTS public.specialist_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID REFERENCES public.specialists(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialist_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialist_notes ENABLE ROW LEVEL SECURITY;

-- ── Politiques patients ────────────────────────────────────────────────────────
CREATE POLICY "patients_own_profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "patients_own_moods" ON public.moods
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "patients_own_conversations" ON public.conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "patients_own_appointments" ON public.appointments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "patients_own_saved_resources" ON public.saved_resources
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "patients_own_journals" ON public.journals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "patients_own_journal_settings" ON public.journal_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "patients_own_diagnostics" ON public.diagnostics
  FOR ALL USING (auth.uid() = user_id);

-- ── Politiques spécialistes ────────────────────────────────────────────────────

-- Spécialiste voit son propre profil
CREATE POLICY "specialists_own_profile" ON public.specialists
  FOR ALL USING (auth.uid() = id);

-- Spécialiste accède à ses patients
CREATE POLICY "specialists_view_patients" ON public.specialist_patients
  FOR ALL USING (auth.uid() = specialist_id);

-- Spécialiste voit les profils de ses patients
CREATE POLICY "specialists_read_patient_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.specialist_patients sp
      WHERE sp.specialist_id = auth.uid() AND sp.patient_id = profiles.id
    )
  );

-- Spécialiste voit les humeurs de ses patients
CREATE POLICY "specialists_read_patient_moods" ON public.moods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.specialist_patients sp
      WHERE sp.specialist_id = auth.uid() AND sp.patient_id = moods.user_id
    )
  );

-- Spécialiste voit les journaux partagés de ses patients
CREATE POLICY "specialists_read_shared_journals" ON public.journals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.specialist_patients sp
      JOIN public.journal_settings js ON js.user_id = sp.patient_id
      WHERE sp.specialist_id = auth.uid()
        AND sp.patient_id = journals.user_id
        AND js.ai_access = true
    )
  );

-- Spécialiste voit les diagnostics de ses patients
CREATE POLICY "specialists_read_patient_diagnostics" ON public.diagnostics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.specialist_patients sp
      WHERE sp.specialist_id = auth.uid() AND sp.patient_id = diagnostics.user_id
    )
  );

-- Spécialiste voit les échanges chatbot de ses patients (compte de messages)
CREATE POLICY "specialists_read_patient_conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.specialist_patients sp
      WHERE sp.specialist_id = auth.uid() AND sp.patient_id = conversations.user_id
    )
  );

-- Spécialiste gère les plans de suivi
CREATE POLICY "specialists_manage_follow_up" ON public.follow_up_items
  FOR ALL USING (auth.uid() = specialist_id);

-- Spécialiste gère ses notes privées
CREATE POLICY "specialists_manage_notes" ON public.specialist_notes
  FOR ALL USING (auth.uid() = specialist_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- DONNÉES DE DÉMO (à exécuter après la création des tables)
-- ══════════════════════════════════════════════════════════════════════════════

-- Créez d'abord un compte spécialiste via Supabase Auth (Dashboard > Authentication > Users)
-- puis exécutez ce bloc en remplaçant 'SPECIALIST_UUID' par l'UUID du compte créé :
--
-- INSERT INTO public.specialists (id, full_name, email, specialty)
-- VALUES ('SPECIALIST_UUID', 'Dr. Koné Aminata', 'kone.aminata@ina-sante.ci', 'Psychologue clinicienne');
