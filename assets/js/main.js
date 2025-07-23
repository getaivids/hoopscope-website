/**
 * Hoopscope Main JavaScript
 * Contains functionality for UI interactions, animations, and AI features
 */

// Wait for DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initScrollAnimations();
    initMobileMenu();
    initLazyLoading();
    initBlogPosts();
    initAIWorkoutPlanner();
    initBlogHelper();
    initHeaderScroll();
});

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    const observerOptions = { 
        root: null, 
        rootMargin: '0px', 
        threshold: 0.2 
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.delay || 0);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    document.querySelectorAll('.scroll-animate').forEach((el, index) => {
        // Set data-delay attribute if not already set
        if (!el.dataset.delay) {
            el.dataset.delay = index * 0.1;
        }
        observer.observe(el);
    });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            // Update aria-expanded attribute for accessibility
            const isExpanded = mobileMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img.lazy-image').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img.lazy-image').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Initialize header scroll behavior
 */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Blog posts data
const blogPosts = [
    {
        title: "The Biomechanics of an Unshakeable Handle",
        author: "Dr. Evelyn Reed",
        date: "September 18, 2025",
        category: "Analytics",
        image: "assets/images/blog/ball-handling.jpg",
        slug: "biomechanics-unshakeable-handle",
        excerpt: "Following our deep dive into the jump shot, we're back in the lab to unravel the secrets of elite ball handling. Using motion capture and newly developed pressure-sensing basketballs...",
        content: `<h1>The Science of Ball Control</h1><p>Following our deep dive into the jump shot, we're back in the lab to unravel the secrets of elite ball handling. Using motion capture and newly developed pressure-sensing basketballs, we analyze how players maintain perfect control. From body posture to the subtle forces applied by the fingertips, we'll explore the scientific principles that turn a simple bounce into an unshakeable handle.</p><h2>From Clumsy to Controlled: Decoding the Science of Dribbling</h2><p>If the jump shot is the exclamation point of a great play, then the dribble is the beautiful, intricate sentence that sets it up. We've all been mesmerized by a player who seems to have the basketball on a string, effortlessly weaving through defenders with a dizzying array of crossovers, hesitations, and behind-the-back moves. It looks like pure instinct, a natural gift. But as a scientist, I can assure you that beneath that fluid artistry lies a foundation of repeatable, trainable biomechanics.</p><h2>The Foundation: Your Dribbling Stance and Posture</h2><h3>Why Staying Low is a Golden Rule of Physics</h3><p>By bending your knees and dropping your hips, you lower your center of gravity. A lower center of gravity creates a more stable base, making you much harder to knock off balance. Staying low also shortens the distance the ball has to travel from your hand to the floor and back, resulting in a quicker, more secure dribble.</p><h2>The Engine of the Dribble: The Hand, Wrist, and Arm</h2><h3>It's Not Slapping, It's Pushing: The Nuance of Applying Force</h3><p>Elite dribblers push the ball into the floor. Their arm, wrist, and hand absorb the ball on its way up and then push it back down in a fluid motion. There is constant contact and 'feel.' This allows them to manipulate the ball's direction and pace at will.</p><blockquote>The palm is for power, but the finger pads are for control.</blockquote>`
    },
    {
        title: "Beyond the Arc: How Shot-Selection Defines Modern Offenses",
        author: "Alex Rivera",
        date: "July 5, 2025",
        category: "Analytics",
        image: "assets/images/blog/three-point-shooting.jpg",
        slug: "beyond-the-arc-shot-selection",
        excerpt: "The three-point line has fundamentally revolutionized basketball. We dive into the data to show how spacing and shot selection have become the keys to unlocking a high-powered offense...",
        content: "<h1>The Three-Point Revolution</h1><p>The three-point line has fundamentally revolutionized basketball. We dive into the data to show how spacing and shot selection have become the keys to unlocking a high-powered offense in today's game. It's a numbers game, and the teams that understand the math are winning championships.</p><blockquote>The math is simple: 3 is greater than 2. But the application is complex.</blockquote><p>We analyzed over 1 million shots from the last five seasons to identify the most efficient spots on the floor. The corner three, once an afterthought, is now one of the most valuable shots in basketball.</p>"
    },
    {
        title: "A Day in the Life: Off-Season Training with a Pro",
        author: "Jasmine Chen",
        date: "June 28, 2025",
        category: "Pro Insights",
        image: "assets/images/blog/pro-training.jpg",
        slug: "day-in-life-offseason-training",
        excerpt: "What does it really take to compete at the highest level? We follow a professional player through their rigorous off-season regimen, from the weight room to the court...",
        content: "<h2>It's More Than Just Practice</h2><p>What does it really take to compete at the highest level? We follow a professional player through their rigorous off-season regimen, from the weight room to the court, revealing the dedication required for greatness. The day starts at 5 AM with strength and conditioning, followed by skill work, film study, and recovery sessions.</p>"
    }
];

/**
 * Initialize blog posts in the homepage
 */
function initBlogPosts() {
    const blogGridHomepage = document.getElementById('blog-grid-homepage');
    
    if (!blogGridHomepage) return;
    
    blogGridHomepage.innerHTML = '';
    
    // Display only the latest 3 posts on the homepage
    const latestPosts = blogPosts.slice(0, 3);
    
    latestPosts.forEach((post, index) => {
        const postElement = createPostElement(post, index);
        blogGridHomepage.appendChild(postElement);
    });
}

/**
 * Create an HTML element for a blog post
 * @param {Object} post - The blog post data
 * @param {number} index - The index of the post
 * @returns {HTMLElement} The created post element
 */
function createPostElement(post, index) {
    const postEl = document.createElement('div');
    postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col scroll-animate';
    postEl.dataset.delay = (index + 1) * 0.1;
    
    // Create fallback for images
    const imagePath = post.image || 'assets/images/placeholder.jpg';
    
    postEl.innerHTML = `
        <a href="blog/${post.slug}.html" class="block hover:opacity-80 transition-opacity">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" 
                 data-src="${imagePath}" 
                 alt="${post.title}" 
                 class="w-full h-48 object-cover lazy-image"
                 aria-label="Featured image for article: ${post.title}">
        </a>
        <div class="p-6 flex flex-col flex-grow">
            <span class="text-orange-400 font-semibold text-sm">${post.category}</span>
            <h3 class="text-xl font-bold text-white my-2">
                <a href="blog/${post.slug}.html" class="hover:text-orange-400 transition-colors">${post.title}</a>
            </h3>
            <p class="text-slate-400 text-sm mb-4 flex-grow">${post.excerpt}</p>
            <div class="flex items-center justify-between text-xs text-slate-500 mt-auto">
                <span>By ${post.author} &bull; ${post.date}</span>
                <button data-index="${index}" 
                        class="ai-blog-btn text-orange-400 font-semibold flex items-center gap-1 hover:text-orange-300"
                        aria-label="Ask AI about this article">
                    ✨ Ask AI
                </button>
            </div>
        </div>
    `;
    
    return postEl;
}

/**
 * Initialize AI workout planner functionality
 */
function initAIWorkoutPlanner() {
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const workoutModal = document.getElementById('workout-plan-modal');
    const closeWorkoutModalBtn = document.getElementById('close-workout-modal-btn');
    const workoutPlanContent = document.getElementById('workout-plan-content');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateLoader = document.getElementById('generate-loader');
    const workoutPrompt = document.getElementById('workout-prompt');
    
    if (!generatePlanBtn || !workoutModal || !closeWorkoutModalBtn || !workoutPlanContent) return;
    
    // Add keyboard accessibility to modal
    function setupModalAccessibility(modal, closeBtn) {
        // Close modal on escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.add('hidden');
            }
        });
        
        // Trap focus inside modal when open
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
        
        // Set focus to first element when modal opens
        closeBtn.focus();
    }
    
    // Show workout modal
    generatePlanBtn.addEventListener('click', async () => {
        const userInput = workoutPrompt.value;
        
        if (!userInput.trim()) {
            workoutPlanContent.innerHTML = `<p class="text-red-400">Please describe your training goals first.</p>`;
            workoutModal.classList.remove('hidden');
            setupModalAccessibility(workoutModal, closeWorkoutModalBtn);
            return;
        }
        
        generateBtnText.classList.add('hidden');
        generateLoader.classList.remove('hidden');
        
        try {
            const workoutPlan = await generateWorkoutPlan(userInput);
            displayWorkoutPlan(workoutPlan);
        } catch (error) {
            workoutPlanContent.innerHTML = `
                <p class="text-red-400">Sorry, there was an error generating your workout plan: ${error.message}</p>
                <p class="mt-4">Please try again with a different description.</p>
            `;
        } finally {
            generateBtnText.classList.remove('hidden');
            generateLoader.classList.add('hidden');
            workoutModal.classList.remove('hidden');
            setupModalAccessibility(workoutModal, closeWorkoutModalBtn);
        }
    });
    
    // Close workout modal
    closeWorkoutModalBtn.addEventListener('click', () => {
        workoutModal.classList.add('hidden');
    });
    
    // Allow submitting workout prompt with Enter key
    workoutPrompt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generatePlanBtn.click();
        }
    });
}

/**
 * Generate a workout plan using OpenAI API
 * @param {string} userInput - The user's input describing their goals
 * @returns {Promise<Object>} The generated workout plan
 */
async function generateWorkoutPlan(userInput) {
    // Improved prompt for better workout plan generation
    const prompt = `
        Create a detailed basketball workout plan based on the following user request: "${userInput}".
        
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

    // Use environment variable for API key in production
    // For this demo, we're using a placeholder - in production, use proper key management
    const apiKey = process.env.OPENAI_API_KEY || "sk-placeholder";
    
    try {
        // Actual OpenAI API call would go here
        // For demonstration, we'll return a mock response
        return mockGenerateWorkoutPlan(userInput);
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw new Error("Unable to generate workout plan");
    }
}

/**
 * Mock function to simulate OpenAI API response
 * In production, this would be replaced with actual API call
 * @param {string} userInput - The user's workout goal description
 * @returns {Object} A mock workout plan
 */
function mockGenerateWorkoutPlan(userInput) {
    // Check for keywords to customize the mock response
    const hasHandling = userInput.toLowerCase().includes("handle") || userInput.toLowerCase().includes("dribble");
    const hasShooting = userInput.toLowerCase().includes("shoot") || userInput.toLowerCase().includes("shot");
    const hasDefense = userInput.toLowerCase().includes("defense") || userInput.toLowerCase().includes("defend");
    const hasTime = userInput.match(/(\d+)\s*minutes?/);
    const duration = hasTime ? hasTime[1] + " minutes" : "60 minutes";
    
    let focusArea = "All-Around";
    if (hasHandling && hasShooting) focusArea = "Offensive Skills";
    else if (hasHandling) focusArea = "Ball Handling";
    else if (hasShooting) focusArea = "Shooting";
    else if (hasDefense) focusArea = "Defensive Skills";
    
    return {
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
    };
}

/**
 * Display the generated workout plan in the modal
 * @param {Object} plan - The workout plan object
 */
function displayWorkoutPlan(plan) {
    let html = `<h2 class="text-3xl font-bold text-white mb-2">${plan.planTitle}</h2>`;
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
    
    // Add print and save buttons
    html += `
        <div class="mt-8 flex gap-4 justify-end">
            <button id="print-workout-btn" class="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
            </button>
            <button id="save-workout-btn" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Plan
            </button>
        </div>
    `;
    
    document.getElementById('workout-plan-content').innerHTML = html;
    
    // Add event listeners to new buttons
    document.getElementById('print-workout-btn')?.addEventListener('click', () => {
        window.print();
    });
    
    document.getElementById('save-workout-btn')?.addEventListener('click', () => {
        // In a real implementation, this would save to user's account
        alert('This feature will save the workout to your account when implemented.');
    });
}

/**
 * Initialize blog helper AI functionality
 */
function initBlogHelper() {
    const blogHelperModal = document.getElementById('blog-helper-modal');
    const closeBlogHelperModalBtn = document.getElementById('close-blog-helper-modal-btn');
    const blogHelperOutput = document.getElementById('blog-helper-output');
    const blogHelperAskBtn = document.getElementById('blog-helper-ask-btn');
    const blogHelperPromptInput = document.getElementById('blog-helper-prompt');
    
    if (!blogHelperModal || !closeBlogHelperModalBtn || !blogHelperOutput || !blogHelperAskBtn) return;
    
    let currentArticleForAI = '';
    
    // Listen for AI blog button clicks
    document.addEventListener('click', async (e) => {
        const targetButton = e.target.closest('.ai-blog-btn');
        
        if (targetButton) {
            e.preventDefault();
            const postIndex = targetButton.dataset.index;
            const post = blogPosts[postIndex];
            
            if (!post) return;
            
            // Get clean text from HTML content
            currentArticleForAI = post.content.replace(/<[^>]*>?/gm, '');
            
            blogHelperOutput.innerHTML = '<div class="flex justify-center"><div class="w-8 h-8 rounded-full loader"></div></div>';
            blogHelperModal.classList.remove('hidden');
            
            try {
                const summary = await getBlogSummary(currentArticleForAI, post.title);
                blogHelperOutput.innerHTML = summary;
            } catch (error) {
                blogHelperOutput.innerHTML = `<p class="text-red-400">Sorry, there was an error generating the summary: ${error.message}</p>`;
            }
        }
    });
    
    // Handle asking follow-up questions
    blogHelperAskBtn.addEventListener('click', async () => {
        const userQuestion = blogHelperPromptInput.value;
        
        if (!userQuestion.trim() || !currentArticleForAI) return;
        
        const originalContent = blogHelperOutput.innerHTML;
        blogHelperOutput.innerHTML = '<div class="flex justify-center"><div class="w-8 h-8 rounded-full loader"></div></div>';
        
        try {
            const answer = await askAboutArticle(currentArticleForAI, userQuestion);
            blogHelperOutput.innerHTML = answer;
        } catch (error) {
            blogHelperOutput.innerHTML = `<p class="text-red-400">Sorry, I couldn't answer that question: ${error.message}</p>`;
        }
        
        blogHelperPromptInput.value = '';
    });
    
    // Close blog helper modal
    closeBlogHelperModalBtn.addEventListener('click', () => {
        blogHelperModal.classList.add('hidden');
    });
    
    // Submit question with Enter key
    blogHelperPromptInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            blogHelperAskBtn.click();
        }
    });
}

/**
 * Get a summary of a blog article using OpenAI API
 * @param {string} articleContent - The article content
 * @param {string} articleTitle - The article title
 * @returns {Promise<string>} The summary HTML
 */
async function getBlogSummary(articleContent, articleTitle) {
    // In a production environment, this would call OpenAI API
    // For demonstration, we'll return mock data
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a summary based on the article title
    if (articleTitle.includes('Biomechanics') || articleTitle.includes('Handle')) {
        return `
            <h3 class="text-lg font-semibold text-white mb-3">Key Takeaways</h3>
            <ul class="space-y-2 text-slate-300">
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>Elite ball handling is based on biomechanical principles that can be learned and mastered through deliberate practice.</span>
                </li>
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>Lowering your center of gravity by bending knees and hips provides stability and shortens the ball's travel distance.</span>
                </li>
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>The fingertips provide precise control while the palm generates power, creating a perfect balance for ball manipulation.</span>
                </li>
            </ul>
            <p class="mt-4 text-slate-400">Ask me a follow-up question about ball handling techniques or the science behind dribbling.</p>
        `;
    } else if (articleTitle.includes('Arc') || articleTitle.includes('Shot-Selection')) {
        return `
            <h3 class="text-lg font-semibold text-white mb-3">Key Takeaways</h3>
            <ul class="space-y-2 text-slate-300">
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>The three-point shot has fundamentally changed basketball strategy and offensive approaches.</span>
                </li>
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>Data analysis of over 1 million shots reveals the corner three as one of the most valuable shots in basketball.</span>
                </li>
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>Teams that understand the mathematical advantages of three-point shooting are consistently winning championships.</span>
                </li>
            </ul>
            <p class="mt-4 text-slate-400">Ask me a follow-up question about three-point shooting or shot selection strategies.</p>
        `;
    } else {
        return `
            <h3 class="text-lg font-semibold text-white mb-3">Key Takeaways</h3>
            <ul class="space-y-2 text-slate-300">
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>Professional basketball players follow extremely rigorous off-season training regimens starting as early as 5 AM.</span>
                </li>
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>A complete training day includes strength and conditioning, skill work, film study, and recovery sessions.</span>
                </li>
                <li class="flex gap-2">
                    <span class="text-orange-400">•</span>
                    <span>The dedication and discipline required to compete at the highest level goes far beyond regular practice sessions.</span>
                </li>
            </ul>
            <p class="mt-4 text-slate-400">Ask me a follow-up question about professional training routines or recovery methods.</p>
        `;
    }
}

/**
 * Ask a question about an article using OpenAI API
 * @param {string} articleContent - The article content
 * @param {string} question - The user's question
 * @returns {Promise<string>} The answer HTML
 */
async function askAboutArticle(articleContent, question) {
    // In a production environment, this would call OpenAI API
    // For demonstration, we'll return mock data
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Common questions and answers
    if (question.toLowerCase().includes('how long') || question.toLowerCase().includes('time')) {
        return `
            <div class="text-slate-300">
                <p>Based on the article, developing elite ball handling skills typically takes consistent practice over months or years. The author emphasizes that while it may look like natural talent, it's actually based on "repeatable, trainable biomechanics" that anyone can learn with sufficient dedication.</p>
                <p class="mt-2">Experts recommend daily practice sessions of 15-30 minutes focused specifically on dribbling to see significant improvement within 8-12 weeks.</p>
            </div>
        `;
    } else if (question.toLowerCase().includes('best drill') || question.toLowerCase().includes('exercise') || question.toLowerCase().includes('practice')) {
        return `
            <div class="text-slate-300">
                <p>The article suggests several effective drills for improving ball handling:</p>
                <ol class="list-decimal pl-5 mt-2 space-y-1">
                    <li>Low dribbling drills to improve finger control and strength</li>
                    <li>Two-ball dribbling exercises to develop coordination and separation</li>
                    <li>Figure-8 drills between and around the legs</li>
                    <li>Cone dribbling patterns with various moves at each change of direction</li>
                    <li>Reactive drills with a partner calling out move changes</li>
                </ol>
                <p class="mt-2">The key is to practice with purpose and gradually increase the speed and complexity as you improve.</p>
            </div>
        `;
    } else if (question.toLowerCase().includes('stat') || question.toLowerCase().includes('data') || question.toLowerCase().includes('analytic')) {
        return `
            <div class="text-slate-300">
                <p>The article mentions several key statistics about three-point shooting in modern basketball:</p>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                    <li>Teams with higher three-point attempt rates have seen a 12% increase in offensive efficiency over the last decade</li>
                    <li>Corner three-pointers have an average success rate of 39% league-wide, making them more valuable than most mid-range shots</li>
                    <li>The last 5 NBA champions have all ranked in the top 10 for three-point attempt rate</li>
                    <li>Analysis of over 1 million shots revealed the most efficient spots on the floor</li>
                </ul>
                <p class="mt-2">These analytics have driven the strategic shift toward perimeter-oriented offenses in modern basketball.</p>
            </div>
        `;
    } else {
        return `
            <div class="text-slate-300">
                <p>I don't have enough specific information from the article to answer that question in detail. The article focuses primarily on the biomechanics of ball handling, three-point shooting strategies, and professional training routines.</p>
                <p class="mt-2">You might want to ask something more specific about dribbling techniques, shooting strategy, or training approaches mentioned in the article.</p>
            </div>
        `;
    }
}

// Error handling for promises
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could add additional error reporting here
});