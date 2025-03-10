/**
 * Generates a secure random password
 * @param {number} length - The length of the password
 * @returns {string} - The generated password
 */
function generateSecurePassword(length = 16) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    
    // Ensure at least one character from each category
    password += getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    password += getRandomChar("abcdefghijklmnopqrstuvwxyz");
    password += getRandomChar("0123456789");
    password += getRandomChar("!@#$%^&*()-_=+");
    
    // Fill the rest of the password
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    // Shuffle the password
    return shuffleString(password);
}

/**
 * Gets a random character from a string
 * @param {string} characters - The characters to choose from
 * @returns {string} - A random character
 */
function getRandomChar(characters) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
}

/**
 * Shuffles a string
 * @param {string} str - The string to shuffle
 * @returns {string} - The shuffled string
 */
function shuffleString(str) {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

/**
 * Copies text to clipboard
 * @param {string} elementId - The ID of the element containing the text to copy
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            // Show a temporary "Copied!" tooltip or notification
            const originalText = element.textContent;
            element.textContent = "Copied!";
            setTimeout(() => {
                element.textContent = originalText;
            }, 1000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

/**
 * Shows an error message
 * @param {string} elementId - The ID of the element to show the error in
 * @param {string} message - The error message
 */
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.remove("hidden");
    element.classList.add("error-message");
}

/**
 * Shows a success message
 * @param {string} elementId - The ID of the element to show the success message in
 * @param {string} message - The success message
 */
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.remove("hidden", "error-message");
    element.classList.add("alert", "success");
}

/**
 * Clears a message
 * @param {string} elementId - The ID of the element to clear
 */
function clearMessage(elementId) {
    const element = document.getElementById(elementId);
    element.textContent = "";
    element.classList.add("hidden");
}