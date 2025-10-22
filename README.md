# 🚀 AI Platform - Image to Text & More

A powerful AI-powered platform with Flask backend and React frontend for text extraction, image analysis, and intelligent content processing.

## ✨ Features

- **Image → Text**: Extract text from images using OCR and AI
- **Text → Text**: AI-powered text analysis and conversation
- **Dashboard**: Usage analytics and recent activity tracking
- **Multiple File Formats**: Support for images, PDFs, DOCX, TXT
- **AI Analysis**: Powered by Google Gemini AI
- **Modern UI**: Beautiful React frontend with Tailwind CSS
- **Real-time Processing**: Fast file upload and analysis
- **Recent Searches**: Track and revisit your recent queries

## 🏗️ Architecture

### Backend (Python/Flask)
- Flask web framework
- Google Gemini AI integration
- OCR with Tesseract
- PDF/DOCX text extraction
- File upload handling
- RESTful API

### Frontend (React)
- React 18 with hooks
- React Router for navigation
- Tailwind CSS for styling
- Chart.js for analytics
- Axios for API calls
- Context API for state management

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- GEMINI_API_KEY environment variable

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/image-to-text.git
cd image-to-text
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Install React dependencies**
```bash
cd react-app
npm install
```

4. **Set up environment variables**
```bash
# Windows PowerShell
$env:GEMINI_API_KEY = "your-api-key-here"
$env:REPLICATE_API_KEY = "your-replicate-key-here"  # Optional, for image enhancement

# Linux/Mac
export GEMINI_API_KEY="your-api-key-here"
export REPLICATE_API_KEY="your-replicate-key-here"  # Optional, for image enhancement
```

> 📝 **Note:** Image Enhancement requires a Replicate API key with billing enabled.  
> See **[REPLICATE_API_SETUP.md](REPLICATE_API_SETUP.md)** for detailed setup instructions.

5. **Start the backend**
```bash
# Terminal 1
python app.py
```

6. **Start the frontend**
```bash
# Terminal 2
cd react-app
npm start
```

7. **Open your browser**
```
http://localhost:3000
```

## 📚 Documentation

- **[START_HERE.md](START_HERE.md)** - Quick start guide
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete documentation index
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands and troubleshooting
- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Detailed setup instructions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[VISUAL_COMPONENT_GUIDE.md](VISUAL_COMPONENT_GUIDE.md)** - UI/UX design guide

## 🎯 Features in Detail

### Image → Text
- Upload images (JPG, PNG, GIF, BMP, WEBP)
- OCR text extraction
- AI-powered image analysis
- Custom analysis prompts
- Recent searches sidebar

### Text → Text
- AI conversation and analysis
- Natural language processing
- Context-aware responses
- Search history

### Dashboard
- Usage statistics with charts
- Recent activity tracking
- Feature usage analytics
- Quick navigation

## 🛠️ Tech Stack

### Backend
- Flask 3.0.0
- Google Generative AI (Gemini)
- PyMuPDF (PDF processing)
- python-docx (Word documents)
- pytesseract (OCR)
- Pillow (Image processing)
- ReportLab (PDF generation)

### Frontend
- React 18.2.0
- React Router 6.20.0
- Tailwind CSS 3.x
- Chart.js 4.4.0
- Heroicons 2.0.18
- Axios 1.6.0

## 📦 Project Structure

```
.
├── app.py                          # Flask backend
├── requirements.txt                # Python dependencies
├── react-app/                      # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   ├── components/             # Reusable components
│   │   ├── context/                # State management
│   │   └── App.js                  # Main app
│   ├── package.json
│   └── tailwind.config.js
├── templates/                      # Flask templates
├── uploads/                        # Temporary storage
└── docs/                           # Documentation
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload and extract text from files |
| `/api/analyze` | POST | Analyze content with AI |
| `/api/chat` | POST | General chat/text analysis |
| `/api/usage` | GET | Get usage statistics |

## 🎨 Customization

### Change Primary Color
Edit `react-app/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#4F46E5',  // Your color here
    },
  },
}
```

### Add New Feature
1. Create page component in `react-app/src/pages/`
2. Add route in `react-app/src/App.js`
3. Add icon to `react-app/src/pages/HomePage.js`
4. Update documentation

## 🐛 Troubleshooting

### Backend won't start
- Check GEMINI_API_KEY is set
- Install dependencies: `pip install -r requirements.txt`
- Check port 5000 is available

### Frontend won't start
- Install dependencies: `cd react-app && npm install`
- Check port 3000 is available
- Clear npm cache: `npm cache clean --force`

### API calls failing
- Ensure backend is running on port 5000
- Check CORS is enabled in app.py
- Verify GEMINI_API_KEY is valid

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- Google Gemini AI for powerful AI capabilities
- React and Tailwind CSS communities
- All open-source contributors

---

**Built with ❤️ using React, Flask, Tailwind CSS, and Google Gemini AI**