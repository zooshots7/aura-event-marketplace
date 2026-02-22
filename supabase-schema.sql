-- Aura Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- unique event code for easy access
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  cover_image TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Uploads table (photos/videos)
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_type TEXT NOT NULL, -- 'photo' or 'video'
  file_url TEXT NOT NULL, -- full resolution file in Supabase Storage
  thumbnail_url TEXT, -- watermarked preview
  file_size BIGINT, -- bytes
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for videos (seconds)
  ai_tags JSONB, -- AI-generated tags from Google Vision
  metadata JSONB, -- EXIF data, location, camera info
  download_count INTEGER DEFAULT 0,
  revenue_earned DECIMAL(10,2) DEFAULT 0.00,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Downloads/Purchases table
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  upload_id UUID REFERENCES public.uploads(id) ON DELETE CASCADE NOT NULL,
  downloaded_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  payment_id TEXT, -- Razorpay payment ID
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Event members (who can upload to an event)
CREATE TABLE IF NOT EXISTS public.event_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'contributor', -- contributor, admin
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_uploads_event ON public.uploads(event_id);
CREATE INDEX IF NOT EXISTS idx_uploads_uploader ON public.uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_uploads_tags ON public.uploads USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS idx_events_code ON public.events(code);
CREATE INDEX IF NOT EXISTS idx_downloads_upload ON public.downloads(upload_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON public.downloads(downloaded_by);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users can view all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events: public events viewable by all, private only by members
CREATE POLICY "Public events are viewable by everyone"
  ON public.events FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update their events"
  ON public.events FOR UPDATE
  USING (auth.uid() = created_by);

-- Uploads: public uploads viewable by all
CREATE POLICY "Public uploads are viewable by everyone"
  ON public.uploads FOR SELECT
  USING (is_public = true OR uploaded_by = auth.uid());

CREATE POLICY "Event members can upload"
  ON public.uploads FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM public.event_members
      WHERE event_id = uploads.event_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Uploaders can update their uploads"
  ON public.uploads FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- Downloads: users can view their own downloads
CREATE POLICY "Users can view their own downloads"
  ON public.downloads FOR SELECT
  USING (auth.uid() = downloaded_by);

CREATE POLICY "Users can create downloads"
  ON public.downloads FOR INSERT
  WITH CHECK (auth.uid() = downloaded_by);

-- Event members: viewable by event members
CREATE POLICY "Event members can view members"
  ON public.event_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.event_members em
      WHERE em.event_id = event_members.event_id AND em.user_id = auth.uid()
    )
  );

CREATE POLICY "Event creators can add members"
  ON public.event_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = event_members.event_id AND created_by = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploads_updated_at BEFORE UPDATE ON public.uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage buckets (run these in Supabase Dashboard > Storage)
-- 1. Create bucket: 'event-uploads' (public)
-- 2. Create bucket: 'thumbnails' (public)

-- Storage policies (example - adjust as needed)
-- Bucket: event-uploads
-- Policy: Anyone can read
-- INSERT INTO storage.policies (name, bucket_id, definition) VALUES 
--   ('Public read access', 'event-uploads', '(bucket_id = ''event-uploads'')');
