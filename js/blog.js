/**
 * Blog-specific JavaScript functionality for Hoopscope website
 */

document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
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
            excerpt: "Following our deep dive into the jump shot, we're back in the lab to unravel the secrets of elite ball handling. Using motion capture and newly developed pressure-sensing basketballs, we analyze how players maintain perfect control."
        },
        {
            title: "Beyond the Arc: How Shot-Selection Defines Modern Offenses",
            author: "Alex Rivera",
            date: "July 5, 2025",
            category: "Analytics",
            image: "https://images.unsplash.com/photo-1608245449223-342757f43769?q=80&w=2070&auto=format&fit=crop",
            excerpt: "The three-point line has fundamentally revolutionized basketball. We dive into the data to show how spacing and shot selection have become the keys to unlocking a high-powered offense in today's game."
        },
        {
            title: "A Day in the Life: Off-Season Training with a Pro",
            author: "Jasmine Chen",
            date: "June 28, 2025",
            category: "Pro Insights",
            image: "https://images.unsplash.com/photo-1594488541269-c4b5a73c3374?q=80&w=1974&auto=format&fit=crop",
            excerpt: "What does it really take to compete at the highest level? We follow a professional player through their rigorous off-season regimen, from the weight room to the court, revealing the dedication required for greatness."
        },
        {
            title: "Building Basketball IQ: Film Study Techniques from Elite Coaches",
            author: "Marcus Johnson",
            date: "June 15, 2025",
            category: "Training",
            image: "https://images.unsplash.com/photo-1519766304817-4f37bda74b38?q=80&w=2070&auto=format&fit=crop",
            excerpt: "The best players don't just watch film—they study it with purpose. Learn how NBA coaches break down game footage to improve decision-making and basketball intelligence."
        },
        {
            title: "Injury Prevention: Prehab Routines for Basketball Players",
            author: "Dr. Sarah Williams",
            date: "May 22, 2025",
            category: "Training",
            image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop",
            excerpt: "Don't wait until you're injured to start caring for your body. These science-backed prehabilitation routines can help players at all levels stay healthy and resilient throughout the season."
        },
        {
            title: "The Rise of Pickup Basketball Communities",
            author: "Tyrone Davis",
            date: "May 10, 2025",
            category: "Community",
            image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=2072&auto=format&fit=crop",
            excerpt: "From neighborhood courts to organized leagues, we explore how pickup basketball is creating powerful communities and connections across the country."
        }
    ];

    /**
     * Creates a DOM element for a blog post
     * @param {Object} post - The blog post data
     * @returns {HTMLElement} - The created DOM element
     */
    function createPostElement(post) {
        const postEl = document.createElement('div');
        postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col article-card scroll-animate';
        postEl.dataset.category = post.category;
        
        postEl.innerHTML = `
            <a href="article.html" class="block hover:opacity-80 transition-opacity">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover lazy-load" loading="lazy" data-src="${post.image}">
            </a>
            <div class="p-6 flex flex-col flex-grow card-content">
                <span class="text-orange-400 font-semibold text-sm">${post.category}</span>
                <h3 class="text-xl font-bold text-white my-2">${post.title}</h3>
                <p class="text-slate-400 text-sm mb-4 flex-grow">${post.excerpt}</p>
                <div class="flex items-center justify-between text-xs text-slate-500 mt-auto card-meta">
                    <span>By ${post.author} &bull; ${post.date}</span>
                    <a href="article.html" class="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Read More →</a>
                </div>
            </div>
        `;
        return postEl;
    }

    /**
     * Renders blog posts filtered by category
     * @param {string} category - The category to filter by (or 'all' for all posts)
     */
    function renderPosts(category = 'all') {
        if (!blogGrid) return;
        
        blogGrid.innerHTML = '';
        
        // Filter posts by category if needed
        const filteredPosts = category === 'all' 
            ? posts 
            : posts.filter(post => post.category === category);
        
        // Show message if no posts match the filter
        if (filteredPosts.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'col-span-full text-center py-8';
            noResults.innerHTML = `
                <p class="text-slate-400 text-lg">No posts found in the "${category}" category.</p>
                <button class="reset-filter mt-4 text-orange-400 hover:text-orange-300">Show all posts</button>
            `;
            blogGrid.appendChild(noResults);
            return;
        }
        
        // Add posts to the grid
        filteredPosts.forEach((post, index) => {
            const postEl = createPostElement(post);
            postEl.style.animationDelay = `${(index % 3) * 0.1}s`;
            blogGrid.appendChild(postEl);
        });
        
        // Initialize Intersection Observer for newly added elements
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseFloat(entry.target.style.animationDelay) || 0;
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, 
            { root: null, rootMargin: '0px', threshold: 0.2 }
        );
        
        document.querySelectorAll('#blog-grid .scroll-animate').forEach(el => observer.observe(el));
    }

    // Initialize posts
    renderPosts();

    // Handle category filter buttons
    if (categoryButtons) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter posts
                const category = btn.dataset.category;
                renderPosts(category);
            });
        });
    }

    // Handle "reset filter" button if it appears
    blogGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('reset-filter')) {
            // Reset active button
            categoryButtons.forEach(btn => {
                if (btn.dataset.category === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Show all posts
            renderPosts();
        }
    });

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
});