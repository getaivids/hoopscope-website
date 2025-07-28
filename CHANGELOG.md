# Changelog

## 2025-07-28
- Migrated AI plan generator from Gemini API to OpenAI API (GPT-4 Turbo)
    - Replaced all placeholder calls
    - Improved error handling and API parameterization
    - Added advice for secure API key storage (env variable, not hardcoded)
- Optimized image handling: enabled lazy loading with fallback for broken images
- Enhanced site accessibility:
    - Keyboard navigation for modals
    - All images with alt text
    - Improved label/aria-usage
- Fixed CSS/HTML issues for mobile responsiveness
- Ensured all text colors have adequate contrast
- Enhanced modal/mobile UI performance
- Improved blog content readability and SEO metadata
- Suggested & documented future blog content topics
- Created organized Google Drive folder structure for code, blog, and documentation
- Initial GitHub repository setup: [hoopscope-website](https://github.com/getaivids/hoopscope-website)
- All JavaScript code now includes error handling & follows best practice patterns

---
For full details, see repo and folder changelogs. All major site features thoroughly tested on desktop & mobile browsers.