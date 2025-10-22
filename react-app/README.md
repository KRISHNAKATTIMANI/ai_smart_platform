# AI Platform - React Frontend

A modern React frontend for the AI Platform, featuring text, image, voice, and audio processing capabilities.

## Features

- **Home Page**: Five clickable feature icons with hover effects
- **Image → Text**: Full-featured page with file upload, AI analysis, and recent searches
- **Dashboard**: Usage statistics with bar charts and recent activity table
- **Text → Text**: AI-powered text analysis
- **Other Features**: Placeholder pages for Text→Image, Voice→Text, Text→Audio

## Technology Stack

- React 18
- React Router v6
- Tailwind CSS
- Heroicons
- Chart.js & react-chartjs-2
- Axios

## Setup Instructions

### 1. Install Dependencies

```bash
cd react-app
npm install
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Ensure Backend is Running

Make sure your Flask backend is running on `http://localhost:5000`

```bash
cd ..
python app.py
```

## Project Structure

```
react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── context/
│   │   └── RecentSearchesContext.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── ImageToTextPage.js
│   │   ├── TextToTextPage.js
│   │   ├── TextToImagePage.js
│   │   ├── VoiceToTextPage.js
│   │   ├── TextToAudioPage.js
│   │   └── Dashboard.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── tailwind.config.js
```

## Features Breakdown

### Home Page
- 5 feature cards with icons
- Smooth hover animations
- Navigation to feature pages
- Top navigation bar with Dashboard link

### Image → Text Page
- File upload with preview
- Custom prompt input
- AI-powered analysis
- Sidebar with 5 recent searches
- localStorage persistence

### Dashboard
- Bar chart showing usage per feature
- Statistics cards for each feature
- Table of 10 most recent searches across all features
- Mock data fallback if API unavailable

### Recent Searches
- Managed via Context API
- Persisted in localStorage
- Separate keys per feature
- Auto-sorted by timestamp

## API Integration

The frontend connects to your Flask backend:

- `POST /api/upload` - Upload and extract text from files
- `POST /api/analyze` - Analyze content with AI
- `POST /api/chat` - General chat messages
- `GET /api/usage` - Get usage statistics (optional)

## Customization

### Colors
Primary color is `#4F46E5` (Indigo). To change:

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
    },
  },
}
```

### Icons
Using Heroicons outline style. Import different icons from:
```js
import { IconName } from '@heroicons/react/24/outline';
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Notes

- The proxy is configured to forward API requests to `http://localhost:5000`
- Recent searches are stored in localStorage with keys like `recentImageToText`
- Dashboard uses Chart.js for visualization
- All components use Tailwind CSS for styling
- Responsive design works on mobile, tablet, and desktop

## Next Steps

1. Implement the remaining feature pages (Text→Image, Voice→Text, Text→Audio)
2. Add real API endpoint `/api/usage` to Flask backend
3. Add authentication and user management
4. Enhance error handling and loading states
5. Add more chart types and analytics
