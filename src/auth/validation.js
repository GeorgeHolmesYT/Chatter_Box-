export const validateForm = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: emailRegex.test(email),
            message: emailRegex.test(email) ? '' : 'Invalid email format'
        };
    },

    username: (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return {
            isValid: usernameRegex.test(username),
            message: usernameRegex.test(username) ? '' : 'Username must be 3-20 characters, alphanumeric and underscores only'
        };
    },

    password: (password) => {
        const requirements = {
            minLength: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const isValid = Object.values(requirements).every(Boolean);
        return {
            isValid,
            requirements,
            message: isValid ? '' : 'Password does not meet requirements'
        };
    },

    dateOfBirth: (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        return {
            isValid: age >= 13,
            message: age >= 13 ? '' : 'Must be 13 or older to register'
        };
    }
};
