# Aadhaar & DBT Awareness Platform

A comprehensive, multi-language educational platform to help Indian students understand the differences between:
- **Aadhaar-Linked Bank Accounts**
- **Aadhaar-Seeded Bank Accounts**
- **DBT-Enabled Accounts**

## 🎯 MVP Features

✅ **Educational Module** - Clear explanations with real-life examples  
✅ **Comparison Table** - Side-by-side comparison of all three account types  
✅ **FAQ Section** - Answers to common questions  
✅ **Common Issues & Solutions** - Practical troubleshooting guide  
✅ **Contact Information** - Links to government helplines  
✅ **Multi-Language Support** - English + हिंदी (Hindi)  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Accessibility** - Dark mode support, reduced motion preferences  

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   This will open the app at `http://localhost:3000`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header.jsx       # Navigation & language switcher
│   ├── Hero.jsx         # Hero section
│   ├── Education.jsx    # Educational content
│   ├── Comparison.jsx   # Comparison table
│   ├── FAQ.jsx          # FAQ section
│   ├── ContactSection.jsx
│   └── Footer.jsx
├── data/                # Multi-language content
│   ├── en.js           # English content
│   └── hi.js           # Hindi content
├── scss/                # Styling
│   └── App.scss
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🌐 Language Support

The platform currently supports:
- **English (EN)** - Complete content
- **Hindi (हिंदी)** - Complete content with RTL support

To add more languages:
1. Create a new file in `src/data/` (e.g., `ta.js` for Tamil)
2. Follow the same structure as `en.js`
3. Add language button in `Header.jsx`

## 🎨 Customization

### Colors
Edit the color gradients in `src/scss/App.scss`:
- Primary: `#667eea` to `#764ba2`
- Success: `#27ae60` to `#229954`
- Warning: `#f39c12` to `#e67e22`

### Content
All educational content is in `src/data/`:
- `en.js` - English translations
- `hi.js` - Hindi translations

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility Features

- Semantic HTML
- Dark mode support
- Reduced motion preferences
- High contrast colors
- Mobile-friendly navigation

## 🔮 Future Enhancements (Post-MVP)

- Interactive quizzes
- Step-by-step verification guide
- Video tutorials
- Bank-specific instructions
- Community forum
- Government scheme repository

## 📝 License

Educational resource - Free to use and distribute

## 📞 Support

For official information, refer to:
- **UIDAI**: 1-800-300-1947
- **DBT Portal**: dbt.gov.in
- **NPCI**: 1-800-200-3344

## 👥 Contributing

Suggestions for improvements are welcome! Please ensure content is:
- Accurate and updated
- Simple and easy to understand
- Culturally appropriate
- Multilingual

---

Built with ❤️ for financial inclusion
