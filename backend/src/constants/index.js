// API Response Messages
export const MESSAGES = {
    USER_CREATED: "User created successfully",
    LOGIN_SUCCESS: "Login successful",
    PROFILE_UPDATED: "Profile updated successfully",
    SERVER_ERROR: "Internal server error",
    USER_NOT_FOUND: "User not found",
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_EXISTS: "User with this email already exists",
    ACCESS_TOKEN_REQUIRED: "Access token required",
    INVALID_TOKEN: "Invalid or expired token",
    VALIDATION_FAILED: "Validation failed",
    ROUTE_NOT_FOUND: "Route not found"
};

// HTTP Status Codes
export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Validation Rules
export const VALIDATION_RULES = {
    MIN_NAME_LENGTH: 2,
    MIN_PASSWORD_LENGTH: 8,
    BCRYPT_SALT_ROUNDS: 12,
    TOKEN_EXPIRES_IN: '7d'
};
