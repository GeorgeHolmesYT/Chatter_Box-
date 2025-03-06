export interface UserData {
    id: string;
    username: string;
    email: string;
    dateOfBirth: string;
    createdAt: string;
    lastLogin: string;
    preferences: UserPreferences;
    profile: UserProfile;
    settings: UserSettings;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: NotificationSettings;
    accessibility: AccessibilitySettings;
}

export interface UserProfile {
    displayName: string;
    avatar: string;
    bio: string;
    status: 'online' | 'away' | 'offline' | 'dnd';
    customStatus?: string;
}

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    sound: boolean;
    mentions: boolean;
}

export interface AccessibilitySettings {
    fontSize: number;
    highContrast: boolean;
    reducedMotion: boolean;
}

export interface UserSettings {
    privacy: PrivacySettings;
    security: SecuritySettings;
}

export interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    lastSeenVisibility: boolean;
    readReceipts: boolean;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    trustedDevices: string[];
}
