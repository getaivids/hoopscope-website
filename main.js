// main.js (Improved for Hoopscope v2, July 2025)
// 1. All OpenAI API calls centralized and async, no hardcoded keys
window.OPENAI_API_KEY = undefined; // Set at runtime (NEVER HARDCODE)

async function callOpenAI(prompt, systemPrompt) {
  const apiKey = window.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OpenAI API key. Set via environment or secure input.');
  const resp = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
    body:JSON.stringify({
      model:'gpt-4-turbo',
      messages:[
        {role:'system',content: systemPrompt || 'You are an expert AI basketball trainer.'},
        {role:'user',content:prompt}
      ],
      max_tokens:1000
    })
  });
  if (!resp.ok) throw new Error('OpenAI network/API error');
  const data = await resp.json();
  if(data && data.choices && data.choices[0]) return data.choices[0].message.content;
  return null;
}

// 2. Lazy loading for images
function enableLazyImages() {
  document.querySelectorAll('img').forEach(img => { img.loading = "lazy"; });
}
document.addEventListener('DOMContentLoaded', enableLazyImages);

// 3. AI Plan Generation: error handling, disable-while-wait
const planBtn = document.getElementById('generate-plan-btn');
if(planBtn){
  planBtn.addEventListener('click',async()=>{
    const input = document.getElementById('workout-prompt').value.trim();
    if(!input) return;
    planBtn.disabled=true;
    let out = document.getElementById('workout-plan-content');
    out.innerText='Generating...';
    try{
      const prompt = `Design a custom basketball training plan for: ${input}.
The output must have a title, an estimated total duration, and phases (Warmup, Drills, Cooldown) with clear drill descriptions and set/training guidance.`;
      const plan = await callOpenAI(prompt);
      out.innerHTML = plan ? plan.replace(/\n/g,'<br>') : 'Could not generate a plan.';
    }catch(e){
      out.innerText = 'Error: Failed to generate, try again.';
    }
    planBtn.disabled=false;
  });
}

// 4. Blog Helper: safe prompt optimization
const blogBtns = document.querySelectorAll('.ai-blog-btn');
blogBtns.forEach(btn=>{
  btn.addEventListener('click', async()=>{
    const postIdx = btn.dataset.index;
    const article = posts[postIdx] ? posts[postIdx].content.replace(/<[^>]*>?/gm, '') : '';
    const out = document.getElementById('blog-helper-output');
    out.innerText = 'Analyzing...';
    try {
      const summary = await callOpenAI(`Summarize the main takeaways in three short, actionable points. Article:\n${article}`);
      out.innerText = summary || 'No summary returned.';
    } catch (e) {
      out.innerText = 'Error: Could not analyze.';
    }
  });
});

// 5. Accessibility and responsive UI improvements can be handled via Tailwind and checking with audit tools (see README).