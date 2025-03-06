import { validateForm } from './validation.js';
import { checkPasswordStrength } from './passwordStrength.js';

export class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.setupListeners();
    }

    setupListeners() {
        const passwordInput = this.form.querySelector('#password');
        const strengthIndicator = document.createElement('div');
        strengthIndicator.id = 'strengthIndicator';
        passwordInput.parentNode.appendChild(strengthIndicator);

        passwordInput.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });
    }

    updatePasswordStrength(password) {
        const strength = checkPasswordStrength(password);
        const indicator = document.getElementById('strengthIndicator');
        
        const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
        indicator.style.backgroundColor = colors[strength.score - 1];
        indicator.style.width = `${strength.score * 20}%`;
        indicator.style.height = '4px';
        indicator.style.transition = 'all 0.3s';
    }
}
