/**
 * Environment Variables Management
 * 
 * This module provides a secure way to access environment variables, particularly API keys.
 * In production, you would replace this with proper environment variable handling.
 * 
 * IMPORTANT: Never expose API keys in client-side JavaScript.
 * In a production environment, all API calls should be proxied through a server
 * where the API keys are stored securely.
 */

// Mock environment for development - DO NOT USE IN PRODUCTION
const ENV = {
    // Default values for local development only
    OPENAI_API_KEY: 'sk-placeholder',
    
    // Method to get environment variables safely
    get: function(key) {
        // In production, you'd implement a server-side mechanism
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
        
        // Check localStorage for development environment (NOT SECURE FOR PRODUCTION)
        // This is just for development convenience - NEVER store API keys in localStorage in production
        if (typeof localStorage !== 'undefined') {
            const value = localStorage.getItem(`env_${key}`);
            if (value) return value;
        }
        
        // Return default value or null
        return this[key] || null;
    },
    
    // Method to set environment variables temporarily (for development only)
    set: function(key, value) {
        // Only use this in development!
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`env_${key}`, value);
        }
        return value;
    }
};

/**
 * Securely access API keys
 * @param {string} service - The service name (e.g., 'openai', 'analytics')
 * @returns {string|null} The API key or null if not available
 */
function getApiKey(service) {
    switch(service.toLowerCase()) {
        case 'openai':
            return ENV.get('OPENAI_API_KEY');
        default:
            console.error(`Unknown service: ${service}`);
            return null;
    }
}

/**
 * Create a configuration object for OpenAI API
 * @returns {Object} Configuration object with headers and authorization
 */
function getOpenAIConfig() {
    const apiKey = getApiKey('openai');
    
    if (!apiKey || apiKey === 'sk-placeholder') {
        console.warn('OpenAI API key not configured. Please set a valid API key.');
    }
    
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getApiKey,
        getOpenAIConfig
    };
}