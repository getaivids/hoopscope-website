// ai-integration.js - OpenAI API helper for Hoopscope
// IMPORTANT: API key is never in client code. Use environment/serverless function.

export async function callOpenAI(prompt, schema = null) {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, schema })
    });
    if (!response.ok) {
      throw new Error('OpenAI API error: ' + response.status);
    }
    const result = await response.json();
    return result.text || result.choices?.[0]?.text || '';
  } catch (err) {
    console.error('OpenAI API failure:', err);
    return null;
  }
}
