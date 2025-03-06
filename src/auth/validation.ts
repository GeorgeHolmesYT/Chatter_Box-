export const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

export const validatePassword = (password: string): {
    isValid: boolean;
    strength: string;
    message: string;
} => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let strength = 'weak';
    let message = 'Password is too weak';
    
    if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers) {
        strength = 'medium';
        message = 'Password strength: Medium';
    }
    
    if (password.length >= 12 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) {
        strength = 'strong';
        message = 'Password strength: Strong';
    }

    return {
        isValid: password.length >= 8,
        strength,
        message
    };
};

export const validateAge = (dob: string): boolean => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age >= 13;
};
