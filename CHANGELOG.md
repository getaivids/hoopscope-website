# CHANGELOG

## 2025-08-02: Major Refactor, AI, SEO & Content Improvements

### Code/Feature Updates
- Migrated all AI-powered code from Gemini API to OpenAI API (using secure proxy, not client-side keys)
- Improved image loading using native `loading=lazy` for all images.
- Enhanced JS error handling for all AI features.
- Improved accessibility (lang, better focus/ARIA placeholder, color contrast, modal interactions)
- Ensured full mobile responsiveness on all layouts.
- Code uses best practices (single main.js, modular, content not hardcoded)

### Blog/content
- Added metadata to all blog snippets; improved SEO descriptions/titles
- Blog posts are ready to be externalized for markdown management.
- Promoted new posts: biomechanics, shot selection, pro training.
- Refactored blog summary/AI helper to use OpenAI.

### Drive/GitHub Integration
- All files/folders structured in Google Drive (`/Hoopscope-v2/code`, `/content`, `/media`, etc.)
- All changes are committed to branch `feature/openai-migration-and-content-updates` for review before merge to main

### Other
- README/CHANGELOG updated
- Set recommendations for future: static site generator, make API endpoint config easier, move blog to markdown files for editor UX, extend AI helper prompts.

---
