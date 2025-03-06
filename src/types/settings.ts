import { UserPreferences, UserSettings } from './userData';

export class SettingsManager {
    private static readonly DEFAULT_SETTINGS: UserSettings = {
        privacy: {
            profileVisibility: 'public',
            lastSeenVisibility: true,
            readReceipts: true
        },
        security: {
            twoFactorEnabled: false,
            loginAlerts: true,
            trustedDevices: []
        }
    };

    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'system',
        language: 'en',
        notifications: {
            email: true,
            push: true,
            sound: true,
            mentions: true
        },
        accessibility: {
            fontSize: 16,
            highContrast: false,
            reducedMotion: false
        }
    };

    static async saveUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
        const mergedSettings = {
            ...this.DEFAULT_SETTINGS,
            ...settings
        };
        
        await supabase
            .from('user_settings')
            .upsert({ user_id: userId, settings: mergedSettings });
    }

    static async getUserSettings(userId: string): Promise<UserSettings> {
        const { data, error } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return this.DEFAULT_SETTINGS;
        }

        return {
            ...this.DEFAULT_SETTINGS,
            ...data.settings
        };
    }

    static applyTheme(theme: UserPreferences['theme']): void {
        const root = document.documentElement;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const isDark = theme === 'system' ? prefersDark : theme === 'dark';
        
        root.classList.toggle('dark', isDark);
    }

    static initializeSettings(): void {
        const userSettings = CookieManager.getCookie('user_preferences');
        if (userSettings) {
            const settings = JSON.parse(userSettings);
            this.applyTheme(settings.theme);
        } else {
            this.applyTheme(this.DEFAULT_PREFERENCES.theme);
        }
    }
}

export const initializeUserSettings = async (userId: string): Promise<void> => {
    const settings = await SettingsManager.getUserSettings(userId);
    CookieManager.setCookie('user_preferences', JSON.stringify(settings));
    SettingsManager.initializeSettings();
};
