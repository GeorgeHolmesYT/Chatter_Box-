export interface SignupData {
    username: string;
    email: string;
    password: string;
    dateOfBirth: string;
}

export interface PasswordValidationResult {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    message: string;
}
