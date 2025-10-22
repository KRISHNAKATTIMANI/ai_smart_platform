# 🏗️ AI Platform Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                     http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
        ┌────────────────────▼────────────────────┐
        │      REACT FRONTEND (Port 3000)        │
        │  ┌──────────────────────────────────┐  │
        │  │         Router (App.js)          │  │
        │  │  ┌────────────────────────────┐  │  │
        │  │  │  HomePage                   │  │  │
        │  │  │  ImageToTextPage            │  │  │
        │  │  │  TextToTextPage             │  │  │
        │  │  │  Dashboard                  │  │  │
        │  │  │  Other Feature Pages...     │  │  │
        │  │  └────────────────────────────┘  │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │  Context (State Management)      │  │
        │  │  - RecentSearchesContext         │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │  Components                      │  │
        │  │  - Navbar                        │  │
        │  └──────────────────────────────────┘  │
        └────────────────┬────────────────────────┘
                         │
                         │ API Calls (Axios)
                         │ - /api/upload
                         │ - /api/analyze
                         │ - /api/chat
                         │ - /api/usage
                         │
        ┌────────────────▼────────────────────────┐
        │      FLASK BACKEND (Port 5000)         │
        │  ┌──────────────────────────────────┐  │
        │  │     Flask App (app.py)           │  │
        │  │  ┌────────────────────────────┐  │  │
        │  │  │  API Endpoints:            │  │  │
        │  │  │  - POST /api/upload        │  │  │
        │  │  │  - POST /api/analyze       │  │  │
        │  │  │  - POST /api/chat          │  │  │
        │  │  │  - GET  /api/usage         │  │  │
        │  │  └────────────────────────────┘  │  │
        │  │                                  │  │
        │  │  Flask-CORS (Enabled)            │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │  File Processing                 │  │
        │  │  - extract_text_from_image()     │  │
        │  │  - extract_text_from_pdf()       │  │
        │  │  - extract_text_from_docx()      │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │  AI Integration                  │  │
        │  │  - analyze_with_ai()             │  │
        │  │  - Uses Gemini API               │  │
        │  └──────────────────────────────────┘  │
        └────────────┬────────────────────────────┘
                     │
                     │ API Requests
                     │
        ┌────────────▼────────────────────────────┐
        │      GOOGLE GEMINI API                  │
        │      (gemini-2.5-flash)                 │
        │  - Text Analysis                        │
        │  - Image Analysis                       │
        │  - Vision Capabilities                  │
        └─────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    BROWSER localStorage                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Recent Searches (Per Feature):                           │  │
│  │  - recentTextToText                                        │  │
│  │  - recentTextToImage                                       │  │
│  │  - recentImageToText                                       │  │
│  │  - recentVoiceToText                                       │  │
│  │  - recentTextToAudio                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    FILE SYSTEM (b:\gemini)                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  uploads/ - Temporary file storage                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Image → Text Flow

```
┌────────────┐
│   USER     │
│ Selects    │
│   Image    │
└─────┬──────┘
      │
      ▼
┌────────────────┐
│ ImageToText    │
│ Page Component │
│                │
│ - Preview      │
│ - Prompt Input │
└────────┬───────┘
         │ Click "Process"
         │
         ▼
┌─────────────────────┐
│ POST /api/upload    │
│ FormData: {file}    │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│ Flask Backend        │
│ - Save file          │
│ - Extract text       │
│   (Tesseract/Gemini) │
└──────┬───────────────┘
       │
       │ {extractedText}
       ▼
┌─────────────────────┐
│ POST /api/analyze   │
│ {content, prompt}   │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│ Gemini API           │
│ - Analyze content    │
│ - Generate response  │
└──────┬───────────────┘
       │
       │ {result}
       ▼
┌────────────────────┐
│ React Component    │
│ - Display results  │
│ - Save to storage  │
│ - Update recent    │
└────────────────────┘
```

### 2. Text → Text Flow

```
┌────────────┐
│   USER     │
│ Enters     │
│   Text     │
└─────┬──────┘
      │
      ▼
┌────────────────┐
│ TextToText     │
│ Page Component │
└────────┬───────┘
         │ Click "Analyze"
         │
         ▼
┌─────────────────────┐
│ POST /api/chat      │
│ {message}           │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│ Gemini API           │
│ - Process message    │
│ - Generate response  │
└──────┬───────────────┘
       │
       │ {response}
       ▼
┌────────────────────┐
│ React Component    │
│ - Display response │
│ - Save to storage  │
└────────────────────┘
```

### 3. Dashboard Data Flow

```
┌────────────┐
│   USER     │
│ Navigates  │
│ Dashboard  │
└─────┬──────┘
      │
      ▼
┌────────────────┐
│ Dashboard      │
│ Component      │
│ useEffect()    │
└────────┬───────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────────┐
│ GET /api/usage  │  │ localStorage     │
│                 │  │ - Get all recent │
│ Returns:        │  │   searches       │
│ {               │  │ - Combine        │
│   textToText    │  │ - Sort by time   │
│   textToImage   │  │ - Take top 10    │
│   imageToText   │  └──────────────────┘
│   voiceToText   │
│   textToAudio   │
│ }               │
└─────────┬───────┘
          │
          ▼
┌─────────────────────┐
│ Dashboard Display   │
│ - Bar Chart         │
│ - Stats Cards       │
│ - Activity Table    │
└─────────────────────┘
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │              App.js (Router)                       │    │
│  │                                                     │    │
│  │  ┌───────────────────────────────────────────┐    │    │
│  │  │  RecentSearchesProvider (Context)         │    │    │
│  │  │  - addRecentSearch()                      │    │    │
│  │  │  - getRecentSearches()                    │    │    │
│  │  │  - getAllRecentSearches()                 │    │    │
│  │  │                                           │    │    │
│  │  │  ┌─────────────────────────────────┐    │    │    │
│  │  │  │     Routes                      │    │    │    │
│  │  │  │  ┌───────────────────────────┐ │    │    │    │
│  │  │  │  │  HomePage                 │ │    │    │    │
│  │  │  │  │  + Navbar                 │ │    │    │    │
│  │  │  │  │  + Feature Cards (5)      │ │    │    │    │
│  │  │  │  └───────────────────────────┘ │    │    │    │
│  │  │  │                                 │    │    │    │
│  │  │  │  ┌───────────────────────────┐ │    │    │    │
│  │  │  │  │  ImageToTextPage          │ │    │    │    │
│  │  │  │  │  + File Upload            │ │    │    │    │
│  │  │  │  │  + Preview                │ │    │    │    │
│  │  │  │  │  + Process Button         │ │    │    │    │
│  │  │  │  │  + Results Display        │ │    │    │    │
│  │  │  │  │  + Recent Sidebar         │ │    │    │    │
│  │  │  │  │  Uses: Context ───────────┼─┼────┘    │    │
│  │  │  │  └───────────────────────────┘ │    │    │    │
│  │  │  │                                 │    │    │    │
│  │  │  │  ┌───────────────────────────┐ │    │    │    │
│  │  │  │  │  TextToTextPage           │ │    │    │    │
│  │  │  │  │  + Input Area             │ │    │    │    │
│  │  │  │  │  + Analyze Button         │ │    │    │    │
│  │  │  │  │  + Results Display        │ │    │    │    │
│  │  │  │  │  + Recent Sidebar         │ │    │    │    │
│  │  │  │  │  Uses: Context ───────────┼─┼────┘    │    │
│  │  │  │  └───────────────────────────┘ │    │    │    │
│  │  │  │                                 │    │    │    │
│  │  │  │  ┌───────────────────────────┐ │    │    │    │
│  │  │  │  │  Dashboard                │ │    │    │    │
│  │  │  │  │  + Stats Cards            │ │    │    │    │
│  │  │  │  │  + Bar Chart (Chart.js)   │ │    │    │    │
│  │  │  │  │  + Activity Table         │ │    │    │    │
│  │  │  │  │  Uses: Context ───────────┼─┼────┘    │    │
│  │  │  │  └───────────────────────────┘ │    │    │    │
│  │  │  │                                 │    │    │    │
│  │  │  │  Other Pages...                │    │    │    │
│  │  │  └─────────────────────────────────┘    │    │    │
│  │  └───────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Visualization

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                          │
├──────────────────────────────────────────────────────────────┤
│  React 18.2.0              │  UI Library                     │
│  React Router 6.20.0       │  Navigation & Routing           │
│  Tailwind CSS 3.x          │  Utility-First CSS              │
│  Heroicons 2.0.18          │  Icon Library                   │
│  Chart.js 4.4.0            │  Data Visualization             │
│  react-chartjs-2 5.2.0     │  React Wrapper for Chart.js     │
│  Axios 1.6.0               │  HTTP Client                    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      BACKEND STACK                           │
├──────────────────────────────────────────────────────────────┤
│  Flask 3.0.0               │  Web Framework                  │
│  Flask-CORS 4.0.0          │  Cross-Origin Support           │
│  google-generativeai 0.3+  │  Gemini AI SDK                  │
│  Pillow 10.0+              │  Image Processing               │
│  PyMuPDF 1.23+             │  PDF Processing                 │
│  python-docx 1.0+          │  Word Document Processing       │
│  pytesseract 0.3.10+       │  OCR Engine                     │
│  reportlab 4.0+            │  PDF Generation                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
├──────────────────────────────────────────────────────────────┤
│  Google Gemini API         │  AI Analysis & Generation       │
└──────────────────────────────────────────────────────────────┘
```

---

## Port & URL Mapping

```
┌─────────────┬──────────┬─────────────────────────────────────┐
│  Service    │   Port   │  URL                                │
├─────────────┼──────────┼─────────────────────────────────────┤
│  React Dev  │   3000   │  http://localhost:3000              │
│  Flask API  │   5000   │  http://localhost:5000              │
│  Gemini API │   443    │  https://generativelanguage.google  │
└─────────────┴──────────┴─────────────────────────────────────┘
```

---

## File System Structure

```
b:\gemini\
│
├── Backend (Flask)
│   ├── app.py ──────────────────► Main Flask application
│   ├── requirements.txt ────────► Python dependencies
│   ├── templates/ ──────────────► Flask HTML templates
│   └── uploads/ ────────────────► Temporary file storage
│
├── Frontend (React)
│   └── react-app/
│       ├── public/
│       │   └── index.html ──────► HTML template
│       ├── src/
│       │   ├── components/ ─────► Reusable UI components
│       │   ├── context/ ────────► State management
│       │   ├── pages/ ──────────► Page components
│       │   ├── App.js ──────────► Main app with routing
│       │   ├── index.js ────────► Entry point
│       │   └── index.css ───────► Global styles
│       ├── package.json ────────► Node dependencies
│       └── tailwind.config.js ──► Tailwind configuration
│
├── Documentation
│   ├── COMPLETE_SETUP_GUIDE.md
│   ├── REACT_SETUP_GUIDE.md
│   ├── REACT_IMPLEMENTATION_SUMMARY.md
│   ├── VISUAL_COMPONENT_GUIDE.md
│   ├── QUICK_REFERENCE.md
│   ├── FILES_CREATED.md
│   └── ARCHITECTURE.md ─────────► This file
│
└── Scripts
    ├── install-react.ps1 ───────► PowerShell installer
    └── install-react.bat ───────► Batch installer
```

---

## Request/Response Flow

### Example: Image Upload & Analysis

```
1. USER ACTION
   │
   │ User uploads image.jpg
   │
   ▼

2. REACT FRONTEND (ImageToTextPage.js)
   │
   │ FormData created
   │ POST /api/upload with file
   │
   ▼

3. FLASK BACKEND (app.py)
   │
   │ @app.route('/api/upload')
   │ - Save file to uploads/
   │ - Detect file type (.jpg)
   │ - Call extract_text_from_image()
   │   │
   │   ├─► Try Tesseract OCR first
   │   │   If no text found:
   │   │   
   │   └─► Use Gemini Vision API
   │       - Open image
   │       - Send to Gemini with prompt
   │       - Get description/text
   │
   │ Return: {extractedText, fullText}
   │
   ▼

4. REACT FRONTEND
   │
   │ Display extracted text
   │
   │ POST /api/analyze
   │ with: {content, customPrompt}
   │
   ▼

5. FLASK BACKEND
   │
   │ @app.route('/api/analyze')
   │ - Call analyze_with_ai()
   │ - Send to Gemini API
   │ - Format response
   │
   │ Return: {result}
   │
   ▼

6. REACT FRONTEND
   │
   │ - Display AI analysis
   │ - Save to localStorage
   │ - Update recent searches
   │
   ▼

7. USER
   │
   │ Views results
   └─► Can see in "Recent Searches" sidebar
```

---

## State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│         RecentSearchesContext                            │
│                                                          │
│  State: localStorage (browser)                          │
│                                                          │
│  Keys:                                                   │
│  ├─ recentTextToText                                    │
│  ├─ recentTextToImage                                   │
│  ├─ recentImageToText                                   │
│  ├─ recentVoiceToText                                   │
│  └─ recentTextToAudio                                   │
│                                                          │
│  Methods:                                                │
│  ├─ addRecentSearch(feature, data)                      │
│  │   │                                                   │
│  │   ├─► Get existing searches from localStorage        │
│  │   ├─► Add new entry with timestamp                   │
│  │   ├─► Keep only last 5                               │
│  │   └─► Save back to localStorage                      │
│  │                                                       │
│  ├─ getRecentSearches(feature)                          │
│  │   │                                                   │
│  │   └─► Fetch searches for specific feature            │
│  │                                                       │
│  └─ getAllRecentSearches()                              │
│      │                                                   │
│      ├─► Get searches from all features                 │
│      ├─► Combine and sort by timestamp                  │
│      └─► Return top 10                                  │
│                                                          │
│  Consumers:                                              │
│  ├─ ImageToTextPage                                     │
│  ├─ TextToTextPage                                      │
│  └─ Dashboard                                            │
└──────────────────────────────────────────────────────────┘
```

---

This architecture document provides a complete visual overview of how all the components work together! 🏗️
