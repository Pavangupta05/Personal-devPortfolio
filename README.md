# 🎨 Pavan Kumar Gupta - Full Stack Developer Portfolio

A modern, responsive portfolio website showcasing full-stack development skills with MERN stack technologies, interactive animations, and a polished user experience.

## ✨ Features

### 🎯 Core Features
- **Responsive Design** - Mobile-first approach with 7 breakpoints
- **Dark & Light Mode** - Toggle theme with localStorage persistence
- **Glassmorphism Design** - Modern UI with backdrop blur effects
- **Smooth Animations** - ScrollReveal, parallax effects, LERP-based interactivity
- **Particle Background** - Interactive canvas particles with mouse repulsion

### 📱 Sections
- **Home** - Typewriter effect hero with CTA buttons
- **About** - Profile summary with resume download
- **Skills** - 8 skills with proficiency progress bars
- **Experience** - 2 professional experience entries
- **Certificates** - 3 certifications showcase
- **Projects** - 3 featured projects with filtering
  - **Filtering by Tech Stack** - React, Node.js, Vanilla JS
  - **Project Details** - Full descriptions and tech badges
  - **Live Links & GitHub Repos** - Direct access to projects
- **Education** - Academic qualifications
- **Testimonials** - Client/colleague testimonials with ratings
- **Contact** - Contact form with validation + multiple contact methods
- **Footer** - Social media links (6+ platforms)

### 🚀 Enhancements

#### New Features Added
1. **Testimonials Section** - 4 client testimonial cards with ratings
2. **Form Validation** - Real-time input validation with error messages
3. **Project Filtering** - Filter projects by tech stack (All, React, Node.js, Vanilla JS)
4. **Proficiency Bars** - Visual skill level indicators (80-95%)
5. **Light Mode Toggle** - Theme switcher with smooth transitions
6. **Enhanced Social Links** - Added Twitter, Instagram, WhatsApp
7. **SEO Optimization** - Meta tags, OG tags, and proper structured data
8. **Improved Accessibility** - Better contrast ratios, focus states, ARIA labels
9. **Custom Cursor** - Animated cursor with visual feedback
10. **Build Process** - Vite configuration for production-ready bundles
11. **Better Hover States** - Smooth transitions and underline indicators
12. **CV Download Button** - Quick access to resume in hero section

#### Technical Improvements
- **Vercel Speed Insights** - Performance monitoring integrated
- **Form Error Handling** - Client-side validation with helpful messages
- **Theme Persistence** - localStorage saves user's theme preference
- **Mobile Optimization** - Touch-friendly interactions and responsive text
- **Performance Tweaks** - Optimized animations and reduced motion support

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, glassmorphism effects
- **JavaScript (ES6+)** - Dynamic interactions and animations
- **ScrollReveal.js** - Scroll animations
- **Vite** - Build tool and dev server

### Performance Tools
- **Vercel Speed Insights** - Web performance monitoring
- **Optimized Bundle** - Minified CSS and JS with Vite

## 📊 Project Structure

```
Portfolio_orig/
├── index.html          # Main HTML file
├── style.css           # All styles (dark + light mode)
├── script.js          # Interactive features and animations
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite build configuration
├── .gitignore         # Git ignored files
└── assets/            # Images and media
    ├── ProfilePhoto.png
    ├── ChatApp.png
    └── ...other images
```

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pavangupta05/portfolio.git
   cd portfolio/Portfolio_orig
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development server**
   ```bash
   npm run dev
   ```
   Opens http://localhost:3000 in your browser

4. **Build for production**
   ```bash
   npm run build
   ```
   Creates optimized `dist/` folder

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Customization

### Change Color Scheme
Edit CSS variables in `style.css`:
```css
:root {
  --accent: #FF6B00;              /* Primary accent */
  --accent-2: #7c3aed;            /* Secondary accent */
  --accent-3: #22d3ee;            /* Tertiary accent (cyan) */
}
```

### Modify Content
- **Skills**: Edit skill cards in HTML and add proficiency percentages
- **Projects**: Update project cards with links and descriptions
- **Testimonials**: Add/remove testimonial cards with ratings
- **Social Links**: Update footer social media URLs

### Add More Projects
```html
<div class="project-card scroll-reveal" data-project-tags="react nodejs">
  <!-- Your project content -->
</div>
```

## ⚡ Features in Detail

### Light Mode Toggle
- Click the sun/moon icon in navbar
- Automatically switches all UI elements
- Saves preference to localStorage
- Smooth transition effects

### Project Filtering
- Click filter buttons: All, React, Node.js, Vanilla JS
- Dynamically shows/hides projects based on tech stack
- Smooth animations

### Form Validation
- **Name** - Minimum 2 characters
- **Email** - Valid email format
- **Message** - Minimum 10 characters
- Real-time error messages below each field
- Success modal on submission

### Responsive Breakpoints
- 1200px - Large desktop
- 992px - Desktop
- 820px - Tablets
- 768px - Mobile landscape
- 640px - Mobile
- 480px - Small mobile
- 400px - Extra small mobile

## 📈 Performance

- **Vite Build** - Fast, optimized bundles
- **Minified Assets** - Reduced file sizes
- **Lazy Loading** - Images loaded on demand
- **Smooth Animations** - 60fps using RequestAnimationFrame
- **Speed Insights** - Monitored with Vercel

## 🔒 Security

- No sensitive data exposed
- FormSubmit.co for secure form handling
- CORS properly configured
- Content Security Policy ready

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 📄 License

MIT License - Feel free to use this portfolio as a template

## 👤 Author

**Pavan Kumar Gupta**
- GitHub: [@Pavangupta05](https://github.com/Pavangupta05)
- LinkedIn: [Pavan Kumar Gupta](https://www.linkedin.com/in/pavan-kumar-gupta-837089290/)
- Email: pavangupta150605@gmail.com
- WhatsApp: +91 8005872338

## 🙏 Acknowledgments

- ScrollReveal for scroll animations
- Vercel for Speed Insights integration
- FormSubmit for secure form handling
- Font Awesome for icons

---

Made with ❤️ by Pavan Kumar Gupta
