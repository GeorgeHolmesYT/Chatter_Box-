import CryptoJS from 'crypto-js';

export class CookieManager {
    static ENCRYPTION_KEY = import.meta.env.VITE_COOKIE_SECRET;
    
    static setCookie(name, value, days = 7, secure = true) {
        const encryptedValue = this.encrypt(value);
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        
        const cookie = `${name}=${encryptedValue};expires=${date.toUTCString()};path=/;SameSite=Strict${secure ? ';Secure' : ''}`;
        document.cookie = cookie;
    }

    static setUserCookies(userData) {
        this.setCookie('username', userData.username);
        this.setCookie('dob', userData.dateOfBirth);
        this.setCookie('created_at', new Date().toISOString());
        this.setCookie('last_login', new Date().toISOString());
        this.setCookie('auth_token', userData.token, 30); // 30 days for auth token
        this.setCookie('user_id', userData.id);
        this.setCookie('user_preferences', JSON.stringify(userData.preferences));
        this.setCookie('session_id', this.generateSessionId());
    }

    static getUserCookies() {
        return {
            username: this.getCookie('username'),
            dateOfBirth: this.getCookie('dob'),
            createdAt: this.getCookie('created_at'),
            lastLogin: this.getCookie('last_login'),
            authToken: this.getCookie('auth_token'),
            userId: this.getCookie('user_id'),
            preferences: JSON.parse(this.getCookie('user_preferences') || '{}'),
            sessionId: this.getCookie('session_id')
        };
    }

    static getCookie(name) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
            if (cookieName === name) {
                return this.decrypt(cookieValue);
            }
        }
        return null;
    }

    static deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }

    static clearAllUserCookies() {
        const cookiesToClear = [
            'username',
            'dob',
            'created_at',
            'last_login',
            'auth_token',
            'user_id',
            'user_preferences',
            'session_id'
        ];
        
        cookiesToClear.forEach(cookie => this.deleteCookie(cookie));
    }

    static encrypt(value) {
        return CryptoJS.AES.encrypt(value.toString(), this.ENCRYPTION_KEY).toString();
    }

    static decrypt(encryptedValue) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, this.ENCRYPTION_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return null;
        }
    }

    static generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static updateLastLogin() {
        this.setCookie('last_login', new Date().toISOString());
    }

    static isAuthenticated() {
        return !!this.getCookie('auth_token');
    }

    static refreshAuthToken(newToken) {
        this.setCookie('auth_token', newToken, 30);
    }
}

// Usage example:
export const initializeUserSession = (userData) => {
    CookieManager.setUserCookies(userData);
};

export const logoutUser = () => {
    CookieManager.clearAllUserCookies();
};

export const refreshUserSession = (newToken) => {
    CookieManager.refreshAuthToken(newToken);
    CookieManager.updateLastLogin();
};
