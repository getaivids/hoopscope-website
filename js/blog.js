/**
 * Blog-specific JavaScript functionality for Hoopscope website
 */

document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    let allPosts = []; // To store all fetched posts

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
     * @param {number} index - The original index of the post
     * @returns {HTMLElement} - The created DOM element
     */
    function createPostElement(post, index) {
        const postEl = document.createElement('div');
        postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col article-card scroll-animate';
        postEl.dataset.category = post.category;
        
        const excerpt = post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '');

        postEl.innerHTML = `
            <a href="article.html?post=${index}" class="block hover:opacity-80 transition-opacity">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover" loading="lazy">
            </a>
            <div class="p-6 flex flex-col flex-grow card-content">
                <span class="text-orange-400 font-semibold text-sm">${post.category}</span>
                <h3 class="text-xl font-bold text-white my-2">${post.title}</h3>
                <p class="text-slate-400 text-sm mb-4 flex-grow">${excerpt}</p>
                <div class="flex items-center justify-between text-xs text-slate-500 mt-auto card-meta">
                    <span>By ${post.author} &bull; ${post.date}</span>
                    <a href="article.html?post=${index}" class="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Read More →</a>
                </div>
            </div>
        `;
        return postEl;
    }

    /**
     * Initializes intersection observers for scroll animations.
     */
    function initializeObservers() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('#blog-grid .scroll-animate').forEach(el => observer.observe(el));
    }

    /**
     * Renders blog posts filtered by category
     * @param {string} category - The category to filter by (or 'all' for all posts)
     */
    function renderPosts(category = 'all') {
        if (!blogGrid) return;
        
        blogGrid.innerHTML = '';
        
        const filteredPosts = category.toLowerCase() === 'all'
            ? allPosts
            : allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
        
        if (filteredPosts.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'col-span-full text-center py-8';
            noResults.innerHTML = `<p class="text-slate-400 text-lg">No posts found in the "${category}" category.</p>`;
            blogGrid.appendChild(noResults);
            return;
        }
        
        // Sort by date before rendering
        const sortedPosts = filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedPosts.forEach(post => {
            const originalIndex = allPosts.findIndex(p => p.title === post.title);
            const postEl = createPostElement(post, originalIndex);
            blogGrid.appendChild(postEl);
        });
        
        initializeObservers();
    }

    /**
     * Fetches posts and sets up the page.
     */
    async function init() {
        try {
            const response = await fetch('/blog-posts.json');
            if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
            allPosts = await response.json();

            // Initial render of all posts
            renderPosts();

        } catch (error) {
            console.error("Error loading blog posts:", error);
            if(blogGrid) blogGrid.innerHTML = `<p class="text-red-400 text-center col-span-full">Failed to load blog posts.</p>`;
        }
    }

    // Setup category filter buttons
    if (categoryButtons) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                renderPosts(category);
            });
        });
    }

    // Initial load
    init();
});