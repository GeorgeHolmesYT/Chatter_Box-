import { supabase } from '../config/supabase.js';
import { CookieManager } from '../utils/cookies.js';
import { SettingsManager } from '../types/settings.js';
import { redirectToDashboard } from './authRedirects.js';

class LoginHandler {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.initializeListeners();
    }

    initializeListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Social login handlers
        document.querySelectorAll('[data-social-login]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleSocialLogin(e.target.dataset.provider);
            });
        });
    }

    async handleLogin() {
        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        try {
            const { data, error } = await this.loginUser(identifier, password);
            
            if (error) throw error;

            if (data.user) {
                await this.setupUserSession(data.user, remember);
                redirectToDashboard();
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    async loginUser(identifier, password) {
        // Try email login first
        if (identifier.includes('@')) {
            return await supabase.auth.signInWithPassword({
                email: identifier,
                password: password
            });
        }

        // If not email, try username login
        const { data: userData } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .single();

        if (userData) {
            return await supabase.auth.signInWithPassword({
                email: userData.email,
                password: password
            });
        }

        throw new Error('Invalid credentials');
    }

    async setupUserSession(user, remember) {
        const userData = {
            id: user.id,
            email: user.email,
            username: user.user_metadata.username,
            created_at: user.created_at,
            last_login: new Date().toISOString()
        };

        // Set cookies with appropriate expiration
        const cookieDuration = remember ? 30 : 1; // 30 days if remember me, 1 day if not
        CookieManager.setUserCookies({
            ...userData,
            token: user.session.access_token
        }, cookieDuration);

        // Initialize user settings
        await SettingsManager.initializeUserSettings(user.id);

        // Update last login in database
        await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);
    }

    async handleSocialLogin(provider) {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider
            });

            if (error) throw error;

            if (data) {
                await this.setupUserSession(data.user, true);
                redirectToDashboard();
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-500 text-white p-3 rounded mt-4';
        errorDiv.textContent = message;
        this.form.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Initialize login handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginHandler();
});
