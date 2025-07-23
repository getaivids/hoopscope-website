/**
 * Hoopscope Main JavaScript
 * Handles all UI interactions and business logic
 * 
 * @version 1.0.0
 * @author Hoopscope Development Team
 */

// Import API functions
import { generateWorkoutPlan, generateArticleSummary, answerArticleQuestion, mockOpenAIAPI } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const blogGridHomepage = document.getElementById('blog-grid-homepage');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const workoutModal = document.getElementById('workout-plan-modal');
    const closeWorkoutModalBtn = document.getElementById('close-workout-modal-btn');
    const workoutPlanContent = document.getElementById('workout-plan-content');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateLoader = document.getElementById('generate-loader');
    const errorMessage = document.getElementById('error-message');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const blogHelperModal = document.getElementById('blog-helper-modal');
    const closeBlogHelperModalBtn = document.getElementById('close-blog-helper-modal-btn');
    const blogHelperOutput = document.getElementById('blog-helper-output');
    const blogHelperAskBtn = document.getElementById('blog-helper-ask-btn');
    const blogHelperPromptInput = document.getElementById('blog-helper-prompt');
    const demoVideoBtn = document.getElementById('demo-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoModalBtn = document.getElementById('close-video-modal-btn');
    
    let currentArticleForAI = '';
    
    // --- Mobile Menu Functionality ---
    mobileMenuBtn?.addEventListener('click', () => {
        const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !expanded);
        mobileMenu.style.display = expanded ? 'none' : 'block';
    });
    
    // --- Video Modal Functionality ---
    demoVideoBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        videoModal.classList.remove('hidden');
    });
    
    closeVideoModalBtn?.addEventListener('click', () => {
        videoModal.classList.add('hidden');
    });
    
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

    /**
     * Create a blog post element
     * 
     * @param {Object} post - The post data object
     * @param {number} index - The index of the post in the array
     * @returns {HTMLElement} The created post element
     */
    function createPostElement(post, index) {
        const postEl = document.createElement('div');
        postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col scroll-animate';
        
        const contentSnippet = post.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
        postEl.innerHTML = `
            <a href="blog.html" class="block hover:opacity-80 transition-opacity">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/111111/444444?text=Image';">
            </a>
            <div class="p-6 flex flex-col flex-grow">
                <span class="text-orange-400 font-semibold text-sm">${post.category}</span>
                <h3 class="text-xl font-bold text-white my-2">${post.title}</h3>
                <p class="text-slate-400 text-sm mb-4 flex-grow">${contentSnippet}</p>
                <div class="flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span>By ${post.author} &bull; ${post.date}</span>
                    <button data-index="${index}" class="ai-blog-btn text-orange-400 font-semibold flex items-center gap-1 hover:text-orange-300">
                        ✨ Ask AI
                    </button>
                </div>
            </div>
        `;
        return postEl;
    }

    /**
     * Render the homepage blog posts
     */
    function renderHomepagePosts() {
        if (!blogGridHomepage) return;
        blogGridHomepage.innerHTML = '';
        const latestPosts = posts.slice(0, 3);
        latestPosts.forEach((post, index) => {
            const postEl = createPostElement(post, index);
            postEl.style.animationDelay = `${(index + 1) * 0.1}s`;
            blogGridHomepage.appendChild(postEl);
        });
    }

    // --- Intersection Observer for scroll animations ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.style.animationDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // --- AI Workout Plan Generator ---
    generatePlanBtn?.addEventListener('click', async () => {
        const userInput = document.getElementById('workout-prompt').value;
        errorMessage.classList.add('hidden');
        
        if (!userInput.trim()) {
            errorMessage.textContent = 'Please describe your training goals first.';
            errorMessage.classList.remove('hidden');
            return;
        }
        
        generateBtnText.classList.add('hidden');
        generateLoader.classList.remove('hidden');
        
        // Using mock API for demo to avoid costs
        // In production, use: const response = await generateWorkoutPlan(userInput);
        const response = await mockOpenAIAPI(userInput);
        
        generateBtnText.classList.remove('hidden');
        generateLoader.classList.add('hidden');
        
        if (response.error) {
            errorMessage.textContent = response.error;
            errorMessage.classList.remove('hidden');
            return;
        }
        
        if (response.result) {
            try {
                const plan = JSON.parse(response.result);
                let html = `<h2 id="workout-plan-title" class="text-3xl font-bold text-white mb-2">${plan.planTitle}</h2>`;
                html += `<p class="text-slate-400 mb-6">Estimated Duration: ${plan.duration}</p>`;
                
                plan.phases.forEach(phase => {
                    html += `<h3 class="text-xl font-semibold text-orange-400 mt-6 mb-3">${phase.phaseTitle}</h3>`;
                    html += '<ul class="space-y-3">';
                    phase.exercises.forEach(ex => {
                        html += `<li class="border-b border-zinc-700 pb-2"><strong class="text-white">${ex.name}:</strong> <span class="text-slate-400">${ex.details}</span></li>`;
                    });
                    html += '</ul>';
                });
                
                workoutPlanContent.innerHTML = html;
                
            } catch (e) {
                console.error('Error parsing JSON:', e);
                workoutPlanContent.innerHTML = `<p class="text-red-400">Could not generate the plan. Please try again.</p>`;
            }
        } else {
            workoutPlanContent.innerHTML = `<p class="text-red-400">Sorry, there was an error generating your workout plan. Please try again.</p>`;
        }
        
        workoutModal.classList.remove('hidden');
    });

    // Close workout modal
    closeWorkoutModalBtn?.addEventListener('click', () => workoutModal.classList.add('hidden'));
    
    // --- AI Blog Helper ---
    if (blogGridHomepage) {
        blogGridHomepage.addEventListener('click', async (e) => {
            const targetButton = e.target.closest('.ai-blog-btn');
            if (targetButton) {
                e.preventDefault();
                const postIndex = targetButton.dataset.index;
                const post = posts[postIndex];
                currentArticleForAI = post.content.replace(/<[^>]*>?/gm, ''); // Store clean text
                
                blogHelperOutput.innerHTML = '<div class="w-5 h-5 rounded-full loader mx-auto"></div>';
                blogHelperModal.classList.remove('hidden');
                
                // Using mock API for demo to avoid costs
                // In production, use: const response = await generateArticleSummary(currentArticleForAI);
                const response = await mockOpenAIAPI(currentArticleForAI);
                
                if (response.result) {
                    blogHelperOutput.innerHTML = response.result.replace(/\n/g, '<br>');
                } else if (response.error) {
                    blogHelperOutput.textContent = `Error: ${response.error}`;
                } else {
                    blogHelperOutput.textContent = 'Could not generate summary.';
                }
            }
        });
    }

    // Blog helper follow-up questions
    blogHelperAskBtn?.addEventListener('click', async () => {
        const userQuestion = blogHelperPromptInput.value;
        if (!userQuestion.trim() || !currentArticleForAI) return;
        
        blogHelperOutput.innerHTML = '<div class="w-5 h-5 rounded-full loader mx-auto"></div>';
        
        // Using mock API for demo to avoid costs
        // In production, use: const response = await answerArticleQuestion(userQuestion, currentArticleForAI);
        const response = await mockOpenAIAPI(userQuestion + ' ' + currentArticleForAI);
        
        if (response.result) {
            blogHelperOutput.innerHTML = response.result.replace(/\n/g, '<br>');
        } else if (response.error) {
            blogHelperOutput.textContent = `Error: ${response.error}`;
        } else {
            blogHelperOutput.textContent = 'Sorry, I could not answer that question.';
        }
        
        blogHelperPromptInput.value = '';
    });

    // Close blog helper modal
    closeBlogHelperModalBtn?.addEventListener('click', () => blogHelperModal.classList.add('hidden'));
    
    // Keyboard accessibility for modals
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            if (workoutModal && !workoutModal.classList.contains('hidden')) {
                workoutModal.classList.add('hidden');
            }
            if (blogHelperModal && !blogHelperModal.classList.contains('hidden')) {
                blogHelperModal.classList.add('hidden');
            }
            if (videoModal && !videoModal.classList.contains('hidden')) {
                videoModal.classList.add('hidden');
            }
        }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Close modals when clicking outside
    const handleOutsideClick = (e, modal, modalContent) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };
    
    if (workoutModal) {
        workoutModal.addEventListener('click', (e) => {
            handleOutsideClick(e, workoutModal, document.querySelector('#workout-plan-modal .modal'));
        });
    }
    
    if (blogHelperModal) {
        blogHelperModal.addEventListener('click', (e) => {
            handleOutsideClick(e, blogHelperModal, document.querySelector('#blog-helper-modal .modal'));
        });
    }
    
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            handleOutsideClick(e, videoModal, document.querySelector('#video-modal .modal'));
        });
    }
    
    // Initialize the page
    const init = () => {
        // Render blog posts
        renderHomepagePosts();
        
        // Set up intersection observer for animations
        document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    };

    // Initialize the page
    init();
    
    // Track page events for analytics
    trackEvent('page', 'view', 'home');
});

// Prevent layout shifts by setting image dimensions before load
const setImageDimensions = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.getAttribute('width') && !img.getAttribute('height')) {
            img.setAttribute('width', '100%');
            img.setAttribute('height', 'auto');
        }
    });
};

// Service worker registration for improved performance and offline capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// Set image dimensions to prevent layout shifts
setImageDimensions();

// Analytics tracking (placeholder for actual implementation)
const trackEvent = (category, action, label) => {
    console.log(`Analytics Event: ${category} - ${action} - ${label}`);
    // In production, implement proper analytics tracking
};