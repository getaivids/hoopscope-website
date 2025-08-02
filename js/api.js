/**
 * API Integration for Hoopscope
 * 
 * Handles OpenAI API calls for the workout plan generator and blog helper
 * by communicating with a secure backend proxy endpoint.
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
     * Calls the OpenAI API via a secure backend proxy.
     * @param {string} prompt - The prompt to send to the API.
     * @param {Object} options - Additional options for the API call.
     * @param {Function} options.onStart - Callback to run when the API call begins.
     * @param {Function} options.onComplete - Callback to run with the successful response text.
     * @param {Function} options.onError - Callback to run when an error occurs.
     * @param {string} options.model - The model to use (e.g., 'gpt-4-turbo').
     * @param {Object} options.responseFormat - The desired response format (e.g., { type: 'json_object' }).
     * @returns {Promise<void>}
     */
    const callOpenAI = async (prompt, options = {}) => {
        const { onStart, onComplete, onError, ...apiOptions } = options;
        const apiUrl = '/api/openai'; // The secure backend proxy endpoint

        if (onStart) {
            onStart();
        }
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    ...apiOptions // Pass model, response_format, etc. to the backend
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API call failed with status: ${response.status}. Body: ${errorBody}`);
            }
            
            const resultText = await response.text(); // Use .text() for flexibility (JSON or plain text)
            
            if (onComplete) {
                onComplete(resultText);
            }
        } catch (error) {
            console.error("OpenAI API Error:", error);
            if (onError) {
                onError(error);
            }
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
                workoutPlanContent.innerHTML = ''; // Clear previous content
                workoutModal.classList.remove('hidden');
                workoutModal.setAttribute('aria-hidden', 'false');
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
                    console.error("Failed to parse workout plan JSON:", e);
                    workoutPlanContent.innerHTML = `
                        <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg mb-4">
                            <p class="text-red-400">Could not generate the plan. The AI returned an invalid format.</p>
                            <p class="text-red-400 text-sm mt-2">Error: ${e.message}</p>
                        </div>
                    `;
                }
            };
            
            // Handle errors
            const handleError = (error) => {
                generateBtnText.classList.remove('hidden');
                generateLoader.classList.add('hidden');
                
                workoutPlanContent.innerHTML = `
                    <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg mb-4">
                        <p class="text-red-400">Sorry, there was an error generating your workout plan.</p>
                        <p class="text-red-400 text-sm mt-2">${error.message}</p>
                    </div>
                `;
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
                model: "gpt-4-turbo"
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
            model: "gpt-4-turbo"
        });

        // The callOpenAI function now uses callbacks, so we adjust.
        callOpenAI(prompt, {
            onComplete: (summary) => {
                if (summary) {
                    blogHelperOutput.innerText = summary;
                } else {
                    blogHelperOutput.innerHTML = `
                        <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg">
                            <p class="text-red-400">The AI returned an empty summary. Please try again.</p>
                        </div>
                    `;
                }
            },
            onError: (error) => {
                 blogHelperOutput.innerHTML = `
                    <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg">
                        <p class="text-red-400">Could not generate summary. Please try again.</p>
                        <p class="text-slate-500 text-xs mt-1">${error.message}</p>
                    </div>
                `;
            }
        });
    };

    /**
     * Handles the blog helper "Ask" button
     */
    if (blogHelperAskBtn) {
        const askQuestion = async () => {
            const userQuestion = blogHelperPromptInput.value;
            
            if (!userQuestion.trim() || !currentArticleForAI) return;
            
            // Show loading state
            blogHelperOutput.innerHTML = '<div class="w-5 h-5 rounded-full loader mx-auto"></div>';
            
            // Prepare the prompt
            const prompt = `Based on the article provided, answer the following question: "${userQuestion}"\n\nArticle:\n${currentArticleForAI}`;
            
            // Call the API
            await callOpenAI(prompt, {
                onComplete: (answer) => {
                    if (answer) {
                        blogHelperOutput.innerText = answer;
                    } else {
                        blogHelperOutput.innerHTML = `
                            <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg">
                                <p class="text-red-400">The AI returned an empty answer.</p>
                            </div>
                        `;
                    }
                },
                onError: (error) => {
                    blogHelperOutput.innerHTML = `
                        <div class="p-4 bg-red-900/40 border border-red-700 rounded-lg">
                            <p class="text-red-400">Sorry, I could not answer that question.</p>
                             <p class="text-slate-500 text-xs mt-1">${error.message}</p>
                        </div>
                    `;
                }
            });
            
            // Clear the input field
            blogHelperPromptInput.value = '';
        };

        blogHelperAskBtn.addEventListener('click', askQuestion);
        
        blogHelperPromptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                askQuestion();
            }
        });
    }
});