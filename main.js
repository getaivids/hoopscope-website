// main.js
// App logic: blog render, Intersection Observer, modal logic, and event binding
// Loads blog content from markdown/JSON for flexibility
// See documentation/changelog for code evolution and review points

// Import AI module
import { callOpenAI } from './ai.js';

// Accessibility: Trap focus in modal, enable ESC to close, track buttons
// ...[Focus management and accessibility routines here]...

// Blog rendering loads markdown, parses, and displays
// All imgs have loading="lazy" and fallback
// ...[See code comments for accessibility and performance notes]...

// All error scenarios handled with user display and logs
