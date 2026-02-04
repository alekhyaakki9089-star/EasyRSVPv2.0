-- EasyRSVP Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    date DATE NOT NULL,
    time TIME,
    venue TEXT NOT NULL,
    description TEXT,
    theme TEXT DEFAULT 'elegant',
    primary_color TEXT DEFAULT '#d4af37',
    font_family TEXT DEFAULT 'Inter',
    language TEXT DEFAULT 'english',
    background TEXT DEFAULT 'gradient',
    status TEXT DEFAULT 'draft',
    share_url TEXT,
    invitation_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no', 'maybe')),
    plus_ones INTEGER DEFAULT 0,
    dietary_restrictions TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table (optional - for extended user data)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    language TEXT DEFAULT 'english',
    event_type TEXT DEFAULT 'wedding',
    newsletter BOOLEAN DEFAULT false,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations
CREATE POLICY "Users can view their own invitations" ON invitations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invitations" ON invitations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invitations" ON invitations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invitations" ON invitations
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for RSVPs (anyone can RSVP to public invitations)
CREATE POLICY "Anyone can view RSVPs" ON rsvps
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert RSVPs" ON rsvps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Invitation owners can update RSVPs" ON rsvps
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM invitations 
            WHERE invitations.id = rsvps.invitation_id 
            AND invitations.user_id = auth.uid()
        )
    );

-- RLS Policies for user profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_created_at ON invitations(created_at);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON rsvps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();