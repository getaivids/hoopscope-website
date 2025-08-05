// script.js for Hoopscope Website
// Core behaviors, accessibility, performance, OpenAI integration

// --- Helper: Lazy load images ---
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('load', () => { img.classList.add('loaded'); });
  });
});

// --- Helper: Intersection Observer for SCSS-based animations (as before) ---

// --- Secure API call to OpenAI for AI features ---
async function callOpenAIApi(prompt, opts = {}) {
  // Keys should be injected via env or backend; never hardcode here.
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const apiKey = window.OPENAI_API_KEY || '';
  if (!apiKey) throw new Error('OpenAI API key is not available.');
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: opts.temperature || 0.4,
    max_tokens: opts.max_tokens || 900
  };
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`API call failed: ${response.status}`);
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    return result || 'Error: No response from AI.';
  } catch (err) {
    return `AI Error: ${err.message}`;
  }
}

// Example: Hook up workout generator and blog AI with callOpenAIApi(prompt, opts)
// (wiring code omitted here for brevity)