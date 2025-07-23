/**
 * API Integration for Hoopscope
 * 
 * Handles OpenAI API calls for the workout plan generator and blog helper
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const workoutModal = document.getElementById('workout-plan-modal');
    const workoutPlanContent = document.getElementById('workout-plan-content');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateLoader = document.getElementById('generate-loader');
    
    const blogHelperModal = document.getElementById('blog-helper-modal');
    const blogHelperOutput = document.getElementById('blog-helper-output');
    const blogHelperAskBtn = document.getElementById('blog-helper-ask-btn');
    const blogHelperPromptInput = document.getElementById('blog-helper-prompt');
    
    // Store current article content for AI helper
    let currentArticleForAI = '';

    /**
     * Calls the OpenAI API via a secure backend proxy
     * @param {string} prompt - The prompt to send to the API
     * @param {Object} options - Additional options for the API call
     * @returns {Promise<string|null>} - The API response or null if there was an error
     */
    const callOpenAI = async (prompt, options = {}) => {
        // This would be a proxy endpoint on your server that securely adds the API key
        const apiUrl = '/api/openai';
        
        try {
            // Show loading state if a callback is provided
            if (options.onStart) {
                options.onStart();
            }
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    model: options.model || 'gpt-4', // Default to GPT-4
                    max_tokens: options.maxTokens || 500,
                    temperature: options.temperature || 0.7,
                    response_format: options.responseFormat || { type: "text" }
                })
            });
            
            // For demo purposes, simulate API call
            // In production, remove this and use the actual API response
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }
            
            // For demo/testing, simulate a response with mock data
            // In production, use: const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            
            let mockResponse;
            
            // Different mock responses based on prompt type
            if (prompt.includes('workout plan') || prompt.includes('training plan')) {
                mockResponse = JSON.stringify({
                    planTitle: "Explosive Ball Handling & Finishing Workout",
                    duration: "60 minutes",
                    phases: [
                        {
                            phaseTitle: "Warm-up (10 minutes)",
                            exercises: [
                                { name: "Dynamic Stretching", details: "Focus on shoulders, wrists, hips, and ankles - 3 minutes" },
                                { name: "Jogging with Ball", details: "Light dribbling while jogging around the court - 3 minutes" },
                                { name: "Form Shooting", details: "Close-range form shots to get touch - 4 minutes" }
                            ]
                        },
                        {
                            phaseTitle: "Ball Handling Drills (25 minutes)",
                            exercises: [
                                { name: "Stationary Dribbling Series", details: "Low, high, crossover, between legs, behind back - 30 seconds each variation, 2 sets" },
                                { name: "Cone Weaving", details: "Set up 5 cones in a line, practice different dribble moves around each cone - 8 minutes" },
                                { name: "Two-Ball Dribbling", details: "Alternate dribbling two balls at different heights - 5 minutes" },
                                { name: "Hesitation & Change of Pace", details: "Practice sudden speed changes while dribbling toward the hoop - 6 minutes" }
                            ]
                        },
                        {
                            phaseTitle: "Finishing Drills (20 minutes)",
                            exercises: [
                                { name: "Mikan Drill", details: "Alternating layups from both sides of the basket - 4 minutes" },
                                { name: "Reverse Layup Series", details: "Practice reverse layups from both sides - 5 minutes" },
                                { name: "Euro Step Finishes", details: "Drive from wing, euro step around cone, finish at rim - 5 minutes" },
                                { name: "Contact Finishes", details: "Practice finishing through simulated contact (can use a pad if available) - 6 minutes" }
                            ]
                        },
                        {
                            phaseTitle: "Cool Down (5 minutes)",
                            exercises: [
                                { name: "Free Throws", details: "Practice 10 free throws while catching your breath" },
                                { name: "Static Stretching", details: "Focus on shoulders, wrists, forearms, and lower body - hold each stretch for 30 seconds" }
                            ]
                        }
                    ]
                });
            } else if (prompt.includes('summarize') || prompt.includes('summary')) {
                mockResponse = "• Ball handling is based on scientific principles of biomechanics, not just natural talent\n• Lowering your center of gravity by bending knees creates stability and shortens the dribble path\n• Elite dribblers use finger pads for control and palm for power, pushing the ball rather than slapping it";
            } else {
                mockResponse = "Based on the article, basketball dribbling is a complex skill combining physics principles and refined technique. The author explains that lowering your center of gravity through proper stance is crucial for stability. This matches what professional coaches teach - a lower stance gives you better balance and control during dynamic movements. The article also emphasizes using fingertips rather than palms for precision control, which aligns with biomechanical research showing how fine motor control in fingertips allows for precise directional adjustments.";
            }
            
            // Handle completion callback if provided
            if (options.onComplete) {
                options.onComplete(mockResponse);
            }
            
            return mockResponse;
        } catch (error) {
            console.error("OpenAI API Error:", error);
            
            // Handle error callback if provided
            if (options.onError) {
                options.onError(error);
            }
            
            return null;
        }
    };

    /**
     * Handles the workout plan generation
     */
    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', async () => {
            const userInput = document.getElementById('workout-prompt').value;
            
            if (!userInput.trim()) {
                workoutPlanContent.innerHTML = `
                    <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg mb-4">
                        <p class="text-red-400">Please describe your training goals first.</p>
                    </div>
                `;
                workoutModal.classList.remove('hidden');
                workoutModal.setAttribute('aria-hidden', 'false');
                return;
            }
            
            // Show loading state
            const handleStart = () => {
                generateBtnText.classList.add('hidden');
                generateLoader.classList.remove('hidden');
            };
            
            // Handle completion
            const handleComplete = (resultText) => {
                generateBtnText.classList.remove('hidden');
                generateLoader.classList.add('hidden');
                
                try {
                    const plan = JSON.parse(resultText);
                    let html = `<h2 id="workout-plan-title" class="text-3xl font-bold text-white mb-2">${plan.planTitle}</h2>`;
                    html += `<p class="text-slate-400 mb-6">Estimated Duration: ${plan.duration}</p>`;
                    
                    plan.phases.forEach(phase => {
                        html += `<h3 class="text-xl font-semibold text-orange-400 mt-6 mb-3">${phase.phaseTitle}</h3>`;
                        html += '<ul class="space-y-3">';
                        
                        phase.exercises.forEach(ex => {
                            html += `<li class="border-b border-zinc-700 pb-2">
                                <strong class="text-white">${ex.name}:</strong> 
                                <span class="text-slate-400">${ex.details}</span>
                            </li>`;
                        });
                        
                        html += '</ul>';
                    });
                    
                    workoutPlanContent.innerHTML = html;
                } catch (e) {
                    workoutPlanContent.innerHTML = `
                        <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg mb-4">
                            <p class="text-red-400">Could not generate the plan. Please try again.</p>
                            <p class="text-red-400 text-sm mt-2">Error: ${e.message}</p>
                        </div>
                    `;
                }
                
                // Show the modal
                workoutModal.classList.remove('hidden');
                workoutModal.setAttribute('aria-hidden', 'false');
            };
            
            // Handle errors
            const handleError = (error) => {
                generateBtnText.classList.remove('hidden');
                generateLoader.classList.add('hidden');
                
                workoutPlanContent.innerHTML = `
                    <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg mb-4">
                        <p class="text-red-400">Sorry, there was an error generating your workout plan.</p>
                        <p class="text-red-400 text-sm mt-2">Please try again later.</p>
                    </div>
                `;
                
                workoutModal.classList.remove('hidden');
                workoutModal.setAttribute('aria-hidden', 'false');
            };
            
            // Prepare the prompt
            const prompt = `Create a detailed basketball workout plan based on the following user request: "${userInput}". 
            The plan should include a title, estimated duration, and distinct phases like 'Warmup', 'Drills', and 'Cooldown'. 
            Each phase should have specific exercises with descriptions and durations or reps.`;
            
            // Call the API with response format as JSON
            await callOpenAI(prompt, {
                onStart: handleStart,
                onComplete: handleComplete,
                onError: handleError,
                responseFormat: { type: "json_object" },
                model: "gpt-4-turbo",
                temperature: 0.7,
                maxTokens: 800
            });
        });
    }

    /**
     * Handles the AI blog helper functionality
     * @param {Object} post - The blog post data
     */
    window.handleBlogAI = async (post) => {
        if (!blogHelperModal || !blogHelperOutput) return;
        
        // Clean and store the article text
        currentArticleForAI = post.content.replace(/<[^>]*>?/gm, '');
        
        // Show loading state
        blogHelperOutput.innerHTML = '<div class="w-5 h-5 rounded-full loader mx-auto"></div>';
        blogHelperModal.classList.remove('hidden');
        blogHelperModal.setAttribute('aria-hidden', 'false');
        
        // Prepare the prompt
        const prompt = `Summarize the following basketball article in 3 key bullet points:\n\n${currentArticleForAI}`;
        
        // Call the API
        const summary = await callOpenAI(prompt, {
            temperature: 0.5,
            maxTokens: 300
        });
        
        if (summary) {
            blogHelperOutput.innerText = summary;
        } else {
            blogHelperOutput.innerHTML = `
                <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg">
                    <p class="text-red-400">Could not generate summary. Please try again.</p>
                </div>
            `;
        }
    };

    /**
     * Handles the blog helper "Ask" button
     */
    if (blogHelperAskBtn) {
        blogHelperAskBtn.addEventListener('click', async () => {
            const userQuestion = blogHelperPromptInput.value;
            
            if (!userQuestion.trim() || !currentArticleForAI) return;
            
            // Show loading state
            blogHelperOutput.innerHTML = '<div class="w-5 h-5 rounded-full loader mx-auto"></div>';
            
            // Prepare the prompt
            const prompt = `Based on the article provided, answer the following question: "${userQuestion}"\n\nArticle:\n${currentArticleForAI}`;
            
            // Call the API
            const answer = await callOpenAI(prompt, {
                temperature: 0.7,
                maxTokens: 400
            });
            
            if (answer) {
                blogHelperOutput.innerText = answer;
            } else {
                blogHelperOutput.innerHTML = `
                    <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg">
                        <p class="text-red-400">Sorry, I could not answer that question.</p>
                    </div>
                `;
            }
            
            // Clear the input field
            blogHelperPromptInput.value = '';
        });
        
        // Add keypress event for the input field
        blogHelperPromptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                blogHelperAskBtn.click();
            }
        });
    }
});