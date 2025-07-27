// main.optimized.js - Improved Hoopscope site JS, OpenAI API integration

// --- Lazy loading for all images ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.classList.add('lazy');
    img.onload = () => img.classList.add('loaded');
  });
});

// --- Responsive modal focus trap for accessibility ---
function trapFocus(element) {
  const focusEls = element.querySelectorAll('a, button, textarea, input, [tabindex]:not([tabindex="-1"])');
  const firstEl = focusEls[0];
  const lastEl = focusEls[focusEls.length-1];
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      } else {
        if (document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    }
  });
  if (firstEl) firstEl.focus();
}

// --- OpenAI API Functionality ---
const API_URL = 'https://api.openai.com/v1/chat/completions';
// Best practice: store REAL key server-side or as environment, not client
const OPENAI_API_KEY = window.OPENAI_API_KEY || '';

async function callOpenAI(prompt, schema = null) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Contact site admin.');
  }
  const body = {
    model: "gpt-4-turbo",
    messages: [ { role: 'user', content: prompt } ],
    ...(schema && { response_format: { type: 'json_object' } })
  };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('OpenAI API error: ' + res.status);
  const result = await res.json();
  if (schema) {
    try {
      return JSON.parse(result.choices[0].message.content);
    } catch {
      throw new Error('Received unexpected format from OpenAI API');
    }
  }
  return result.choices[0].message.content;
}

// --- AI Workout Plan Generator ---
document.addEventListener('DOMContentLoaded', () => {
  // Elements from your HTML, update IDs if they change
  const generatePlanBtn = document.getElementById('generate-plan-btn');
  const workoutModal = document.getElementById('workout-plan-modal');
  const workoutPlanContent = document.getElementById('workout-plan-content');
  const generateBtnText = document.getElementById('generate-btn-text');
  const generateLoader = document.getElementById('generate-loader');

  generatePlanBtn.addEventListener('click', async () => {
    const promptInput = document.getElementById('workout-prompt');
    if (!promptInput.value.trim()) {
      workoutPlanContent.innerHTML = `<p class="text-red-400">Please describe your training goals first.</p>`;
      workoutModal.classList.remove('hidden');
      return;
    }
    generateBtnText.classList.add('hidden');
    generateLoader.classList.remove('hidden');
    const prompt = `Create a detailed basketball workout plan based on the following user request: "${promptInput.value}". The plan should be structured with a title, an estimated duration, and distinct phases like 'Warmup', 'Drills', and 'Cooldown'. Each phase should contain a list of specific exercises with descriptions and durations or reps.`;
    try {
      const plan = await callOpenAI(prompt, true);
      let html = `<h2 class='text-3xl font-bold mb-2'>${plan.planTitle}</h2>`;
      html += `<p class='text-slate-400 mb-6'>Estimated Duration: ${plan.duration}</p>`;
      plan.phases.forEach(phase => {
        html += `<h3 class='text-xl font-semibold text-orange-400 mt-6 mb-3'>${phase.phaseTitle}</h3>`;
        html += '<ul class="space-y-3">';
        phase.exercises.forEach(ex => {
          html += `<li class='border-b border-zinc-700 pb-2'><strong>${ex.name}:</strong> ${ex.details}</li>`;
        });
        html += '</ul>';
      });
      workoutPlanContent.innerHTML = html;
    } catch (e) {
      workoutPlanContent.innerHTML = `<p class="text-red-400">${e.message || 'Sorry, there was an error generating your workout plan.'}</p>`;
    }
    generateBtnText.classList.remove('hidden');
    generateLoader.classList.add('hidden');
    workoutModal.classList.remove('hidden');
    trapFocus(workoutModal);
  });
});

// Add similar handler for AI Blog Helper, SEO metadata, and others based on main requirements...
