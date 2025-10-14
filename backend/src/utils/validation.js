export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
};

export const validateSignupInput = (name, email, password) => {
    const errors = [];

    if (!email) {
        errors.push("Email is required");
    } else if (!validateEmail(email)) {
        errors.push("Invalid email format");
    }

    if (!password) {
        errors.push("Password is required");
    } else if (!validatePassword(password)) {
        errors.push("Password must be at least 8 characters with at least one letter and one number");
    }

    if (name && name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateLoginInput = (email, password) => {
    const errors = [];

    if (!email) {
        errors.push("Email is required");
    } else if (!validateEmail(email)) {
        errors.push("Invalid email format");
    }

    if (!password) {
        errors.push("Password is required");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
