# Hoopscope Website

A data-driven basketball analytics, training, and community platform.

## Overview

Hoopscope is a web platform designed to help basketball players at all levels improve their game through data-driven insights, professional training methods, and community engagement. The platform combines analytics, training tools, and content to provide a comprehensive basketball improvement experience.

## Features

- **Performance Analytics**: Track stats, identify patterns, and measure improvement
- **Pro League Data**: Access insights from NBA and EuroLeague
- **AI-Powered Training**: Generate personalized workout plans
- **Blog & Content**: In-depth articles on basketball technique and strategy
- **Smart Community**: Connect with other players and coaches

## Technical Details

### Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS
- **API Integration**: OpenAI API for AI features
- **Performance**: Lazy loading, optimized assets, responsive design

### File Structure

```
hoopscope/
├── index.html              # Main homepage
├── hoopscope-blog.html     # Blog page
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   ├── main.js         # Homepage JavaScript
│   │   └── blog.js         # Blog page JavaScript
│   └── images/
│       ├── favicon.svg     # Site favicon
│       └── apple-touch-icon.png # iOS icon
├── README.md               # Project documentation
└── CHANGELOG.md            # Record of all changes
```

## Setup & Development

### Prerequisites

- A modern web browser
- Basic understanding of HTML, CSS, and JavaScript
- API key for OpenAI (for production use)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/your-username/hoopscope.git
   ```

2. Open the project in your code editor

3. For API functionality, set up environment variables (see "API Integration" section)

4. Open `index.html` in your browser or use a local development server

### API Integration

The website uses OpenAI API for its AI features. For security reasons, API keys should never be exposed in client-side code. In production:

1. Set up a secure backend proxy to handle API calls
2. Store API keys as environment variables on the server
3. Use environment-specific configuration for development/production

## Deployment

For production deployment:

1. Minify all CSS and JavaScript files
2. Optimize images
3. Set up proper caching headers
4. Configure a secure backend for API requests
5. Implement proper analytics and monitoring

## Accessibility

The website is built with accessibility in mind:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus states for interactive elements
- Reduced motion options for animations
- Color contrast ratios meeting WCAG standards

## Browser Support

The website is designed to work on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact hoopscope@example.com.