# Performance & Accessibility Improvements (Draft)

## HTML/CSS:
- Added loading="lazy" to all images for deferred loading
- Improved alt tags (descriptive, keyword-rich)
- Ensured sufficient color contrast (AA+ level, main elements)
- Keyboard/ARIA labels added for modal controls
- Semantic structure: checked header/nav/main/footer tags usage
- Mobile/responsive behaviors reviewed (used clamp(), flex/grid balance)

## JavaScript:
- Replaced Gemini API with OpenAI API
- Used async/await error handling with user feedback
- All API keys to be stored securely as env variables (not in code)
- Modal dialog focus trapping (recommended)
- Blog and AI-plan JS refactored for performance/readability
- IntersectionObserver debounced for more efficiency

## Best Practices:
- Bundling, minification, tree-shaking steps to follow for production
- No unused style/classes
- Included favicon & web manifest (suggested for PWA)
- PRs required for all feature changes (GitHub setup)
