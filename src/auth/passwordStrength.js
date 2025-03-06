export const checkPasswordStrength = (password) => {
    let strength = 0;
    const feedback = {
        score: 0,
        messages: []
    };

    // Length check
    if (password.length >= 8) {
        strength += 1;
        feedback.messages.push("Good length");
    }

    // Contains uppercase
    if (/[A-Z]/.test(password)) {
        strength += 1;
        feedback.messages.push("Has uppercase");
    }

    // Contains lowercase
    if (/[a-z]/.test(password)) {
        strength += 1;
        feedback.messages.push("Has lowercase");
    }

    // Contains numbers
    if (/[0-9]/.test(password)) {
        strength += 1;
        feedback.messages.push("Has numbers");
    }

    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
        feedback.messages.push("Has special characters");
    }

    feedback.score = strength;
    return feedback;
};
