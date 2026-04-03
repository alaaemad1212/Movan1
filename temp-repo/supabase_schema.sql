-- Run this script in the Supabase SQL Editor to create the necessary tables and policies

-- 1. Create the questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    answer TEXT NOT NULL,
    sources TEXT[] DEFAULT '{}',
    "expertNotes" TEXT,
    "isVisible" BOOLEAN DEFAULT true,
    comments JSONB DEFAULT '[]',
    category TEXT
);

-- 2. Create the users table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    role TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow access
-- IMPORTANT: These policies allow public access to your data. 
-- This is necessary because the current app handles authentication manually.
-- For a production app, you should migrate to Supabase Auth.

-- Policies for questions
CREATE POLICY "Enable all access for questions" ON public.questions
    FOR ALL USING (true) WITH CHECK (true);

-- Policies for users
CREATE POLICY "Enable all access for users" ON public.users
    FOR ALL USING (true) WITH CHECK (true);
