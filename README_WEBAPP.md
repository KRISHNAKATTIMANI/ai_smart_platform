# 🤖 AI Assistant - ChatGPT Style Web App

A beautiful, modern web application with ChatGPT-style UI for intelligent document analysis, OCR, and Q&A.

## ✨ Features

### 📄 File Support
- **Images**: JPG, JPEG, PNG, BMP, GIF, WebP (with OCR)
- **Documents**: PDF, DOCX, TXT
- **Auto-detection**: Automatically detects file type and extracts text

### 🧠 Intelligent Analysis
- **Auto-Analysis**: Smart summarization and key point extraction
- **Custom Prompts**: Ask anything about uploaded content
- **Quick Actions**:
  - 📝 Summarize
  - 📖 Explain in detail
  - ✅ Solve questions
  - 🎯 Extract key points
  - 🤖 Auto analyze

### 💬 Chat Interface
- Clean, minimal ChatGPT-style UI
- Message bubbles for user and AI
- Typing indicators
- File upload with preview
- Download results as TXT

### 🎨 Beautiful Design
- Tailwind CSS styling
- Responsive layout
- Smooth animations
- Soft colors and rounded corners
- Mobile-friendly

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
cd B:\gemini
.venv\Scripts\activate
pip install Flask pytesseract python-docx PyMuPDF Pillow google-generativeai
```

### 2. Set API Key

```powershell
$env:GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Run the App

```powershell
python app.py
```

### 4. Open Browser

Navigate to: **http://localhost:5000**

## 📋 How to Use

### Upload Files
1. Click the 📎 attachment button
2. Select your file (image, PDF, DOCX, or TXT)
3. Wait for text extraction

### Analyze Content
Choose from quick actions:
- **Summarize**: Get a concise summary
- **Explain**: Detailed explanation
- **Solve Questions**: Find and answer all questions
- **Key Points**: Extract main points
- **Auto Analyze**: Intelligent comprehensive analysis

### Custom Prompts
- Type your own question in the input box
- Examples:
  - "What are the main topics discussed?"
  - "Translate this to Spanish"
  - "Create a study guide from this"
  - "Find any errors or issues"

### Download Results
- Click "💾 Download as TXT" button
- Save AI's analysis for later

## 🛠️ Technical Stack

**Backend:**
- Flask (Python web framework)
- PyMuPDF (PDF processing)
- python-docx (DOCX processing)
- pytesseract (OCR)
- Google Gemini AI API

**Frontend:**
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Responsive design

## 📁 Project Structure

```
gemini/
├── app.py                 # Flask backend
├── templates/
│   └── index.html        # ChatGPT-style frontend
├── uploads/              # Temporary file storage
├── simple_answer.py      # CLI version (still works)
└── README_WEBAPP.md      # This file
```

## 🎯 Use Cases

### Students
- Upload homework questions → Get answers
- Analyze study materials
- Summarize textbooks
- Create study guides

### Professionals
- Analyze reports and documents
- Extract key insights from PDFs
- Quick summaries of long documents
- Q&A from meeting notes

### Researchers
- Analyze research papers
- Extract key findings
- Generate summaries
- Answer specific questions

### General
- Read text from images (OCR)
- Translate documents
- Explain complex topics
- General AI assistance

## 🔧 Configuration

### Tesseract OCR (Optional for better OCR)
For better image text extraction, install Tesseract:
- Download: https://github.com/UB-Mannheim/tesseract/wiki
- Add to PATH

### API Keys
Set your Gemini API key:
```powershell
$env:GEMINI_API_KEY="your_key_here"
```

### File Size Limit
Default: 16MB
To change, edit in `app.py`:
```python
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
```

## 🎨 Screenshots

### Chat Interface
- Clean, minimal design
- Message bubbles
- File upload button
- Action buttons

### File Analysis
- Upload confirmation
- Extracted text preview
- Quick action buttons
- Download option

## 🚨 Troubleshooting

### "API Key not configured"
Set the environment variable:
```powershell
$env:GEMINI_API_KEY="your_key_here"
```

### Tesseract Error
Install Tesseract OCR or images won't work:
```
pip install pytesseract
```
Download Tesseract: https://github.com/UB-Mannheim/tesseract/wiki

### Port Already in Use
Change port in `app.py`:
```python
app.run(debug=True, port=5001)  # Use different port
```

## 💡 Tips

1. **Best Image Quality**: Use clear, high-resolution images for OCR
2. **File Size**: Keep files under 16MB
3. **Custom Prompts**: Be specific for better results
4. **Download Results**: Save important analyses
5. **Multiple Files**: Upload one at a time for best results

## 🔮 Future Enhancements

- [ ] Multi-file upload
- [ ] Chat history
- [ ] User accounts
- [ ] Export to PDF/Word
- [ ] Voice input
- [ ] Multiple AI models
- [ ] Code syntax highlighting
- [ ] Image generation
- [ ] Real-time collaboration

## 📝 License

Open source - feel free to modify and use!

## 🤝 Contributing

This is a personal project. Feel free to fork and customize!

---

**Enjoy your AI Assistant! 🎉**

For CLI version, use: `python simple_answer.py`
