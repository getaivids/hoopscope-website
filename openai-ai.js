// AI utility to interact with OpenAI API using fetch and environment variable for API key (secured server-side!)
// This file should never expose any secret in client JS
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function getAIPlan(userRequest) {
  const prompt = `Create a detailed basketball workout plan based on the following request: "${userRequest}". The plan should include title, estimated duration, and distinct phases like 'Warmup', 'Drills', 'Cooldown', each with specific exercises and details. Output as structured JSON.`;
  const messages = [{ role: 'system', content: 'You are an expert basketball coach.' }, { role: 'user', content: prompt }];
  return callOpenAI(messages);
}

export async function getAISummary(article) {
  const prompt = `Summarize the following basketball article in 3 key bullet points:\n\n${article}`;
  const messages = [{ role: 'system', content: 'You provide expert, concise basketball analytics summaries.' }, { role: 'user', content: prompt }];
  return callOpenAI(messages);
}

export async function getAIAnswer(question, article) {
  const prompt = `Based on the article provided, answer the following question: "${question}"\n\nArticle:\n${article}`;
  const messages = [{ role: 'system', content: 'You answer conversationally, citing relevant basketball analytics.' }, { role: 'user', content: prompt }];
  return callOpenAI(messages);
}

async function callOpenAI(messages) {
  // API key must be injected/handled server-side; never expose key in code.
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Example: .env usage with Vite or injected by backend
  if (!apiKey) return 'AI service unavailable (missing API key).';
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages,
        max_tokens: 800
      })
    });
    if (!response.ok) throw new Error("API Error: " + response.status);
    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content?.trim() || 'No response';
    return content;
  } catch (e) {
    return 'Sorry, there was an AI error.';
  }
}