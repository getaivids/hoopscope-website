/**
 * Hoopscope - Main JavaScript
 * This file contains all the JavaScript functionality for the Hoopscope website.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Navigation
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // DOM Elements - Blog Section
    const blogGridHomepage = document.getElementById('blog-grid-homepage');
    const blogLoading = document.getElementById('blog-loading');
    
    // DOM Elements - Workout Plan Generator
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const workoutModal = document.getElementById('workout-plan-modal');
    const closeWorkoutModalBtn = document.getElementById('close-workout-modal-btn');
    const workoutPlanContent = document.getElementById('workout-plan-content');
    const workoutPlanLoading = document.getElementById('workout-plan-loading');
    const workoutPlanData = document.getElementById('workout-plan-data');
    const workoutPlanError = document.getElementById('workout-plan-error');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateLoader = document.getElementById('generate-loader');
    const workoutError = document.getElementById('workout-error');
    
    // DOM Elements - Blog Helper
    const blogHelperModal = document.getElementById('blog-helper-modal');
    const closeBlogHelperModalBtn = document.getElementById('close-blog-helper-modal-btn');
    const blogHelperOutput = document.getElementById('blog-helper-output');
    const blogHelperLoading = document.getElementById('blog-helper-loading');
    const blogHelperAskBtn = document.getElementById('blog-helper-ask-btn');
    const blogHelperPromptInput = document.getElementById('blog-helper-prompt');
    
    // Current state
    let currentArticleForAI = '';
    
    // --- Blog Posts Data ---
    const posts = [
        {
            title: "The Biomechanics of an Unshakeable Handle",
            author: "Dr. Evelyn Reed",
            date: "September 18, 2025",
            category: "Analytics",
            image: "https://images.unsplash.com/photo-1598136397221-717618571b56?q=80&w=2070&auto=format&fit=crop",
            content: `<h1>The Science of Ball Control</h1><p>Following our deep dive into the jump shot, we're back in the lab to unravel the secrets of elite ball handling. Using motion capture and newly developed pressure-sensing basketballs, we analyze how players maintain perfect control. From body posture to the subtle forces applied by the fingertips, we'll explore the scientific principles that turn a simple bounce into an unshakeable handle.</p><h2>From Clumsy to Controlled: Decoding the Science of Dribbling</h2><p>If the jump shot is the exclamation point of a great play, then the dribble is the beautiful, intricate sentence that sets it up. We've all been mesmerized by a player who seems to have the basketball on a string, effortlessly weaving through defenders with a dizzying array of crossovers, hesitations, and behind-the-back moves. It looks like pure instinct, a natural gift. But as a scientist, I can assure you that beneath that fluid artistry lies a foundation of repeatable, trainable biomechanics.</p><h2>The Foundation: Your Dribbling Stance and Posture</h2><h3>Why Staying Low is a Golden Rule of Physics</h3><p>By bending your knees and dropping your hips, you lower your center of gravity. A lower center of gravity creates a more stable base, making you much harder to knock off balance. Staying low also shortens the distance the ball has to travel from your hand to the floor and back, resulting in a quicker, more secure dribble.</p><h2>The Engine of the Dribble: The Hand, Wrist, and Arm</h2><h3>It's Not Slapping, It's Pushing: The Nuance of Applying Force</h3><p>Elite dribblers push the ball into the floor. Their arm, wrist, and hand absorb the ball on its way up and then push it back down in a fluid motion. There is constant contact and 'feel.' This allows them to manipulate the ball's direction and pace at will.</p><blockquote>The palm is for power, but the finger pads are for control.</blockquote>`
        },
        {
            title: "Beyond the Arc: How Shot-Selection Defines Modern Offenses",
            author: "Alex Rivera",
            date: "July 5, 2025",
            category: "Analytics",
            image: "https://images.unsplash.com/photo-1608245449223-342757f43769?q=80&w=2070&auto=format&fit=crop",
            content: "<h1>The Three-Point Revolution</h1><p>The three-point line has fundamentally revolutionized basketball. We dive into the data to show how spacing and shot selection have become the keys to unlocking a high-powered offense in today's game. It's a numbers game, and the teams that understand the math are winning championships.</p><blockquote>The math is simple: 3 is greater than 2. But the application is complex.</blockquote><p>We analyzed over 1 million shots from the last five seasons to identify the most efficient spots on the floor. The corner three, once an afterthought, is now one of the most valuable shots in basketball.</p>"
        },
        {
            title: "A Day in the Life: Off-Season Training with a Pro",
            author: "Jasmine Chen",
            date: "June 28, 2025",
            category: "Pro Insights",
            image: "https://images.unsplash.com/photo-1594488541269-c4b5a73c3374?q=80&w=1974&auto=format&fit=crop",
            content: "<h2>It's More Than Just Practice</h2><p>What does it really take to compete at the highest level? We follow a professional player through their rigorous off-season regimen, from the weight room to the court, revealing the dedication required for greatness. The day starts at 5 AM with strength and conditioning, followed by skill work, film study, and recovery sessions.</p>"
        }
    ];

    // --- OpenAI API Integration ---
    /**
     * Call the OpenAI API with a prompt and optional schema
     * @param {string} prompt - The prompt to send to the API
     * @param {object} schema - Optional JSON schema for structured responses
     * @returns {Promise<string|null>} - The API response or null on error
     */
    const callOpenAI = async (prompt, schema = null) => {
        try {
            // In a production environment, this would be handled by a secure backend
            // This is a placeholder implementation for demonstration
            
            // Simulate API call for demo purposes
            showLoading(true);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demonstration, we'll return mock responses
            // In production, this would make a real API call to OpenAI
            if (prompt.includes('workout plan') || prompt.includes('training')) {
                return mockWorkoutPlanResponse(prompt);
            } else if (prompt.includes('article') || prompt.includes('blog')) {
                return mockBlogHelperResponse(prompt);
            }
            
            return "I'm sorry, I couldn't process that request.";
        } catch (error) {
            console.error("API Error:", error);
            return null;
        } finally {
            showLoading(false);
        }
    };
    
    /**
     * Mock workout plan response for demonstration
     * @param {string} prompt - The user's prompt
     * @returns {string} - JSON string of mock workout plan
     */
    const mockWorkoutPlanResponse = (prompt) => {
        // Parse the user's request to customize the response
        const lowerPrompt = prompt.toLowerCase();
        let focus = "general basketball skills";
        let duration = "60 minutes";
        
        if (lowerPrompt.includes("shooting")) focus = "shooting";
        if (lowerPrompt.includes("handle") || lowerPrompt.includes("dribbling")) focus = "ball handling";
        if (lowerPrompt.includes("defense")) focus = "defensive skills";
        
        if (lowerPrompt.includes("30 min")) duration = "30 minutes";
        if (lowerPrompt.includes("45 min")) duration = "45 minutes";
        if (lowerPrompt.includes("90 min")) duration = "90 minutes";
        
        const plan = {
            planTitle: `Personalized ${focus.charAt(0).toUpperCase() + focus.slice(1)} Workout`,
            duration: duration,
            phases: [
                {
                    phaseTitle: "Warm-up",
                    exercises: [
                        {
                            name: "Dynamic Stretching",
                            details: "5 minutes of arm circles, leg swings, hip rotations, and ankle rolls."
                        },
                        {
                            name: "Light Jogging",
                            details: "2-3 minutes of jogging around the court to elevate heart rate."
                        },
                        {
                            name: "Form Shooting",
                            details: "5 minutes of close-range form shots to establish rhythm."
                        }
                    ]
                },
                {
                    phaseTitle: "Skill Development",
                    exercises: generateExercises(focus)
                },
                {
                    phaseTitle: "Cool Down",
                    exercises: [
                        {
                            name: "Light Shooting",
                            details: "5 minutes of free throws or short-range shots with proper form."
                        },
                        {
                            name: "Static Stretching",
                            details: "5 minutes focusing on shoulders, wrists, hips, and ankles."
                        }
                    ]
                }
            ]
        };
        
        return JSON.stringify(plan);
    };
    
    /**
     * Generate exercise list based on focus area
     * @param {string} focus - The focus area for the workout
     * @returns {Array} - Array of exercise objects
     */
    const generateExercises = (focus) => {
        if (focus === "shooting") {
            return [
                {
                    name: "Catch and Shoot Drill",
                    details: "10 minutes: Work around 5 spots on the court, making 5 shots from each location."
                },
                {
                    name: "Pull-Up Jumpers",
                    details: "10 minutes: Practice one-dribble and two-dribble pull-up jumpers from different angles."
                },
                {
                    name: "Game Situation Shooting",
                    details: "15 minutes: Simulate coming off screens, shooting after a cut, and spot-up shooting."
                }
            ];
        } else if (focus === "ball handling") {
            return [
                {
                    name: "Stationary Dribbling Series",
                    details: "10 minutes: Perform various dribbling moves (crossovers, between legs, behind back) while stationary."
                },
                {
                    name: "Cone Dribbling",
                    details: "10 minutes: Set up 5 cones and practice navigating through them with different dribble moves."
                },
                {
                    name: "Game Speed Dribbling",
                    details: "15 minutes: Full-court dribbling with pressure, working on changes of pace and direction."
                }
            ];
        } else if (focus === "defensive skills") {
            return [
                {
                    name: "Defensive Slides",
                    details: "10 minutes: Practice lateral movement with proper defensive stance across the width of the court."
                },
                {
                    name: "Close-Out Drill",
                    details: "10 minutes: Practice closing out to a shooter with high hands and quick feet."
                },
                {
                    name: "1-on-1 Defense",
                    details: "15 minutes: Defensive containment drills against a partner focusing on positioning and anticipation."
                }
            ];
        } else {
            return [
                {
                    name: "Full-Court Layups",
                    details: "10 minutes: Practice various finishing moves at game speed."
                },
                {
                    name: "Shooting Drills",
                    details: "10 minutes: Mid-range and three-point shooting from different spots."
                },
                {
                    name: "Dribbling Sequences",
                    details: "10 minutes: Practice combination dribble moves with changes of direction."
                }
            ];
        }
    };
    
    /**
     * Mock blog helper response for demonstration
     * @param {string} prompt - The user's prompt
     * @returns {string} - Mock response text
     */
    const mockBlogHelperResponse = (prompt) => {
        if (prompt.includes("summarize") || !prompt.includes("question")) {
            return `Here are the key points from this article:

• Basketball handling is a science that combines physics and biomechanics
• A lower center of gravity is crucial for better ball control and stability
• Elite dribblers push the ball rather than slap it, maintaining constant contact
• Finger pad control provides precision while palm contact offers power`;
        } else {
            const questionMatch = prompt.match(/question: "([^"]+)"/);
            if (questionMatch && questionMatch[1]) {
                const question = questionMatch[1].toLowerCase();
                
                if (question.includes("biomechanics") || question.includes("science")) {
                    return "The article explains that ball handling has a scientific foundation in biomechanics. It's not just natural talent but a set of repeatable, trainable physical principles involving body positioning, center of gravity, and how force is applied through the fingers and palm.";
                } else if (question.includes("drill") || question.includes("improve") || question.includes("practice")) {
                    return "Based on the article, to improve your handle you should: 1) Focus on lowering your center of gravity by bending knees and dropping hips, 2) Practice pushing the ball rather than slapping it, and 3) Develop finger pad control for precision while using the palm for power when needed.";
                } else {
                    return "The article discusses how elite ball handlers combine proper stance (low center of gravity) with precise control techniques. They push the ball with controlled force rather than slapping it, and utilize their finger pads for precision control while the palm provides power when needed.";
                }
            }
            return "I'd be happy to answer specific questions about the basketball techniques discussed in this article.";
        }
    };
    
    /**
     * Toggle loading state
     * @param {boolean} isLoading - Whether loading is active
     */
    const showLoading = (isLoading) => {
        if (workoutPlanLoading) {
            workoutPlanLoading.style.display = isLoading ? 'flex' : 'none';
        }
        if (blogHelperLoading) {
            blogHelperLoading.style.display = isLoading ? 'flex' : 'none';
        }
    };

    /**
     * Create blog post element for the homepage
     * @param {Object} post - The post data
     * @param {number} index - The post index
     * @returns {HTMLElement} - The post element
     */
    function createPostElement(post, index) {
        const postEl = document.createElement('div');
        postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col scroll-animate';
        postEl.setAttribute('aria-labelledby', `post-title-${index}`);
        
        // Get content snippet without HTML tags
        const contentSnippet = post.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
        
        postEl.innerHTML = `
            <a href="hoopscope-blog.html" class="block hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500" aria-label="Read ${post.title}">
                <img src="${post.image}" alt="" class="w-full h-48 object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/111111/444444?text=Image';">
            </a>
            <div class="p-6 flex flex-col flex-grow">
                <span class="text-orange-400 font-semibold text-sm">${post.category}</span>
                <h3 id="post-title-${index}" class="text-xl font-bold text-white my-2">${post.title}</h3>
                <p class="text-slate-400 text-sm mb-4 flex-grow">${contentSnippet}</p>
                <div class="flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span>By ${post.author} &bull; ${post.date}</span>
                    <button data-index="${index}" class="ai-blog-btn text-orange-400 font-semibold flex items-center gap-1 hover:text-orange-300 focus:outline-none focus:text-orange-300" aria-label="Ask AI about this article">
                        ✨ Ask AI
                    </button>
                </div>
            </div>
        `;
        return postEl;
    }

    /**
     * Render posts on the homepage
     */
    function renderHomepagePosts() {
        if (!blogGridHomepage) return;
        
        // Remove loading message
        if (blogLoading) {
            blogLoading.remove();
        }
        
        const latestPosts = posts.slice(0, 3);
        latestPosts.forEach((post, index) => {
            const postEl = createPostElement(post, index);
            postEl.style.animationDelay = `${(index + 1) * 0.1}s`;
            blogGridHomepage.appendChild(postEl);
        });
    }

    /**
     * Handle the generation of a workout plan
     */
    async function handleWorkoutPlanGeneration() {
        const userInput = document.getElementById('workout-prompt').value;
        
        // Validate input
        if (!userInput.trim()) {
            workoutError.textContent = 'Please describe your training goals first.';
            workoutError.classList.remove('hidden');
            return;
        }
        
        // Clear previous error
        workoutError.classList.add('hidden');
        
        // Show loading state
        generateBtnText.classList.add('hidden');
        generateLoader.classList.remove('hidden');
        workoutModal.classList.remove('hidden');
        workoutPlanData.classList.add('hidden');
        workoutPlanError.classList.add('hidden');
        workoutPlanLoading.style.display = 'flex';
        
        // Create the prompt
        const prompt = `Create a detailed basketball workout plan based on the following user request: "${userInput}". The plan should be structured with a title, an estimated duration, and distinct phases like 'Warmup', 'Drills', and 'Cooldown'. Each phase should contain a list of specific exercises with descriptions and durations or reps.`;
        
        // Call the API
        const resultText = await callOpenAI(prompt, true);
        
        // Reset button state
        generateBtnText.classList.remove('hidden');
        generateLoader.classList.add('hidden');
        workoutPlanLoading.style.display = 'none';
        
        if (resultText) {
            try {
                const plan = JSON.parse(resultText);
                
                let html = `<h2 class="text-3xl font-bold text-white mb-2">${plan.planTitle}</h2>`;
                html += `<p class="text-slate-400 mb-6">Estimated Duration: ${plan.duration}</p>`;
                
                plan.phases.forEach(phase => {
                    html += `<h3 class="text-xl font-semibold text-orange-400 mt-6 mb-3">${phase.phaseTitle}</h3>`;
                    html += '<ul class="space-y-3">';
                    phase.exercises.forEach(ex => {
                        html += `<li class="border-b border-zinc-700 pb-2"><strong class="text-white">${ex.name}:</strong> <span class="text-slate-400">${ex.details}</span></li>`;
                    });
                    html += '</ul>';
                });
                
                workoutPlanData.innerHTML = html;
                workoutPlanData.classList.remove('hidden');
            } catch (e) {
                console.error('Error parsing workout plan:', e);
                workoutPlanError.classList.remove('hidden');
            }
        } else {
            workoutPlanError.classList.remove('hidden');
        }
    }

    /**
     * Handle blog helper functionality
     * @param {number} postIndex - The index of the blog post
     */
    async function handleBlogHelper(postIndex) {
        const post = posts[postIndex];
        currentArticleForAI = post.content.replace(/<[^>]*>?/gm, ''); // Store clean text
        
        // Reset and show the modal
        blogHelperOutput.innerHTML = '';
        blogHelperLoading.style.display = 'flex';
        blogHelperModal.classList.remove('hidden');
        
        // Create the prompt
        const prompt = `Summarize the following basketball article in 3 key bullet points:\n\n${currentArticleForAI}`;
        
        // Call the API
        const summary = await callOpenAI(prompt);
        
        if (summary) {
            blogHelperOutput.innerHTML = summary.replace(/•/g, '<br>•').replace(/\n/g, '<br>');
        } else {
            blogHelperOutput.innerHTML = '<p class="text-red-500">Could not generate summary.</p>';
        }
    }

    /**
     * Handle blog helper follow-up questions
     */
    async function handleBlogHelperQuestion() {
        const userQuestion = blogHelperPromptInput.value;
        
        if (!userQuestion.trim() || !currentArticleForAI) {
            return;
        }
        
        // Reset and show loading
        blogHelperOutput.innerHTML = '';
        blogHelperLoading.style.display = 'flex';
        
        // Create the prompt
        const prompt = `Based on the article provided, answer the following question: "${userQuestion}"\n\nArticle:\n${currentArticleForAI}`;
        
        // Call the API
        const answer = await callOpenAI(prompt);
        
        if (answer) {
            blogHelperOutput.innerHTML = answer;
        } else {
            blogHelperOutput.innerHTML = '<p class="text-red-500">Sorry, I could not answer that question.</p>';
        }
        
        // Clear the input
        blogHelperPromptInput.value = '';
    }

    /**
     * Initialize scroll animations
     */
    function initScrollAnimations() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
        
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.style.animationDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    }

    /**
     * Initialize keyboard accessibility for modals
     */
    function initModalAccessibility() {
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!workoutModal.classList.contains('hidden')) {
                    workoutModal.classList.add('hidden');
                }
                if (!blogHelperModal.classList.contains('hidden')) {
                    blogHelperModal.classList.add('hidden');
                }
            }
        });
        
        // Close modals when clicking outside
        workoutModal.addEventListener('click', (e) => {
            if (e.target === workoutModal) {
                workoutModal.classList.add('hidden');
            }
        });
        
        blogHelperModal.addEventListener('click', (e) => {
            if (e.target === blogHelperModal) {
                blogHelperModal.classList.add('hidden');
            }
        });
    }

    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        if (!mobileMenuBtn || !mobileMenu) return;
        
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
            } else {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;
            }
        });
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Workout plan generator
        if (generatePlanBtn) {
            generatePlanBtn.addEventListener('click', handleWorkoutPlanGeneration);
        }
        
        if (closeWorkoutModalBtn) {
            closeWorkoutModalBtn.addEventListener('click', () => workoutModal.classList.add('hidden'));
        }
        
        // Blog helper
        if (blogGridHomepage) {
            blogGridHomepage.addEventListener('click', async (e) => {
                const targetButton = e.target.closest('.ai-blog-btn');
                if (targetButton) {
                    e.preventDefault();
                    const postIndex = parseInt(targetButton.dataset.index, 10);
                    await handleBlogHelper(postIndex);
                }
            });
        }
        
        if (blogHelperAskBtn) {
            blogHelperAskBtn.addEventListener('click', handleBlogHelperQuestion);
        }
        
        if (blogHelperPromptInput) {
            blogHelperPromptInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleBlogHelperQuestion();
                }
            });
        }
        
        if (closeBlogHelperModalBtn) {
            closeBlogHelperModalBtn.addEventListener('click', () => blogHelperModal.classList.add('hidden'));
        }
    }

    // Initialize the application
    function init() {
        renderHomepagePosts();
        initScrollAnimations();
        initModalAccessibility();
        initMobileMenu();
        initEventListeners();
    }

    // Start the application
    init();
});