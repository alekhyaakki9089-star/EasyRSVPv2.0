-- Update user_profiles table structure
-- Run this in your Supabase SQL Editor

-- Add missing columns to user_profiles table if they don't exist
DO $$ 
BEGIN
    -- Add language column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'language') THEN
        ALTER TABLE user_profiles ADD COLUMN language TEXT DEFAULT 'english';
    END IF;
    
    -- Add event_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'event_type') THEN
        ALTER TABLE user_profiles ADD COLUMN event_type TEXT DEFAULT 'wedding';
    END IF;
    
    -- Add newsletter column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'newsletter') THEN
        ALTER TABLE user_profiles ADD COLUMN newsletter BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create a function to automatically create user profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, language, event_type, newsletter)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'language', 'english'),
    COALESCE(new.raw_user_meta_data->>'event_type', 'wedding'),
    COALESCE((new.raw_user_meta_data->>'newsletter')::boolean, false)
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger to automatically create user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create profiles for existing users who don't have them
INSERT INTO public.user_profiles (id, full_name, language, event_type, newsletter, created_at, updated_at)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1), 'User') as full_name,
    COALESCE(au.raw_user_meta_data->>'language', 'english') as language,
    COALESCE(au.raw_user_meta_data->>'event_type', 'wedding') as event_type,
    COALESCE((au.raw_user_meta_data->>'newsletter')::boolean, false) as newsletter,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- Show results
SELECT 
    'Created profiles for existing users' as message,
    COUNT(*) as profiles_created
FROM public.user_profiles;

-- Show all user profiles
SELECT 
    up.id,
    up.full_name,
    up.language,
    up.event_type,
    up.newsletter,
    up.subscription_tier,
    au.email,
    up.created_at
FROM public.user_profiles up
JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at DESC;