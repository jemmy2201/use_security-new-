/**
 * Utility function to trim whitespace from email addresses
 * @param email - The email string that may contain whitespace
 * @returns The email string with all whitespace removed (leading, trailing, and internal spaces)
 */
export const trimEmail = (email: string): string => {
    if (!email || typeof email !== 'string') {
        return '';
    }
    // Remove all whitespace characters (spaces, tabs, newlines, etc.)
    return email.replace(/\s/g, '');
};

/**
 * Validates and trims email address
 * @param email - The email string to validate and trim
 * @returns Object with isValid boolean and trimmed email
 */
export const validateAndTrimEmail = (email: string): { isValid: boolean; email: string } => {
    const trimmedEmail = trimEmail(email);
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return {
        isValid: emailRegex.test(trimmedEmail),
        email: trimmedEmail
    };
};
