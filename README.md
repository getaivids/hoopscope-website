# Hoopscope Website

## Overview
Hoopscope is a basketball analytics and training platform designed to help players track their performance, study professional techniques, and train with purpose. The platform combines data-driven insights with AI-powered training recommendations.

## Features
- **Performance Analytics:** Track and analyze your basketball performance metrics
- **AI Training Plans:** Generate personalized workout routines using AI
- **Pro League Data:** Access and analyze professional basketball statistics
- **Basketball Blog:** Content focused on basketball technique and strategy
- **Smart Community:** Connect with other players and trainers

## Technical Implementation

### Frontend
- HTML5, CSS3 with TailwindCSS
- Vanilla JavaScript with modern ES6+ features
- Responsive design optimized for all device sizes
- Accessible following WCAG guidelines

### AI Integration
- OpenAI API integration for personalized training plans
- Content analysis for blog article summaries
- Interactive Q&A for blog content

### Performance Optimizations
- Lazy loading for images and non-critical resources
- Service worker for offline capabilities and caching
- Code splitting for optimal loading times
- Critical CSS inlined for faster initial render

### Accessibility Features
- Semantic HTML structure
- ARIA attributes where appropriate
- Keyboard navigation support
- Focus management for modals and interactive elements

## File Structure
- `index.html` - Main website file
- `js/api.js` - API integration module
- `js/main.js` - Main JavaScript functionality
- `service-worker.js` - Service worker for caching and offline support
- `blog.html` - Blog page

## Development

### Setting up the environment
1. Clone the repository
2. Set up environment variables (for API keys)
3. Open the HTML file in a browser for local development

### API Keys
API keys should be stored in environment variables and never committed to the repository. In production, use a secure method for managing environment variables.

```
OPENAI_API_KEY=your_api_key_here
```

## Deployment
The website is designed to be deployed to any static hosting service. For the best performance:

1. Configure proper caching headers for static assets
2. Enable HTTP/2 or HTTP/3 on your server
3. Use a CDN for global content delivery
4. Enable HTTPS for secure API communication

## Future Enhancements
- Implement user authentication system
- Add advanced analytics dashboard
- Develop mobile app companion
- Integrate with fitness tracking devices
- Expand AI capabilities for game analysis

## Browser Compatibility
The website is compatible with:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License
Copyright © 2025 Hoopscope Technologies Inc. All Rights Reserved.