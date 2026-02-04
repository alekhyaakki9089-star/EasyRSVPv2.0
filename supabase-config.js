// Supabase configuration for EasyRSVP
const SUPABASE_URL = 'https://ctaihugyaskrsgizdpch.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YWlodWd5YXNrcnNnaXpkcGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODU3MDksImV4cCI6MjA4NTU2MTcwOX0.A6SZlQ0r6IWxKm4oRxz4wWT8lAoK7Sg8Wodx0yvK7gI';

// Initialize Supabase client with proper error handling
let supabaseClient;

function initializeSupabase() {
    try {
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase library not loaded yet');
            return false;
        }

        const { createClient } = supabase;
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true
            }
        });

        console.log('✅ Supabase client initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase client:', error);
        return false;
    }
}

// Database helper functions
class EasyRSVPDatabase {
    constructor() {
        this.supabase = null;
        this.init();
    }

    async init() {
        console.log('🔧 Initializing EasyRSVP Database...');
        
        // Wait for Supabase to be available and initialize client
        let attempts = 0;
        while (!supabaseClient && attempts < 20) {
            if (initializeSupabase()) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!supabaseClient) {
            console.error('❌ Failed to initialize Supabase client after multiple attempts');
            return;
        }

        this.supabase = supabaseClient;
        
        // Test connection
        try {
            const { data, error } = await this.supabase.from('invitations').select('count').limit(1);
            if (error) {
                console.error('❌ Database connection failed:', error);
            } else {
                console.log('✅ Database connection successful');
            }
        } catch (err) {
            console.error('❌ Database initialization error:', err);
        }
    }

    // User Authentication
    async signUp(email, password, userData = {}) {
        console.log('🔐 Attempting sign up for:', email);
        
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData,
                emailRedirectTo: undefined // Disable email verification redirect
            }
        });
        
        if (error) {
            console.error('❌ Sign up error:', error);
        } else {
            console.log('✅ Sign up successful:', data);
            
            // Create user profile record if signup was successful
            if (data.user && data.user.id) {
                try {
                    await this.createUserProfile(data.user.id, {
                        full_name: userData.full_name || 'User',
                        language: userData.language || 'english',
                        event_type: userData.event_type || 'wedding',
                        newsletter: userData.newsletter || false
                    });
                } catch (profileError) {
                    console.warn('⚠️ User profile creation failed:', profileError);
                    // Don't fail the signup if profile creation fails
                }
            }
            
            // For development: Auto-confirm user if email verification is disabled
            if (data.user && !data.user.email_confirmed_at) {
                console.log('ℹ️ User created without email verification');
            }
        }
        
        return { data, error };
    }

    async signIn(email, password) {
        console.log('🔐 Attempting sign in for:', email);
        
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            console.error('❌ Sign in error:', error);
        } else {
            console.log('✅ Sign in successful:', data);
        }
        
        return { data, error };
    }

    async signOut() {
        console.log('🔐 Signing out...');
        const { error } = await this.supabase.auth.signOut();
        
        if (error) {
            console.error('❌ Sign out error:', error);
        } else {
            console.log('✅ Sign out successful');
        }
        
        return { error };
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error) {
                console.error('❌ Get user error:', error);
                return null;
            }
            
            return user;
        } catch (err) {
            console.error('❌ Get current user failed:', err);
            return null;
        }
    }

    // Invitations
    async saveInvitation(invitationData) {
        console.log('💾 Saving invitation:', invitationData);
        
        try {
            const user = await this.getCurrentUser();
            
            if (!user) {
                console.error('❌ User not authenticated');
                throw new Error('User not authenticated. Please sign in first.');
            }

            console.log('👤 Current user:', user.email);

            const dataToInsert = {
                ...invitationData,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            console.log('📝 Data to insert:', dataToInsert);

            const { data, error } = await this.supabase
                .from('invitations')
                .insert([dataToInsert])
                .select()
                .single();

            if (error) {
                console.error('❌ Insert error:', error);
                throw error;
            }

            console.log('✅ Invitation saved successfully:', data);
            return { data, error: null };

        } catch (err) {
            console.error('❌ Save invitation failed:', err);
            return { data: null, error: err };
        }
    }

    async getInvitation(invitationId) {
        console.log('📖 Getting invitation:', invitationId);
        
        const { data, error } = await this.supabase
            .from('invitations')
            .select('*')
            .eq('id', invitationId)
            .single();

        if (error) {
            console.error('❌ Get invitation error:', error);
        } else {
            console.log('✅ Invitation retrieved:', data);
        }

        return { data, error };
    }

    async getUserInvitations() {
        console.log('📋 Getting user invitations...');
        
        const user = await this.getCurrentUser();
        if (!user) {
            console.log('⚠️ No user authenticated');
            return { data: [], error: null };
        }

        const { data, error } = await this.supabase
            .from('invitations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Get user invitations error:', error);
        } else {
            console.log('✅ User invitations retrieved:', data?.length || 0, 'items');
        }

        return { data, error };
    }

    // RSVP Management
    async saveRSVP(invitationId, rsvpData) {
        console.log('💾 Saving RSVP for invitation:', invitationId, rsvpData);
        
        const dataToInsert = {
            invitation_id: invitationId,
            ...rsvpData,
            created_at: new Date().toISOString()
        };

        const { data, error } = await this.supabase
            .from('rsvps')
            .insert([dataToInsert])
            .select()
            .single();

        if (error) {
            console.error('❌ Save RSVP error:', error);
        } else {
            console.log('✅ RSVP saved successfully:', data);
        }

        return { data, error };
    }

    async getRSVPs(invitationId) {
        console.log('📋 Getting RSVPs for invitation:', invitationId);
        
        const { data, error } = await this.supabase
            .from('rsvps')
            .select('*')
            .eq('invitation_id', invitationId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Get RSVPs error:', error);
        } else {
            console.log('✅ RSVPs retrieved:', data?.length || 0, 'items');
        }

        return { data, error };
    }

    async updateRSVP(rsvpId, updates) {
        console.log('🔄 Updating RSVP:', rsvpId, updates);
        
        const { data, error } = await this.supabase
            .from('rsvps')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', rsvpId)
            .select()
            .single();

        if (error) {
            console.error('❌ Update RSVP error:', error);
        } else {
            console.log('✅ RSVP updated successfully:', data);
        }

        return { data, error };
    }

    // Real-time subscriptions
    subscribeToRSVPs(invitationId, callback) {
        console.log('🔔 Subscribing to RSVPs for invitation:', invitationId);
        
        return this.supabase
            .channel(`rsvps:${invitationId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'rsvps',
                filter: `invitation_id=eq.${invitationId}`
            }, (payload) => {
                console.log('🔔 RSVP update received:', payload);
                callback(payload);
            })
            .subscribe();
    }

    // User Profile Management
    async createUserProfile(userId, profileData) {
        console.log('👤 Creating user profile for:', userId);
        
        const dataToInsert = {
            id: userId,
            full_name: profileData.full_name || 'User',
            language: profileData.language || 'english',
            event_type: profileData.event_type || 'wedding',
            newsletter: profileData.newsletter || false,
            subscription_tier: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await this.supabase
            .from('user_profiles')
            .insert([dataToInsert])
            .select()
            .single();

        if (error) {
            console.error('❌ Create user profile error:', error);
            throw error;
        }

        console.log('✅ User profile created successfully:', data);
        return { data, error: null };
    }

    async getUserProfile(userId) {
        console.log('📖 Getting user profile for:', userId);
        
        const { data, error } = await this.supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('❌ Get user profile error:', error);
        } else {
            console.log('✅ User profile retrieved:', data);
        }

        return { data, error };
    }

    async updateUserProfile(userId, updates) {
        console.log('🔄 Updating user profile:', userId, updates);
        
        const { data, error } = await this.supabase
            .from('user_profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('❌ Update user profile error:', error);
        } else {
            console.log('✅ User profile updated successfully:', data);
        }

        return { data, error };
    }

    async getAllUserProfiles() {
        console.log('📋 Getting all user profiles...');
        
        const { data, error } = await this.supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Get all user profiles error:', error);
        } else {
            console.log('✅ User profiles retrieved:', data?.length || 0, 'profiles');
        }

        return { data, error };
    }

    // Utility method to create missing user profiles for existing auth users
    async createMissingUserProfiles() {
        console.log('🔧 Creating missing user profiles for existing users...');
        
        try {
            // Get all auth users (this requires admin privileges)
            // For now, we'll work with the current user or provide a manual method
            const currentUser = await this.getCurrentUser();
            
            if (currentUser) {
                // Check if profile exists
                const { data: existingProfile } = await this.getUserProfile(currentUser.id);
                
                if (!existingProfile) {
                    console.log('📝 Creating missing profile for current user:', currentUser.email);
                    
                    await this.createUserProfile(currentUser.id, {
                        full_name: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
                        language: currentUser.user_metadata?.language || 'english',
                        event_type: currentUser.user_metadata?.event_type || 'wedding',
                        newsletter: currentUser.user_metadata?.newsletter || false
                    });
                    
                    return { created: 1, message: 'Created profile for current user' };
                } else {
                    return { created: 0, message: 'Current user already has profile' };
                }
            }
            
            return { created: 0, message: 'No current user to create profile for' };
            
        } catch (error) {
            console.error('❌ Create missing profiles error:', error);
            throw error;
        }
    }

    // Test connection
    async testConnection() {
        console.log('🧪 Testing database connection...');
        
        try {
            const { data, error } = await this.supabase
                .from('invitations')
                .select('count')
                .limit(1);

            if (error) {
                console.error('❌ Connection test failed:', error);
                return { success: false, error };
            }

            console.log('✅ Connection test successful');
            return { success: true, data };
        } catch (err) {
            console.error('❌ Connection test error:', err);
            return { success: false, error: err };
        }
    }
}

// Global database instance - wait for proper initialization
window.easyrsvpDB = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM loaded, initializing EasyRSVP Database...');
    
    // Wait a bit for all scripts to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
        window.easyrsvpDB = new EasyRSVPDatabase();
        console.log('✅ Global easyrsvpDB instance created');
    } catch (error) {
        console.error('❌ Failed to create global database instance:', error);
    }
});

// Also create instance immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    setTimeout(async () => {
        if (!window.easyrsvpDB) {
            try {
                window.easyrsvpDB = new EasyRSVPDatabase();
                console.log('✅ Global easyrsvpDB instance created (immediate)');
            } catch (error) {
                console.error('❌ Failed to create global database instance:', error);
            }
        }
    }, 100);
}