import { supabase } from '../config/supabase';
import { validateUsername, validatePassword, validateAge } from './validation';

class SignupHandler {
    private form: HTMLFormElement;
    private passwordStrengthDiv: HTMLElement;

    constructor() {
        this.form = document.getElementById('signupForm') as HTMLFormElement;
        this.passwordStrengthDiv = document.getElementById('passwordStrength') as HTMLElement;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        passwordInput.addEventListener('input', () => this.checkPasswordStrength(passwordInput.value));
    }

    private checkPasswordStrength(password: string): void {
        const result = validatePassword(password);
        this.passwordStrengthDiv.textContent = result.message;
        this.passwordStrengthDiv.className = `text-sm ${
            result.strength === 'strong' ? 'text-green-500' :
            result.strength === 'medium' ? 'text-yellow-500' :
            'text-red-500'
        }`;
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const dob = (document.getElementById('dob') as HTMLInputElement).value;

        if (!validateUsername(username)) {
            alert('Invalid username format');
            return;
        }

        if (!validateAge(dob)) {
            alert('You must be at least 13 years old to sign up');
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        date_of_birth: dob
                    }
                }
            });

            if (error) throw error;

            if (data) {
                window.location.href = '/verify-email.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create account. Please try again.');
        }
    }
}

// Initialize the signup handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupHandler();
});
