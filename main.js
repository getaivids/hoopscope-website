// main.js

// ------------- Accessibility and Responsive Improvements -------------
document.documentElement.lang = "en";

// Add lazy loading for all images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
});

// Screen reader and aria-support for future interactive elements; add tab indices as needed

// ------------- Blog Rendering & Content Management -------------
const posts = [
  // ... [same structure as provided], consider externalizing for content folder
];
function renderHomepagePosts() {
    // ... render blog posts dynamically, as previous
}

document.addEventListener('DOMContentLoaded', renderHomepagePosts);

// ------------- AI Features Integration -------------
async function callOpenAIApi(prompt, opts = {}) {
    // REQUIRES SECURE BACKEND (see README)
    const apiUrl = '/api/openai-proxy'; // never expose API key on client
    const payload = { prompt, ...opts };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.text || data.choices?.[0]?.text || data.choices?.[0]?.message?.content;
    } catch (e) {
      return `Error: ${e.message}`;
    }
}

// Workout Plan Generation (with error handling)
document.getElementById('generate-plan-btn')?.addEventListener('click', async () => {
  const prompt = document.getElementById('workout-prompt').value.trim();
  if (!prompt) {
    document.getElementById('workout-plan-content').innerHTML = '<p class="text-red-400">Please enter your goals.</p>';
    document.getElementById('workout-plan-modal').classList.remove('hidden');
    return;
  }
  // Show loader ...
  
  const msg = `Create a basketball workout plan: ${prompt}`;
  // Add context for AI (role, structure, etc.)
  const result = await callOpenAIApi(msg, {
    system: "You are a basketball analytics and training expert. Always answer using structured lists, clear instructions and state estimated times."
  });
  document.getElementById('workout-plan-content').innerHTML = result || 'Error.';
  document.getElementById('workout-plan-modal').classList.remove('hidden');
});

// Blog Helper Example Usage
document.getElementById('blog-grid-homepage')?.addEventListener('click', async e => {
  const btn = e.target.closest('.ai-blog-btn');
  if (!btn) return;
  const i = btn.dataset.index;
  const post = posts[i];
  const summary = await callOpenAIApi(`Summarize this basketball article in 3 bullet points: ${post.content.replace(/<[^>]*>?/gm, '')}`);
  document.getElementById('blog-helper-modal').classList.remove('hidden');
  document.getElementById('blog-helper-output').innerText = summary;
});

// Accessible close modal
document.querySelectorAll('.modal .close-btn').forEach(btn => {
  btn.addEventListener('click', e => btn.closest('.modal-bg').classList.add('hidden'));
});

// ------------- End of main.js -------------