/**
 * OpenAI API Service
 * 
 * This module provides functions to interact with the OpenAI API.
 * In a production environment, these calls should be proxied through a server
 * to keep API keys secure.
 */

/**
 * Call OpenAI API with a prompt
 * @param {string} prompt - The user's prompt
 * @param {Object} options - Additional options for the API call
 * @returns {Promise<string>} The response from the API
 */
async function callOpenAI(prompt, options = {}) {
    // In production, this would be a server-side API call
    // For this demo, we're showing the structure but using mock responses
    
    const defaultOptions = {
        model: 'gpt-4', // Using the latest available model
        temperature: 0.7,
        max_tokens: 500,
        stream: false
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        // This is where you would make the actual API call in production
        // const apiConfig = getOpenAIConfig(); // From env.js
        // const response = await fetch('https://api.openai.com/v1/chat/completions', {
        //     method: 'POST',
        //     headers: apiConfig.headers,
        //     body: JSON.stringify({
        //         model: config.model,
        //         messages: [{ role: 'user', content: prompt }],
        //         temperature: config.temperature,
        //         max_tokens: config.max_tokens,
        //         stream: config.stream
        //     })
        // });
        
        // For demo purposes, we'll use a mock response
        console.log('OpenAI API call would be made with prompt:', prompt);
        return mockOpenAIResponse(prompt);
        
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw new Error('Failed to get response from AI service');
    }
}

/**
 * Generate a workout plan using OpenAI
 * @param {string} userGoals - The user's training goals
 * @returns {Promise<Object>} The workout plan
 */
async function generateWorkoutPlan(userGoals) {
    const prompt = `
        Create a detailed basketball workout plan based on the following user request: "${userGoals}".
        
        Format the response as a JSON object with the following structure:
        {
            "planTitle": "Title of the workout plan",
            "duration": "Estimated total duration",
            "phases": [
                {
                    "phaseTitle": "Phase name (e.g., Warmup, Skill Work, etc.)",
                    "exercises": [
                        {
                            "name": "Name of exercise",
                            "details": "Duration/reps and description"
                        }
                    ]
                }
            ]
        }
        
        Make the plan specific to basketball skills, realistic given the user's constraints, and include proper warmup and cooldown. Focus on quality over quantity of exercises.
    `;
    
    try {
        const response = await callOpenAI(prompt, {
            temperature: 0.8,
            max_tokens: 1000
        });
        
        // Parse the JSON response
        return JSON.parse(response);
    } catch (error) {
        console.error('Error generating workout plan:', error);
        throw new Error('Failed to generate workout plan');
    }
}

/**
 * Get a summary of a blog article using OpenAI
 * @param {string} articleContent - The content of the article
 * @param {string} articleTitle - The title of the article
 * @returns {Promise<string>} The HTML formatted summary
 */
async function getBlogSummary(articleContent, articleTitle) {
    const prompt = `
        Summarize the following basketball article in 3 key bullet points:
        
        Title: ${articleTitle}
        
        Content:
        ${articleContent}
        
        Format your response as 3 bullet points highlighting the most important takeaways from the article.
    `;
    
    try {
        const response = await callOpenAI(prompt, {
            temperature: 0.5,
            max_tokens: 500
        });
        
        // Format the response as HTML
        const bulletPoints = response.split('\n').filter(line => line.trim().startsWith('-'));
        
        let html = `
            <h3 class="text-lg font-semibold text-white mb-3">Key Takeaways</h3>
            <ul class="space-y-2 text-slate-300">
        `;
        
        bulletPoints.forEach(point => {
            const cleanPoint = point.replace(/^-\s*/, '');
            html += `
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>${cleanPoint}</span>
                </li>
            `;
        });
        
        html += `
            </ul>
            <p class="mt-4 text-slate-400">Ask me a follow-up question about ${articleTitle.toLowerCase()}.</p>
        `;
        
        return html;
    } catch (error) {
        console.error('Error getting blog summary:', error);
        throw new Error('Failed to generate article summary');
    }
}

/**
 * Ask a question about an article using OpenAI
 * @param {string} articleContent - The content of the article
 * @param {string} question - The user's question
 * @returns {Promise<string>} The HTML formatted answer
 */
async function askAboutArticle(articleContent, question) {
    const prompt = `
        Based on the article provided, answer the following question: "${question}"
        
        Article:
        ${articleContent}
        
        Provide a detailed but concise answer based only on the information in the article.
        If the article doesn't contain information to answer the question, say so.
    `;
    
    try {
        const response = await callOpenAI(prompt, {
            temperature: 0.7,
            max_tokens: 500
        });
        
        // Format the response as HTML
        return `<div class="text-slate-300">${response}</div>`;
    } catch (error) {
        console.error('Error asking about article:', error);
        throw new Error('Failed to get answer about article');
    }
}

/**
 * Mock function to simulate OpenAI API response
 * @param {string} prompt - The user's prompt
 * @returns {string} A mock response
 */
function mockOpenAIResponse(prompt) {
    // Simulate API delay
    return new Promise(resolve => {
        setTimeout(() => {
            // Check for workout plan generation
            if (prompt.includes('basketball workout plan')) {
                const userGoals = prompt.match(/user request: "([^"]*)"/)?.[1] || '';
                
                // Customize the mock response based on keywords in the user's goals
                const hasHandling = userGoals.toLowerCase().includes('handle') || userGoals.toLowerCase().includes('dribble');
                const hasShooting = userGoals.toLowerCase().includes('shoot') || userGoals.toLowerCase().includes('shot');
                const hasDefense = userGoals.toLowerCase().includes('defense') || userGoals.toLowerCase().includes('defend');
                const hasTime = userGoals.match(/(\d+)\s*minutes?/);
                const duration = hasTime ? hasTime[1] + ' minutes' : '60 minutes';
                
                let focusArea = "All-Around";
                if (hasHandling && hasShooting) focusArea = "Offensive Skills";
                else if (hasHandling) focusArea = "Ball Handling";
                else if (hasShooting) focusArea = "Shooting";
                else if (hasDefense) focusArea = "Defensive Skills";
                
                resolve(JSON.stringify({
                    planTitle: `${focusArea} Basketball Workout`,
                    duration: duration,
                    phases: [
                        {
                            phaseTitle: "Warmup",
                            exercises: [
                                {
                                    name: "Dynamic Stretching",
                                    details: "5 minutes - Include arm circles, leg swings, hip rotations, and ankle mobility"
                                },
                                {
                                    name: "Light Jogging",
                                    details: "3 minutes - Jog around the court at a comfortable pace to increase heart rate"
                                },
                                {
                                    name: "Basketball-Specific Movement",
                                    details: "2 minutes - Defensive slides, backpedaling, short sprints"
                                }
                            ]
                        },
                        {
                            phaseTitle: "Skill Development",
                            exercises: hasHandling ? [
                                {
                                    name: "Stationary Dribbling Series",
                                    details: "5 minutes - 30 seconds each: low dribbles, high dribbles, crossovers, between legs, behind back"
                                },
                                {
                                    name: "Cone Dribbling Drill",
                                    details: "8 minutes - Set up 5 cones in a zigzag pattern and practice different dribble moves around each cone"
                                },
                                {
                                    name: "Two-Ball Dribbling",
                                    details: "5 minutes - Dribble two balls simultaneously at same height, alternating heights, then walking forward"
                                }
                            ] : hasShooting ? [
                                {
                                    name: "Form Shooting",
                                    details: "5 minutes - Start close to basket focusing on perfect form, 10 shots from 5 spots"
                                },
                                {
                                    name: "Catch and Shoot",
                                    details: "10 minutes - 10 shots from 5 spots around the perimeter, simulate catching a pass before each shot"
                                },
                                {
                                    name: "Pull-Up Jumpers",
                                    details: "8 minutes - Practice 1-2 dribble pull-up jumpers from mid-range positions"
                                }
                            ] : [
                                {
                                    name: "Full-Court Layup Series",
                                    details: "8 minutes - Practice right-hand, left-hand, reverse, and euro-step layups"
                                },
                                {
                                    name: "Mid-Range Shooting",
                                    details: "8 minutes - 5 shots from 5 spots in mid-range area"
                                },
                                {
                                    name: "Dribble Moves to Finish",
                                    details: "8 minutes - Practice various dribble combinations leading to finishes at the rim"
                                }
                            ]
                        },
                        {
                            phaseTitle: "Game Simulation",
                            exercises: [
                                {
                                    name: "1-on-0 Moves",
                                    details: "10 minutes - Practice game-like moves with full speed and imagination of defenders"
                                },
                                {
                                    name: "Conditioning Through Skills",
                                    details: "8 minutes - Full-court dribbling, stopping at specific spots to perform moves"
                                }
                            ]
                        },
                        {
                            phaseTitle: "Cooldown",
                            exercises: [
                                {
                                    name: "Free Throws",
                                    details: "5 minutes - Shoot 20 free throws at a relaxed pace"
                                },
                                {
                                    name: "Static Stretching",
                                    details: "5 minutes - Hold each stretch for 20-30 seconds, focus on shoulders, wrists, hips, and legs"
                                }
                            ]
                        }
                    ]
                }));
                
            } else if (prompt.includes('Summarize the following basketball article')) {
                // Blog summary
                if (prompt.includes('Biomechanics') || prompt.includes('Handle')) {
                    resolve(`
                    - Elite ball handling is based on biomechanical principles that can be learned and mastered through deliberate practice.
                    - Lowering your center of gravity by bending knees and hips provides stability and shortens the ball's travel distance.
                    - The fingertips provide precise control while the palm generates power, creating a perfect balance for ball manipulation.
                    `);
                } else if (prompt.includes('Arc') || prompt.includes('Shot-Selection')) {
                    resolve(`
                    - The three-point shot has fundamentally changed basketball strategy and offensive approaches.
                    - Data analysis of over 1 million shots reveals the corner three as one of the most valuable shots in basketball.
                    - Teams that understand the mathematical advantages of three-point shooting are consistently winning championships.
                    `);
                } else {
                    resolve(`
                    - Professional basketball players follow extremely rigorous off-season training regimens starting as early as 5 AM.
                    - A complete training day includes strength and conditioning, skill work, film study, and recovery sessions.
                    - The dedication and discipline required to compete at the highest level goes far beyond regular practice sessions.
                    `);
                }
            } else if (prompt.includes('answer the following question')) {
                // Article questions
                const question = prompt.match(/question: "([^"]*)"/)?.[1] || '';
                
                if (question.toLowerCase().includes('how long') || question.toLowerCase().includes('time')) {
                    resolve(`
                        <p>Based on the article, developing elite ball handling skills typically takes consistent practice over months or years. The author emphasizes that while it may look like natural talent, it's actually based on "repeatable, trainable biomechanics" that anyone can learn with sufficient dedication.</p>
                        <p class="mt-2">Experts recommend daily practice sessions of 15-30 minutes focused specifically on dribbling to see significant improvement within 8-12 weeks.</p>
                    `);
                } else if (question.toLowerCase().includes('best drill') || question.toLowerCase().includes('exercise') || question.toLowerCase().includes('practice')) {
                    resolve(`
                        <p>The article suggests several effective drills for improving ball handling:</p>
                        <ol class="list-decimal pl-5 mt-2 space-y-1">
                            <li>Low dribbling drills to improve finger control and strength</li>
                            <li>Two-ball dribbling exercises to develop coordination and separation</li>
                            <li>Figure-8 drills between and around the legs</li>
                            <li>Cone dribbling patterns with various moves at each change of direction</li>
                            <li>Reactive drills with a partner calling out move changes</li>
                        </ol>
                        <p class="mt-2">The key is to practice with purpose and gradually increase the speed and complexity as you improve.</p>
                    `);
                } else if (question.toLowerCase().includes('stat') || question.toLowerCase().includes('data') || question.toLowerCase().includes('analytic')) {
                    resolve(`
                        <p>The article mentions several key statistics about three-point shooting in modern basketball:</p>
                        <ul class="list-disc pl-5 mt-2 space-y-1">
                            <li>Teams with higher three-point attempt rates have seen a 12% increase in offensive efficiency over the last decade</li>
                            <li>Corner three-pointers have an average success rate of 39% league-wide, making them more valuable than most mid-range shots</li>
                            <li>The last 5 NBA champions have all ranked in the top 10 for three-point attempt rate</li>
                            <li>Analysis of over 1 million shots revealed the most efficient spots on the floor</li>
                        </ul>
                        <p class="mt-2">These analytics have driven the strategic shift toward perimeter-oriented offenses in modern basketball.</p>
                    `);
                } else {
                    resolve(`
                        <p>I don't have enough specific information from the article to answer that question in detail. The article focuses primarily on the biomechanics of ball handling, three-point shooting strategies, and professional training routines.</p>
                        <p class="mt-2">You might want to ask something more specific about dribbling techniques, shooting strategy, or training approaches mentioned in the article.</p>
                    `);
                }
            } else {
                // Generic response
                resolve('I apologize, but I don\'t have enough context to provide a helpful response.');
            }
        }, 1000); // Simulate network delay
    });
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.OpenAIService = {
        callOpenAI,
        generateWorkoutPlan,
        getBlogSummary,
        askAboutArticle
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        callOpenAI,
        generateWorkoutPlan,
        getBlogSummary,
        askAboutArticle
    };
}