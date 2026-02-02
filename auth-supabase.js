// Supabase Authentication for EasyRSVP
class EasyRSVPAuth {
    constructor() {
        this.db = window.easyrsvpDB;
        this.init();
    }

    async init() {
        // Check if user is already signed in
        const user = await this.db.getCurrentUser();
        if (user) {
            this.handleAuthSuccess(user);
        }

        // Listen for auth state changes
        this.db.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.handleAuthSuccess(session.user);
            } else if (event === 'SIGNED_OUT') {
                this.handleSignOut();
            }
        });
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.db.signIn(email, password);
            
            if (error) {
                throw error;
            }

            this.showMessage('Sign in successful! Redirecting...', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

            return { success: true, data };
        } catch (error) {
            this.showMessage(error.message, 'error');
            return { success: false, error };
        }
    }

    async signUp(email, password, fullName) {
        try {
            const { data, error } = await this.db.signUp(email, password, {
                full_name: fullName
            });
            
            if (error) {
                throw error;
            }

            this.showMessage('Account created! Please check your email to verify your account.', 'success');
            
            // Redirect to signin after delay
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 3000);

            return { success: true, data };
        } catch (error) {
            this.showMessage(error.message, 'error');
            return { success: false, error };
        }
    }

    async signOut() {
        try {
            const { error } = await this.db.signOut();
            
            if (error) {
                throw error;
            }

            this.handleSignOut();
            return { success: true };
        } catch (error) {
            this.showMessage(error.message, 'error');
            return { success: false, error };
        }
    }

    handleAuthSuccess(user) {
        // Update UI to show authenticated state
        this.updateNavigation(user);
        
        // Store user info for quick access
        localStorage.setItem('easyrsvp_user', JSON.stringify({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email
        }));
    }

    handleSignOut() {
        // Clear user data
        localStorage.removeItem('easyrsvp_user');
        
        // Update UI
        this.updateNavigation(null);
        
        // Redirect to home if on protected page
        const protectedPages = ['dashboard.html', 'template-editor.html', 'rsvp-tracker.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'index.html';
        }
    }

    updateNavigation(user) {
        const userMenuItem = document.getElementById('userMenuItem');
        const authButtons = document.getElementById('authButtons');
        
        if (user && userMenuItem) {
            // Show user menu
            userMenuItem.style.display = 'block';
            if (authButtons) authButtons.style.display = 'none';
            
            // Update user avatar and name
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            
            if (userAvatar) {
                userAvatar.textContent = (user.user_metadata?.full_name || user.email).charAt(0).toUpperCase();
            }
            
            if (userName) {
                userName.textContent = user.user_metadata?.full_name || user.email;
            }
        } else {
            // Show auth buttons
            if (userMenuItem) userMenuItem.style.display = 'none';
            if (authButtons) authButtons.style.display = 'block';
        }
    }

    showMessage(message, type = 'info') {
        const errorElement = document.getElementById('errorMessage');
        const successElement = document.getElementById('successMessage');
        
        // Clear previous messages
        if (errorElement) errorElement.textContent = '';
        if (successElement) successElement.textContent = '';
        
        // Show new message
        if (type === 'error' && errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else if (type === 'success' && successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorElement) errorElement.style.display = 'none';
            if (successElement) successElement.style.display = 'none';
        }, 5000);
    }

    // Check if user is authenticated
    async isAuthenticated() {
        const user = await this.db.getCurrentUser();
        return !!user;
    }

    // Get current user info
    async getCurrentUser() {
        return await this.db.getCurrentUser();
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.easyrsvpAuth = new EasyRSVPAuth();
    
    // Handle sign in form
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                window.easyrsvpAuth.showMessage('Please fill in all fields', 'error');
                return;
            }
            
            await window.easyrsvpAuth.signIn(email, password);
        });
    }
    
    // Handle sign up form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!fullName || !email || !password || !confirmPassword) {
                window.easyrsvpAuth.showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                window.easyrsvpAuth.showMessage('Passwords do not match', 'error');
                return;
            }
            
            await window.easyrsvpAuth.signUp(email, password, fullName);
        });
    }
    
    // Handle sign out buttons
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'signOutBtn' || e.target.classList.contains('sign-out-btn')) {
            e.preventDefault();
            await window.easyrsvpAuth.signOut();
        }
    });
});