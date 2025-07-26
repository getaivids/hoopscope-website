# OpenAI API Integration Notes

- All former Gemini AI functionality migrated to OpenAI API (v1/completions or v1/chat/completions)
- Use serverless function or backend proxy for API key security: never expose keys client-side
- Environment variables must be set in hosting environment
- Error handling: show user-friendly error states for API/network failure
- Use prompt engineering: basketball analytics-specific templates for workout plans, blog Q&A
- Optimized settings: e.g., temperature 0.7, max_tokens 700 as starting points
- Input sanitization for user prompts

The frontend will now POST requests to the project's backend, which holds the OpenAI key securely. Blog and workout modules updated as such.
