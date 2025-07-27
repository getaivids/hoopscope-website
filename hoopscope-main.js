// Main JS for Hoopscope
// --- Blog, AI, Accessibility, Performance ---
// 1. Blog Rendering (improved a11y, SEO)
// 2. Lazy Loading images
// 3. Intersection Observer for animation
// 4. AI OpenAI API integration
// 5. Error handling/UX improvements
// 6. Environment variable sample (API key)

const posts = [/*...blog posts as before...*/];

document.addEventListener('DOMContentLoaded', () => {
    const blogGridHomepage = document.getElementById('blog-grid-homepage');
    // ... more DOM code ...
    // Lazy loading for all blog images
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading]')
            .forEach(img => { img.setAttribute('loading','lazy'); });
    } else {
        // Intersection-based lazy fallback
        let imgs = document.querySelectorAll('img');
        let lazyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    lazyObserver.unobserve(img);
                }
            });
        });
        imgs.forEach(img => lazyObserver.observe(img));
    }

    // Improved: AI Features now use OpenAI's API
    async function callOpenAIAPI(prompt, opts = {}) {
        const apiKey = window.OPENAI_API_KEY;
        if (!apiKey) {
            return 'OpenAI API key not configured.';
        }
        try {
            const resp = await fetch('https://api.openai.com/v1/chat/completions', {
                method:'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model:'gpt-3.5-turbo',
                    messages:[{role:'user',content:prompt}],
                    ...opts
                })
            });
            if (!resp.ok) throw new Error('OpenAI API error '+resp.status);
            const data = await resp.json();
            return data.choices && data.choices[0].message.content;
        } catch(err) {
            console.error('OpenAI:', err);
            return 'An error occurred accessing AI services.';
        }
    }

// Rest of modal/event/ui handlers omitted for brevity, but now reference callOpenAIAPI.

// API Key secure handling
// (In production, use .env, never commit keys)
window.OPENAI_API_KEY = (window.OPENAI_API_KEY || ''); // injected by server, never hardcoded
});
