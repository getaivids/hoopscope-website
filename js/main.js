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

    // Store posts globally after fetching
    let allPosts = [];

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }

    /**
     * Creates a DOM element for a blog post
     * @param {Object} post - The blog post data
     * @param {number} index - The index of the post in the array
     * @returns {HTMLElement} - The created DOM element
     */
    function createPostElement(post, index) {
        const postEl = document.createElement('div');
        postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col scroll-animate';
        
        // Use the full content for the snippet, as the JSON content is already short
        const contentSnippet = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');
        
        postEl.innerHTML = `
            <a href="article.html?post=${index}" class="block hover:opacity-80 transition-opacity">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover" loading="lazy">
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
     * @param {Array<Object>} posts - The array of blog post data
     */
    function renderHomepagePosts(posts) {
        if (!blogGridHomepage) return;
        
        blogGridHomepage.innerHTML = '';
        
        // Get the latest 3 posts, sorted by date
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestPosts = sortedPosts.slice(0, 3);
        
        latestPosts.forEach((post, index) => {
            const originalIndex = allPosts.findIndex(p => p.title === post.title);
            const postEl = createPostElement(post, originalIndex);
            postEl.style.animationDelay = `${(index + 1) * 0.1}s`;
            blogGridHomepage.appendChild(postEl);
        });
    }

    /**
     * Initializes intersection observers for animations.
     */
    function initializeObservers() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.style.animationDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay * 100);
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    }

    /**
     * Fetches blog posts from the JSON file and renders them.
     */
    async function loadAndRenderPosts() {
        try {
            const response = await fetch('/blog-posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allPosts = await response.json();

            if (blogGridHomepage) {
                renderHomepagePosts(allPosts);
            }
            // Initialize observers for any animated elements, including the newly rendered posts
            initializeObservers();
        } catch (error) {
            console.error("Could not fetch blog posts:", error);
            if (blogGridHomepage) {
                blogGridHomepage.innerHTML = '<p class="text-red-400">Failed to load blog posts. Please try again later.</p>';
            }
        }
    }

    // --- Modal Controls ---
    const setupModal = (modal, closeBtn) => {
        if (!modal || !closeBtn) return;
        const closeModal = () => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        };
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    };

    setupModal(document.getElementById('workout-plan-modal'), document.getElementById('close-workout-modal-btn'));
    setupModal(document.getElementById('blog-helper-modal'), document.getElementById('close-blog-helper-modal-btn'));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-bg:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
            });
        }
    });

    // --- AI Blog Helper Button Handlers ---
    if (blogGridHomepage) {
        blogGridHomepage.addEventListener('click', async (e) => {
            const targetButton = e.target.closest('.ai-blog-btn');
            if (targetButton) {
                e.preventDefault();
                const postIndex = parseInt(targetButton.dataset.index, 10);
                const post = allPosts[postIndex];
                if (post && window.handleBlogAI) {
                    window.handleBlogAI(post);
                } else {
                    console.error("Could not find post or AI handler for index:", postIndex);
                }
            }
        });
    }

    // --- Initial Load ---
    loadAndRenderPosts();
});