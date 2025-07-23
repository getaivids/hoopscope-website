/**
 * Main JavaScript functionality for Hoopscope website
 * 
 * Contains UI interactions, blog post rendering, and intersection observers
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const blogGridHomepage = document.getElementById('blog-grid-homepage');
    const workoutModal = document.getElementById('workout-plan-modal');
    const closeWorkoutModalBtn = document.getElementById('close-workout-modal-btn');
    const blogHelperModal = document.getElementById('blog-helper-modal');
    const closeBlogHelperModalBtn = document.getElementById('close-blog-helper-modal-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }

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
     * Creates a DOM element for a blog post
     * @param {Object} post - The blog post data
     * @param {number} index - The index of the post in the array
     * @returns {HTMLElement} - The created DOM element
     */
    function createPostElement(post, index) {
        const postEl = document.createElement('div');
        postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col scroll-animate';
        
        // Clean content and get a snippet
        const contentSnippet = post.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
        
        postEl.innerHTML = `
            <a href="blog.html" class="block hover:opacity-80 transition-opacity">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover lazy-load" loading="lazy" data-src="${post.image}">
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
     * Renders blog posts on the homepage
     */
    function renderHomepagePosts() {
        if (!blogGridHomepage) return;
        
        blogGridHomepage.innerHTML = '';
        
        // Get the latest 3 posts
        const latestPosts = posts.slice(0, 3);
        
        latestPosts.forEach((post, index) => {
            const postEl = createPostElement(post, index);
            postEl.style.animationDelay = `${(index + 1) * 0.1}s`;
            blogGridHomepage.appendChild(postEl);
        });
    }

    // Initialize blog posts if we're on the homepage
    if (blogGridHomepage) {
        renderHomepagePosts();
    }

    // --- Intersection Observer for scroll animations ---
    const observerOptions = { 
        root: null, 
        rootMargin: '0px', 
        threshold: 0.2 
    };
    
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
    
    // Initialize the Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all elements with the scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    // --- Modal Controls ---
    
    // Workout Plan Modal
    if (closeWorkoutModalBtn && workoutModal) {
        closeWorkoutModalBtn.addEventListener('click', () => {
            workoutModal.classList.add('hidden');
            workoutModal.setAttribute('aria-hidden', 'true');
        });

        // Close modal on outside click
        workoutModal.addEventListener('click', (e) => {
            if (e.target === workoutModal) {
                workoutModal.classList.add('hidden');
                workoutModal.setAttribute('aria-hidden', 'true');
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !workoutModal.classList.contains('hidden')) {
                workoutModal.classList.add('hidden');
                workoutModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Blog Helper Modal
    if (closeBlogHelperModalBtn && blogHelperModal) {
        closeBlogHelperModalBtn.addEventListener('click', () => {
            blogHelperModal.classList.add('hidden');
            blogHelperModal.setAttribute('aria-hidden', 'true');
        });

        // Close modal on outside click
        blogHelperModal.addEventListener('click', (e) => {
            if (e.target === blogHelperModal) {
                blogHelperModal.classList.add('hidden');
                blogHelperModal.setAttribute('aria-hidden', 'true');
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !blogHelperModal.classList.contains('hidden')) {
                blogHelperModal.classList.add('hidden');
                blogHelperModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // --- AI Blog Helper Button Handlers ---
    if (blogGridHomepage) {
        blogGridHomepage.addEventListener('click', async (e) => {
            const targetButton = e.target.closest('.ai-blog-btn');
            if (targetButton) {
                e.preventDefault();
                
                // Get post data
                const postIndex = targetButton.dataset.index;
                const post = posts[postIndex];
                
                // Store post content and open modal
                if (window.handleBlogAI) {
                    window.handleBlogAI(post);
                }
            }
        });
    }

    // --- Lazy Loading for Images ---
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img.lazy-load').forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    lazyImageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy-load').forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    // --- Performance Monitoring ---
    if ('performance' in window && 'PerformanceObserver' in window) {
        // Create performance observer
        const perfObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach(entry => {
                // Log LCP, FID, CLS etc. for monitoring
                console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
            });
        });

        // Observe paint timing
        perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    }
});