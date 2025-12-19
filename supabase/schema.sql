
-- Supabase Schema for INA Application

-- 1. Profiles (User data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Moods (Daily/Monthly tracking)
CREATE TABLE IF NOT EXISTS public.moods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL, -- 0 to 4 (Très bien to Très mal)
    label TEXT, -- e.g., "Très bien"
    emoji TEXT, -- e.g., "😊"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Conversations (Chat history)
-- We use a JSONB field for messages for flexibility in the MVP, 
-- but a separate 'messages' table is better for large histories.
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Experts
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
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can track their own moods" ON public.moods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own saved resources" ON saved_resources FOR ALL USING (auth.uid() = user_id);

-- Journals table
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Journal settings table
CREATE TABLE journal_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  ai_access BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for Journals
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create their own journals" ON journals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own journals" ON journals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own journals" ON journals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journals" ON journals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Journal Settings
ALTER TABLE journal_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own journal settings" ON journal_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id);
