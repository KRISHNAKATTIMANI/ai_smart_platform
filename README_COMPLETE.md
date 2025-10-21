# AI Image Analyzer - Complete Guide

A comprehensive Python toolkit for analyzing images using Google Gemini and OpenAI GPT-4o-mini APIs. Choose between GUI, interactive CLI, or command-line versions.

## 🎯 Features

- 📁 **Upload your own images** from your computer
- 🤖 **Dual API support**: Google Gemini & OpenAI GPT-4o-mini
- 🖼️ **Visual interface** with image preview (GUI version)
- 💬 **Interactive prompts** (CLI version)
- 📊 **Detailed image analysis**: objects, colors, text, context
- ✅ **Multiple file formats**: JPEG, PNG, GIF, WebP, BMP

## 📦 Installation

### 1. Install Python 3.7+

### 2. Install dependencies:
```bash
pip install -r requirements.txt
```

## 🔑 Setup API Keys

### For Google Gemini:
Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

**PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_gemini_api_key_here"
```

**Command Prompt:**
```cmd
set GEMINI_API_KEY=your_gemini_api_key_here
```

### For OpenAI:
Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)

**PowerShell:**
```powershell
$env:OPENAI_API_KEY="your_openai_api_key_here"
```

**Command Prompt:**
```cmd
set OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Usage

### Option 1: GUI Version (Recommended for Beginners)

**Launch the application:**
```bash
python image_analyzer_ui.py
```

**How to use:**
1. Click **"Select Image File"** button
2. Browse and choose your image
3. Select AI API (Gemini or OpenAI)
4. Click **"Analyze Image"**
5. View detailed analysis in the text area

**Features:**
- ✨ Beautiful visual interface
- 🖼️ Image preview
- 📊 Real-time progress indicator
- 🔄 Analyze multiple images without restarting

### Option 2: Interactive CLI Version

**Launch the interactive analyzer:**
```bash
python image_analyzer_cli.py
```

**How to use:**
1. Enter the full path to your image file
2. Choose API (1 for Gemini, 2 for OpenAI)
3. Wait for detailed analysis
4. Optionally analyze another image

**Example:**
```
Enter the path to your image file: C:\Users\YourName\Pictures\photo.jpg
```

### Option 3: Command-Line Version (Original)

**For advanced users who prefer command-line arguments:**

```bash
# Using Gemini
python image_summarizer.py --image "path/to/image.jpg" --api gemini

# Using OpenAI
python image_summarizer.py --image "path/to/image.jpg" --api openai

# From URL
python image_summarizer.py --image "https://example.com/image.jpg"
```

## 📸 Example Workflows

### Analyze a Screenshot:
1. Take a screenshot → Save to Desktop
2. Run `python image_analyzer_ui.py`
3. Select your screenshot
4. Get instant analysis

### Analyze Multiple Photos:
1. Use GUI version
2. Select first image → Analyze
3. Click "Select Image File" again for next image
4. Repeat without closing the app

### Batch Processing:
Use the command-line version in a loop:
```bash
python image_summarizer.py --image "photo1.jpg" --api gemini
python image_summarizer.py --image "photo2.jpg" --api gemini
```

## 📋 What You Get in Analysis

The AI will tell you about:

1. **Main Subject**: What the image is primarily about
2. **Objects & Elements**: All visible items in the scene
3. **Colors & Composition**: Visual style and arrangement
4. **Context & Setting**: Where/when the image was taken
5. **Text Content**: Any readable text in the image
6. **Overall Meaning**: Interpretation and significance

## 🎨 Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- WebP
- BMP
- And most other common formats

## 💡 Tips

- **Better results**: Use clear, well-lit images
- **Gemini**: Faster, great for general analysis
- **OpenAI**: More detailed, better for complex scenes
- **Image size**: Works with any size (automatically optimized)
- **Privacy**: Images are sent to API providers for analysis

## 🛠️ Troubleshooting

### "API Key not set" error:
- Set environment variable correctly
- Restart terminal after setting
- Check for typos in the key

### "Image not found" error:
- Use full absolute path
- Check file exists
- Remove any quotes if manually typing path

### GUI doesn't open:
- Ensure tkinter is installed
- On Linux: `sudo apt-get install python3-tk`

### Analysis takes long:
- Normal for large images
- Wait 10-30 seconds
- Check internet connection

## 📁 Files Overview

- `image_analyzer_ui.py` - GUI application with image upload
- `image_analyzer_cli.py` - Interactive command-line version
- `image_summarizer.py` - Original command-line tool
- `example_usage.py` - Usage examples and setup checker
- `requirements.txt` - Python dependencies

## 🔒 Privacy & Security

- API keys stored only in environment variables
- Images sent securely via HTTPS
- No images stored on disk by this application
- Review API provider privacy policies

## 📝 Requirements

```
Python 3.7+
requests
google-generativeai
Pillow (PIL)
tkinter (usually pre-installed with Python)
```

## 🆘 Need Help?

Check the status of your setup:
```bash
python example_usage.py
```

This will show:
- Which API keys are set
- Example commands
- Setup instructions

## 📖 Examples

### GUI Version:
![GUI shows image preview and analysis]

### CLI Version Output:
```
==========================================================
AI IMAGE ANALYZER
==========================================================

Enter the path to your image file: my_photo.jpg

📂 Loading image: my_photo.jpg
✓ Image loaded successfully!

==========================================================
SELECT AI API:
==========================================================
1. Google Gemini (Fast and powerful)
2. OpenAI GPT-4o-mini (Detailed analysis)

Enter your choice (1 or 2): 1

==========================================================
🔍 ANALYZING IMAGE WITH GEMINI...
==========================================================
⏳ Please wait...

==========================================================
ANALYSIS RESULT:
==========================================================
[Detailed analysis appears here...]
==========================================================
```

## 🎓 Educational Use

Perfect for:
- Learning about AI vision capabilities
- Accessibility (describing images for visually impaired)
- Content categorization
- Educational projects
- Photo organization

---

**Enjoy analyzing your images with AI! 🚀**
