export class ErrorHandler {
    static showError(elementId, message) {
        const errorElement = document.getElementById(`${elementId}Error`);
        if (!errorElement) {
            this.createErrorElement(elementId, message);
        } else {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    static createErrorElement(elementId, message) {
        const element = document.getElementById(elementId);
        const errorDiv = document.createElement('div');
        errorDiv.id = `${elementId}Error`;
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }

    static clearError(elementId) {
        const errorElement = document.getElementById(`${elementId}Error`);
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }
}
