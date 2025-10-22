# 🚀 AI Platform - Quick Reference Card

## ⚡ Quick Start Commands

### Install & Run (First Time)
```powershell
# 1. Install Python dependencies
cd b:\gemini
pip install -r requirements.txt

# 2. Install React dependencies
cd react-app
npm install

# 3. Start Backend (Terminal 1)
cd b:\gemini
python app.py

# 4. Start Frontend (Terminal 2)
cd b:\gemini\react-app
npm start
```

### Daily Development
```powershell
# Terminal 1 - Backend
cd b:\gemini
python app.py

# Terminal 2 - Frontend
cd b:\gemini\react-app
npm start
```

---

## 🌐 URLs

| Service | URL | Port |
|---------|-----|------|
| React Frontend | http://localhost:3000 | 3000 |
| Flask Backend | http://localhost:5000 | 5000 |

---

## 📁 Key Files

### Backend (Flask)
| File | Purpose |
|------|---------|
| `app.py` | Main Flask application |
| `requirements.txt` | Python dependencies |
| `uploads/` | Temporary file storage |

### Frontend (React)
| File | Purpose |
|------|---------|
| `src/App.js` | Main React app with routing |
| `src/pages/HomePage.js` | Home page with 5 icons |
| `src/pages/ImageToTextPage.js` | Image → Text feature |
| `src/pages/Dashboard.js` | Analytics dashboard |
| `src/context/RecentSearchesContext.js` | State management |
| `package.json` | React dependencies |
| `tailwind.config.js` | Styling configuration |

---

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload` | POST | Upload files |
| `/api/analyze` | POST | Analyze content |
| `/api/chat` | POST | Text analysis |
| `/api/usage` | GET | Usage stats |

---

## 🎨 Design System

### Colors
```
Primary:    #4F46E5  (Indigo)
Background: #F9FAFB  (Light Gray)
Text:       #111827  (Dark Gray)
```

### Icons (Heroicons)
```javascript
DocumentTextIcon    // Text → Text
PhotoIcon          // Text → Image
CameraIcon         // Image → Text
MicrophoneIcon     // Voice → Text
SpeakerWaveIcon    // Text → Audio
```

---

## 💾 localStorage Keys

```
recentTextToText    // Text → Text searches
recentTextToImage   // Text → Image searches
recentImageToText   // Image → Text searches
recentVoiceToText   // Voice → Text searches
recentTextToAudio   // Text → Audio searches
```

---

## 🔧 Common Tasks

### Install New Package
```powershell
# Python
pip install package-name

# React
cd react-app
npm install package-name
```

### Clear localStorage
```javascript
// In browser console
localStorage.clear()
```

### Rebuild React
```powershell
cd react-app
npm run build
```

### Kill Port Process
```powershell
# Port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| API calls fail | Check Flask is running on port 5000 |
| Styles not loading | Run `npm install` in react-app |
| Port in use | Kill process or use different port |
| CORS errors | Verify Flask-CORS is installed |
| No API key | Set GEMINI_API_KEY environment variable |

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| `COMPLETE_SETUP_GUIDE.md` | Full setup instructions |
| `REACT_SETUP_GUIDE.md` | React-specific setup |
| `REACT_IMPLEMENTATION_SUMMARY.md` | Feature summary |
| `VISUAL_COMPONENT_GUIDE.md` | UI/UX guide |
| This file | Quick reference |

---

## ✅ Feature Status

| Feature | Status | Page |
|---------|--------|------|
| Home Page | ✅ Complete | HomePage.js |
| Image → Text | ✅ Complete | ImageToTextPage.js |
| Text → Text | ✅ Complete | TextToTextPage.js |
| Dashboard | ✅ Complete | Dashboard.js |
| Text → Image | 🚧 Placeholder | TextToImagePage.js |
| Voice → Text | 🚧 Placeholder | VoiceToTextPage.js |
| Text → Audio | 🚧 Placeholder | TextToAudioPage.js |

---

## 🎯 Navigation Routes

```
/                   → Home Page
/text-to-text       → Text → Text
/text-to-image      → Text → Image
/image-to-text      → Image → Text
/voice-to-text      → Voice → Text
/text-to-audio      → Text → Audio
/dashboard          → Dashboard
```

---

## 🚀 Deployment Checklist

- [ ] Set GEMINI_API_KEY environment variable
- [ ] Install all Python dependencies
- [ ] Install all React dependencies
- [ ] Test all features locally
- [ ] Build React for production (`npm run build`)
- [ ] Configure Flask to serve React build
- [ ] Set up production server
- [ ] Configure domain and SSL
- [ ] Test deployed application

---

## 📞 Help & Resources

### Documentation
- React: https://react.dev
- Flask: https://flask.palletsprojects.com
- Tailwind: https://tailwindcss.com
- Chart.js: https://www.chartjs.org

### Project Files
- Check `COMPLETE_SETUP_GUIDE.md` for detailed setup
- Check `VISUAL_COMPONENT_GUIDE.md` for UI details
- Check `react-app/README.md` for React info

---

## 🎉 Quick Test

```powershell
# Start everything
cd b:\gemini
python app.py
# Open new terminal
cd b:\gemini\react-app
npm start

# Visit
http://localhost:3000
```

---

**Save this file for quick reference! 📌**
