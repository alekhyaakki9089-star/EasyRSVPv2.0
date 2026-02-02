// Supabase configuration for EasyRSVP
const SUPABASE_URL = 'https://ctaihugyaskrsgizdpch.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_z3lAEWYghxH4wN-3muUrQw_mpTU9iFo';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper functions
class EasyRSVPDatabase {
    constructor() {
        this.supabase = supabase;
    }

    // User Authentication
    async signUp(email, password, userData = {}) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });
        return { data, error };
    }

    async signIn(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        return { error };
    }

    async getCurrentUser() {
        const { data: { user } } = await this.supabase.auth.getUser();
        return user;
    }

    // Invitations
    async saveInvitation(invitationData) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await this.supabase
            .from('invitations')
            .insert([{
                ...invitationData,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select();

        return { data: data?.[0], error };
    }

    async getInvitation(invitationId) {
        const { data, error } = await this.supabase
            .from('invitations')
            .select('*')
            .eq('id', invitationId)
            .single();

        return { data, error };
    }

    async getUserInvitations() {
        const user = await this.getCurrentUser();
        if (!user) return { data: [], error: null };

        const { data, error } = await this.supabase
            .from('invitations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return { data, error };
    }

    // RSVP Management
    async saveRSVP(invitationId, rsvpData) {
        const { data, error } = await this.supabase
            .from('rsvps')
            .insert([{
                invitation_id: invitationId,
                ...rsvpData,
                created_at: new Date().toISOString()
            }])
            .select();

        return { data: data?.[0], error };
    }

    async getRSVPs(invitationId) {
        const { data, error } = await this.supabase
            .from('rsvps')
            .select('*')
            .eq('invitation_id', invitationId)
            .order('created_at', { ascending: false });

        return { data, error };
    }

    async updateRSVP(rsvpId, updates) {
        const { data, error } = await this.supabase
            .from('rsvps')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', rsvpId)
            .select();

        return { data: data?.[0], error };
    }

    // Real-time subscriptions
    subscribeToRSVPs(invitationId, callback) {
        return this.supabase
            .channel(`rsvps:${invitationId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'rsvps',
                filter: `invitation_id=eq.${invitationId}`
            }, callback)
            .subscribe();
    }
}

// Global database instance
window.easyrsvpDB = new EasyRSVPDatabase();