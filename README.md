# 🎴 MAXIM - Covert Card Revelation App

![MAXIM](https://img.shields.io/badge/MAXIM-Card%20Magic-e84a5f?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-2d1b4e?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-success?style=for-the-badge)

> **Professional covert card revelation app for magicians** - Instantly calculate and discreetly deliver the perfect hands-off reveal for any freely named card in a shuffled deck.

<p align="center">
  <img src="maxim.png" alt="MAXIM App Interface" width="300"/>
</p>

## ✨ Features

### 🎯 Core Functionality
- **Zero Memory Work**: No need to memorize stack positions
- **Instant Calculations**: Get up to 3 different reveal methods in seconds
- **Covert Operation**: Phone use appears natural and unrelated to the trick
- **Beautiful Interface**: Purple-themed design with smooth animations
- **Multiple Reveal Types**:
  - 📅 Date-based reveals (deal to today's date)
  - 🔤 Spelling reveals (spell the card name)
  - 🎂 Birthday reveals (personal connection)
  - 🎲 Lucky number reveals
  - 📍 Direct position reveals

### 🃏 Stack Support
- **Pre-configured Stacks**:
  - Mnemonica (Tamariz)
  - Aronson Stack
  - Eight Kings
  - Si Stebbins
- **Custom Stack Editor**: Create and save your own stack
- **Visual Stack Management**: Easy drag-and-drop interface

### 👤 Spectator Profiles
- Save spectator information (name, birthday, lucky numbers)
- Create personalized reveals
- Build stronger connections with your audience

### 📊 Performance Tracking
- Track total performances
- See most-used cards
- Analyze your magic statistics

### 🔧 Advanced Features
- **PWA (Progressive Web App)**: Install on phone, works offline
- **Vibration Notifications**: Discrete haptic feedback
- **Customizable Reveals**: Enable/disable specific reveal types
- **Multi-language Ready**: Easy to translate
- **Dark Mode**: Easy on the eyes during performances

## 🚀 Quick Start

### Online Demo
Visit the live demo: [MAXIM Web App](https://your-demo-link.com)

### Installation

#### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your app will be available at `https://yourusername.github.io/maxim`

#### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/maxim.git

# Navigate to directory
cd maxim

# Serve with any static server
python -m http.server 8000
# or
npx serve
```

#### Option 3: Install as PWA
1. Open the web app in your mobile browser
2. Tap "Add to Home Screen"
3. Launch like a native app

## 📱 How to Use

### Basic Workflow

1. **Hand spectator the deck** (in your chosen stack)
2. **Spectator freely names a card** while shuffling
3. **Discreetly select the card** in the app
4. **Tap "Calculate Reveals"**
5. **Receive 3 instant reveal methods**
6. **Perform the miracle!**

### Example Performance

**Spectator**: "I'm thinking of the King of Diamonds"

**You (secretly open MAXIM)**: 
- Select ♦️ (Diamonds)
- Select K (King)
- Tap Calculate

**MAXIM shows**:
- 📅 "Deal to today's date (13th) - Card will be there!"
- 🔤 "Spell KING OF DIAMONDS (15 letters) - Deal 15 cards"
- 📍 "Position 26 from top, Position 27 from bottom"

**You**: "Today is the 13th... deal 13 cards... OMG it's your card!" ✨

## 🎨 Customization

### Change Stack
```javascript
// In Settings → Stack Configuration
// Select from: Mnemonica, Aronson, Eight Kings, Si Stebbins, Custom
```

### Create Custom Stack
```javascript
// In Settings → Edit Custom Stack
// Rearrange cards visually
// Save your configuration
```

### Add Spectator Profile
```javascript
// In Settings → Spectator Profiles
// Name: "Sarah"
// Birthday: 15
// Lucky Number: 7
// Creates personalized reveals!
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **Vanilla JavaScript** - No dependencies, pure performance
- **LocalStorage** - Persistent data storage
- **Service Workers** - Offline functionality
- **Web App Manifest** - PWA capabilities

### Browser Support
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Opera
- ✅ Samsung Internet

### File Structure
```
maxim/
├── index.html          # Main HTML structure
├── app.js              # Core application logic
├── sw.js               # Service worker for PWA
├── manifest.json       # PWA configuration
├── icon-192.png        # App icon (192x192)
├── icon-512.png        # App icon (512x512)
└── README.md           # Documentation
```

## 🎭 Performance Tips

### For Best Results:
1. **Practice the reveals**: Know your stack positions
2. **Be natural**: Phone use should seem casual
3. **Have multiple reveals ready**: Adapt to the situation
4. **Use profiles**: Personal reveals are more magical
5. **Test offline**: Ensure PWA works without internet

### Pro Tips:
- Enable vibration for discrete notifications
- Use date reveals when possible (most impressive)
- Save regular spectators as profiles
- Practice quick card selection (under 3 seconds)
- Keep phone in airplane mode during performances

## 📈 Roadmap

### Planned Features
- [ ] More stack presets (Breakthrough, Redford, etc.)
- [ ] Multi-language support (Spanish, French, German)
- [ ] Voice input for card selection
- [ ] NFC tag integration for ultra-covert operation
- [ ] Cloud sync for profiles across devices
- [ ] Advanced statistics and analytics
- [ ] Video tutorials integration
- [ ] Companion Apple Watch app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ✨ by magicians, for magicians.

## 🙏 Acknowledgments

- Juan Tamariz for the Mnemonica stack
- Simon Aronson for the Aronson stack
- The magic community for inspiration
- All contributors and testers

## 📧 Contact

Questions? Suggestions? Open an issue or contact us!

---

**⚠️ Disclaimer**: This app is designed for entertainment purposes by professional magicians. Practice ethical magic and always respect your audience.

**🎩 Remember**: The real magic isn't in the app - it's in your performance!

---

Made with ❤️ for the magic community
