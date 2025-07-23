/**
 * Hoopscope API Integration Module
 * Handles all API interactions for the Hoopscope platform
 * 
 * @version 1.0.0
 * @author Hoopscope Development Team
 */

// API Configuration
const API_CONFIG = {
    openai: {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o',
        temperature: 0.7
    }
};

// Error messages
const ERROR_MESSAGES = {
    MISSING_API_KEY: 'API key is missing. Please configure your environment variables.',
    API_REQUEST_FAILED: 'API request failed',
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    INVALID_RESPONSE: 'Received invalid response from the API.'
};

/**
 * Safely get environment variables
 * In production, this would be implemented using proper environment variable handling
 * 
 * @param {string} key - The environment variable key
 * @returns {string} The environment variable value or empty string if not found
 */
const getEnvVar = (key) => {
    // This would be replaced with proper environment variable handling
    // Using process.env in Node.js or other secure methods
    return {
        // API keys should be stored in environment variables, not hardcoded
        'OPENAI_API_KEY': process.env.OPENAI_API_KEY || ''
    }[key] || '';
};

/**
 * Call the OpenAI API with proper error handling
 * 
 * @param {string} prompt - The user prompt
 * @param {string|null} systemMessage - Optional system message to set context
 * @returns {Promise<Object>} Object containing either result or error
 */
export const callOpenAIAPI = async (prompt, systemMessage = null) => {
    const apiKey = getEnvVar('OPENAI_API_KEY');
    
    if (!apiKey) {
        console.error(ERROR_MESSAGES.MISSING_API_KEY);
        return { error: ERROR_MESSAGES.MISSING_API_KEY };
    }
    
    try {
        // Prepare messages array
        const messages = [];
        
        // Add system message if provided
        if (systemMessage) {
            messages.push({ role: 'system', content: systemMessage });
        }
        
        // Add user message
        messages.push({ role: 'user', content: prompt });
        
        // Make API request
        const response = await fetch(API_CONFIG.openai.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.openai.model,
                messages: messages,
                temperature: API_CONFIG.openai.temperature
            })
        });
        
        // Handle non-successful responses
        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            return { 
                error: `${ERROR_MESSAGES.API_REQUEST_FAILED}: ${errorData.error?.message || 'Unknown error'}`,
                status: response.status
            };
        }
        
        // Parse successful response
        const data = await response.json();
        
        // Validate response structure
        if (!data.choices?.[0]?.message?.content) {
            return { error: ERROR_MESSAGES.INVALID_RESPONSE };
        }
        
        return { result: data.choices[0].message.content };
        
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return { 
            error: `${ERROR_MESSAGES.NETWORK_ERROR} ${error.message}`,
            isNetworkError: true
        };
    }
};

/**
 * Generate a basketball workout plan based on user input
 * 
 * @param {string} userInput - The user's workout requirements
 * @returns {Promise<Object>} The workout plan or error
 */
export const generateWorkoutPlan = async (userInput) => {
    const systemPrompt = `You are a professional basketball trainer with expertise in creating 
        personalized workout plans. Generate a detailed plan that matches the player's goals, 
        available time, and equipment.`;
    
    const userPrompt = `Create a detailed basketball workout plan based on the following request: 
        "${userInput}". Structure the response as JSON with the following format:
        {
            "planTitle": "Title of the workout plan",
            "duration": "Total estimated duration",
            "phases": [
                {
                    "phaseTitle": "Name of the phase (e.g., Warmup, Skill Work)",
                    "exercises": [
                        {
                            "name": "Name of exercise",
                            "details": "Description including reps/duration"
                        }
                    ]
                }
            ]
        }`;
    
    return await callOpenAIAPI(userPrompt, systemPrompt);
};

/**
 * Analyze blog article content and generate a summary
 * 
 * @param {string} articleContent - The content of the article
 * @returns {Promise<Object>} Summary or error
 */
export const generateArticleSummary = async (articleContent) => {
    const prompt = `Summarize the following basketball article in 3-5 key bullet points:
        
        ${articleContent}
        
        Focus on the most important technical insights and actionable advice.`;
    
    return await callOpenAIAPI(prompt);
};

/**
 * Answer user questions about a specific article
 * 
 * @param {string} userQuestion - The user's question
 * @param {string} articleContent - The content of the article
 * @returns {Promise<Object>} Answer or error
 */
export const answerArticleQuestion = async (userQuestion, articleContent) => {
    const systemPrompt = `You are a basketball analytics expert helping explain concepts from an article.
        Base your answers only on the information provided in the article. If the article doesn't 
        contain relevant information to answer the question, acknowledge that limitation.`;
    
    const prompt = `Based on the article provided, answer the following question: "${userQuestion}"
        
        Article content:
        ${articleContent}`;
    
    return await callOpenAIAPI(prompt, systemPrompt);
};

/**
 * Mock API for development to avoid API costs
 * This should be replaced with real API calls in production
 * 
 * @param {string} prompt - The user prompt
 * @returns {Promise<Object>} Mock response
 */
export const mockOpenAIAPI = async (prompt) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock response based on prompt keywords
    if (prompt.includes('workout') || prompt.includes('training') || prompt.includes('exercise')) {
        return {
            result: JSON.stringify({
                planTitle: "Ball Handling & Finishing Mastery",
                duration: "60 Minutes",
                phases: [
                    {
                        phaseTitle: "Warmup (10 minutes)",
                        exercises: [
                            {
                                name: "Dynamic Stretching",
                                details: "Arm circles, leg swings, hip rotations - 30 seconds each"
                            },
                            {
                                name: "Light Jogging",
                                details: "2 minutes around the court to increase heart rate"
                            },
                            {
                                name: "Stationary Dribbling",
                                details: "1 minute each hand, focus on feel and control"
                            }
                        ]
                    },
                    {
                        phaseTitle: "Ball Handling (20 minutes)",
                        exercises: [
                            {
                                name: "Cone Weave Dribbling",
                                details: "Set up 5 cones in a line, practice crossovers through cones - 4 sets"
                            },
                            {
                                name: "Two-Ball Dribbling",
                                details: "Dribble two balls simultaneously at different heights - 3 sets of 45 seconds"
                            },
                            {
                                name: "Hesitation & Change of Pace",
                                details: "Practice speed changes with single cone as defender - 5 minutes"
                            }
                        ]
                    },
                    {
                        phaseTitle: "Finishing Drills (25 minutes)",
                        exercises: [
                            {
                                name: "Mikan Drill",
                                details: "Alternating layups from both sides - 2 sets of 20 makes"
                            },
                            {
                                name: "Euro-Step Finishes",
                                details: "Practice Euro-step around cone to finish at rim - 3 minutes each side"
                            },
                            {
                                name: "Floater Package",
                                details: "Work on floaters from different angles - 5 minutes"
                            },
                            {
                                name: "Contact Finishing",
                                details: "Use foam pad or chair as defender, finish through contact - 8 minutes"
                            }
                        ]
                    },
                    {
                        phaseTitle: "Cooldown (5 minutes)",
                        exercises: [
                            {
                                name: "Free Throws",
                                details: "10 free throws while breathing and recovering"
                            },
                            {
                                name: "Static Stretching",
                                details: "Focus on forearms, wrists, and legs - hold each stretch for 30 seconds"
                            }
                        ]
                    }
                ]
            })
        };
    } else if (prompt.includes('article') || prompt.includes('blog')) {
        return {
            result: "Here are the key points from this basketball article:\n\n• Ball handling is rooted in biomechanics, not just natural talent\n• Lowering your center of gravity by bending knees creates stability and quicker dribbles\n• Elite dribblers push the ball rather than slap it, maintaining constant contact\n• The finger pads provide precision control while the palm offers power"
        };
    } else {
        return {
            result: "I've analyzed your request and have some insights to share. Basketball is a game of skill, strategy, and athletic ability. The best players combine natural talent with dedicated practice and strategic understanding of the game."
        };
    }
};