// EasyRSVP Validation Utilities
// Reusable validation functions for forms

class EasyRSVPValidator {
    // Email validation
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: emailRegex.test(email),
            message: emailRegex.test(email) ? 'Valid email address' : 'Please enter a valid email address'
        };
    }
    
    // Password validation with requirements
    static validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const allValid = Object.values(requirements).every(req => req);
        
        return {
            isValid: allValid,
            requirements: requirements,
            message: allValid ? 'Password meets all requirements' : 'Password does not meet all requirements'
        };
    }
    
    // Name validation
    static validateName(name) {
        const trimmedName = name.trim();
        const isValid = trimmedName.length >= 2 && /^[a-zA-Z\s'-]+$/.test(trimmedName);
        
        return {
            isValid: isValid,
            message: isValid ? 'Valid name' : 'Name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes'
        };
    }
    
    // Username validation
    static validateUsername(username) {
        const trimmedUsername = username.trim();
        const isValid = trimmedUsername.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(trimmedUsername);
        
        return {
            isValid: isValid,
            message: isValid ? 'Valid username' : 'Username must be at least 3 characters and contain only letters, numbers, hyphens, and underscores'
        };
    }
    
    // Phone number validation (optional)
    static validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const isValid = !phone || phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        
        return {
            isValid: isValid,
            message: isValid ? 'Valid phone number' : 'Please enter a valid phone number'
        };
    }
    
    // Required field validation
    static validateRequired(value, fieldName = 'Field') {
        const isValid = value && value.toString().trim().length > 0;
        
        return {
            isValid: isValid,
            message: isValid ? `${fieldName} is provided` : `${fieldName} is required`
        };
    }
    
    // Language selection validation
    static validateLanguage(language) {
        const validLanguages = ['english', 'telugu', 'hindi', 'gujarati', 'tamil'];
        const isValid = validLanguages.includes(language);
        
        return {
            isValid: isValid,
            message: isValid ? 'Valid language selection' : 'Please select a valid language'
        };
    }
    
    // Event type validation
    static validateEventType(eventType) {
        const validTypes = ['wedding', 'party', 'corporate', 'baby', 'other'];
        const isValid = !eventType || validTypes.includes(eventType);
        
        return {
            isValid: isValid,
            message: isValid ? 'Valid event type' : 'Please select a valid event type'
        };
    }
    
    // File validation for template uploads
    static validateFile(file, options = {}) {
        const {
            maxSize = 5 * 1024 * 1024, // 5MB default
            allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
            required = true
        } = options;
        
        if (!file) {
            return {
                isValid: !required,
                message: required ? 'Please select a file' : 'No file selected'
            };
        }
        
        // Check file type
        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                message: `File type not allowed. Please select: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`
            };
        }
        
        // Check file size
        if (file.size > maxSize) {
            const maxSizeMB = Math.round(maxSize / (1024 * 1024));
            return {
                isValid: false,
                message: `File size too large. Maximum size: ${maxSizeMB}MB`
            };
        }
        
        return {
            isValid: true,
            message: 'File is valid'
        };
    }
    
    // Confirm password validation
    static validateConfirmPassword(password, confirmPassword) {
        const isValid = password === confirmPassword && password.length > 0;
        
        return {
            isValid: isValid,
            message: isValid ? 'Passwords match' : 'Passwords do not match'
        };
    }
    
    // Terms acceptance validation
    static validateTerms(accepted) {
        return {
            isValid: accepted === true,
            message: accepted ? 'Terms accepted' : 'Please accept the Terms of Service'
        };
    }
}

// UI Helper functions for validation display
class ValidationUI {
    static showValidationMessage(elementId, message, type = 'error') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `validation-message ${type}`;
        }
    }
    
    static hideValidationMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }
    
    static setFieldState(fieldId, isValid) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('valid', 'invalid');
            if (isValid !== null) {
                field.classList.add(isValid ? 'valid' : 'invalid');
            }
        }
    }
    
    static updatePasswordRequirements(requirements) {
        const reqElements = {
            length: document.getElementById('req-length'),
            uppercase: document.getElementById('req-uppercase'),
            lowercase: document.getElementById('req-lowercase'),
            number: document.getElementById('req-number'),
            special: document.getElementById('req-special')
        };
        
        Object.keys(requirements).forEach(req => {
            if (reqElements[req]) {
                reqElements[req].classList.toggle('valid', requirements[req]);
            }
        });
    }
    
    static showLoadingState(buttonId, loadingText = 'Loading...') {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.innerHTML = `<span class="loading-spinner"></span>${loadingText}`;
        }
    }
    
    static hideLoadingState(buttonId, originalText) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = originalText;
        }
    }
}

// Common validation patterns
const ValidationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    username: /^[a-zA-Z0-9_-]+$/,
    name: /^[a-zA-Z\s'-]+$/,
    password: {
        minLength: 8,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /\d/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EasyRSVPValidator, ValidationUI, ValidationPatterns };
}