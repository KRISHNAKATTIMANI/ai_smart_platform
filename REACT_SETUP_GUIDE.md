# Quick Start Guide - React Frontend Setup

This guide will help you set up and run the React frontend with your Flask backend.

## Prerequisites

- Node.js (v14 or higher) and npm installed
- Python 3.8+ with Flask backend already set up
- GEMINI_API_KEY environment variable configured

## Step 1: Install React Dependencies

Open a terminal in the react-app folder and run:

```powershell
cd b:\gemini\react-app
npm install
```

This will install all required packages:
- React & React DOM
- React Router
- Tailwind CSS
- Heroicons
- Chart.js
- Axios

## Step 2: Start the Flask Backend

Open a NEW terminal window and run:

```powershell
cd b:\gemini
python app.py
```

Your Flask backend should start on `http://localhost:5000`

## Step 3: Start the React Development Server

In the react-app terminal, run:

```powershell
npm start
```

The React app will automatically open in your browser at `http://localhost:3000`

## Step 4: Test the Application

### Home Page
- You should see 5 feature icons
- Hover over them to see the animation effect
- Click on any icon to navigate to that feature

### Image → Text (Fully Implemented)
1. Click on "Image → Text" icon
2. Upload an image file (PNG, JPG, etc.)
3. Optionally enter a custom analysis prompt
4. Click "Process Image"
5. View extracted text and AI analysis
6. Check the sidebar for recent searches

### Dashboard
1. Click "Dashboard" in the top navigation
2. View usage statistics bar chart
3. See recent activity table
4. Click "View" to navigate to a feature

### Text → Text
1. Enter some text in the input area
2. Click "Analyze"
3. View AI response
4. Check recent searches in sidebar

## Project Structure

```
react-app/
├── src/
│   ├── components/        # Reusable components
│   │   └── Navbar.js      # Top navigation bar
│   ├── context/           # React Context for state
│   │   └── RecentSearchesContext.js
│   ├── pages/             # Page components
│   │   ├── HomePage.js               # ✅ Complete
│   │   ├── ImageToTextPage.js        # ✅ Complete
│   │   ├── TextToTextPage.js         # ✅ Complete
│   │   ├── Dashboard.js              # ✅ Complete
│   │   ├── TextToImagePage.js        # 🚧 Placeholder
│   │   ├── VoiceToTextPage.js        # 🚧 Placeholder
│   │   └── TextToAudioPage.js        # 🚧 Placeholder
│   ├── App.js             # Main app with routing
│   ├── index.js           # React entry point
│   └── index.css          # Tailwind styles
├── public/
│   └── index.html         # HTML template
├── package.json           # Dependencies
└── tailwind.config.js     # Tailwind configuration
```

## Features

### ✅ Implemented
- **Home Page**: 5 clickable feature icons with hover effects
- **Image → Text**: Full feature with file upload, AI analysis, recent searches
- **Text → Text**: AI-powered text analysis with recent searches
- **Dashboard**: Usage statistics chart and recent activity table
- **Navigation**: React Router with smooth transitions
- **Recent Searches**: Context API + localStorage persistence

### 🚧 To Be Implemented
- Text → Image generation
- Voice → Text transcription
- Text → Audio synthesis

## API Endpoints Used

The React app communicates with these Flask endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload` | POST | Upload and extract text from files |
| `/api/analyze` | POST | Analyze content with AI |
| `/api/chat` | POST | General chat messages |
| `/api/usage` | GET | Get usage statistics |

## Customization

### Change Primary Color
Edit `react-app/tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#4F46E5',  // Change this
    },
  },
}
```

### Add New Feature
1. Create page component in `src/pages/NewFeaturePage.js`
2. Add route in `src/App.js`
3. Add icon to `src/pages/HomePage.js`
4. Add localStorage key to context

## Troubleshooting

### Port 3000 already in use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API calls failing
- Ensure Flask backend is running on port 5000
- Check `proxy` setting in package.json
- Verify GEMINI_API_KEY is set

### Tailwind styles not working
```powershell
npm install -D tailwindcss postcss autoprefixer
```

### Recent searches not persisting
- Check browser console for errors
- Clear localStorage and try again
- Verify Context is wrapping the app

## Building for Production

```powershell
npm run build
```

This creates an optimized build in the `build/` folder.

To serve the production build:
```powershell
npm install -g serve
serve -s build -p 3000
```

## Development Tips

1. **Hot Reload**: Changes auto-reload in development
2. **Console**: Open DevTools (F12) to see logs
3. **localStorage**: View in DevTools > Application > Local Storage
4. **Network**: Monitor API calls in DevTools > Network tab

## Next Steps

1. ✅ Test all features
2. 🚀 Implement remaining feature pages
3. 📊 Add real usage tracking to backend
4. 🔐 Add authentication
5. 🎨 Customize theme and branding
6. 📱 Test responsive design
7. 🚀 Deploy to production

## Support

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Chart.js: https://www.chartjs.org

## License

Same as your main project.

---

**Happy Coding! 🚀**
