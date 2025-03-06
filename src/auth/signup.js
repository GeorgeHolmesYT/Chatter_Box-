import { validateForm } from './validation.js';
import { FormHandler } from './formHandler.js';
import { ErrorHandler } from './errorHandler.js';
import { supabase } from '../config/supabase.js';
import { redirectToVerification } from './authRedirects.js';
import { checkUsernameAvailability } from './usernameCheck.js';

class SignupHandler extends FormHandler {
    constructor() {
        super('signupForm');
        this.initializeSignup();
    }

    initializeSignup() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });

        // Real-time username availability checking
        const usernameInput = document.getElementById('username');
        usernameInput.addEventListener('blur', async () => {
            const result = validateForm.username(usernameInput.value);
            if (result.isValid) {
                const isAvailable = await checkUsernameAvailability(usernameInput.value);
                if (!isAvailable) {
                    ErrorHandler.showError('username', 'Username already taken');
                }
            } else {
                ErrorHandler.showError('username', result.message);
            }
        });
    }

    async handleSignup() {
        const formData = this.getFormData();
        if (!this.validateAll(formData)) return;

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        username: formData.username,
                        date_of_birth: formData.dateOfBirth
                    }
                }
            });

            if (error) throw error;
            redirectToVerification();
        } catch (error) {
            ErrorHandler.showError('form', error.message);
        }
    }

    validateAll(formData) {
        let isValid = true;
        Object.entries(formData).forEach(([field, value]) => {
            const validation = validateForm[field](value);
            if (!validation.isValid) {
                ErrorHandler.showError(field, validation.message);
                isValid = false;
            }
        });
        return isValid;
    }

    getFormData() {
        return {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            dateOfBirth: document.getElementById('dob').value
        };
    }
}

// Initialize signup handler
new SignupHandler();
