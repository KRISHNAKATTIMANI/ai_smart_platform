# Quick Start Guide - AI Image Analyzer

## 🚀 FASTEST WAY TO USE

### Option 1: GUI Application (Easiest!)

```powershell
# Set your API keys first
$env:GEMINI_API_KEY="AIzaSyC_OOXj1s0zACXRDAEBZs7hfmGb-4hGMnI"
$env:OPENAI_API_KEY="your_openai_key_here"

# Run the GUI app
python image_analyzer_ui.py
```

**Then:**
1. Window opens automatically
2. Click "📁 Select Image File"
3. Choose any image from your computer (JPG, PNG, etc.)
4. Select API: Gemini or OpenAI
5. Click "🔍 Analyze Image"
6. Read the detailed analysis!

---

### Option 2: Interactive CLI (Simple!)

```powershell
# Set your API key
$env:GEMINI_API_KEY="AIzaSyC_OOXj1s0zACXRDAEBZs7hfmGb-4hGMnI"

# Run the interactive CLI
python image_analyzer_cli.py
```

**Then:**
1. Type the path to your image when prompted
   - Example: `C:\Users\YourName\Pictures\photo.jpg`
   - Or drag & drop the file into terminal (path appears automatically)
2. Choose "1" for Gemini or "2" for OpenAI
3. Wait a few seconds
4. Read your analysis!

---

### Option 3: One-Line Command

```powershell
$env:GEMINI_API_KEY="AIzaSyC_OOXj1s0zACXRDAEBZs7hfmGb-4hGMnI"
python image_summarizer.py --image "C:\path\to\your\image.jpg" --api gemini
```

---

## 📝 What Kind of Images Can I Analyze?

✅ Photos from your phone  
✅ Screenshots  
✅ Downloaded images  
✅ Scanned documents  
✅ Memes  
✅ Charts and graphs  
✅ Artwork  
✅ Product photos  
✅ Any JPG, PNG, GIF, WebP, BMP file  

---

## 💡 Example Analysis Output

**Input:** A photo of a sunset over mountains

**Output:**
```
This image captures a breathtaking sunset over a mountain range.
The sky is painted in vibrant shades of orange, pink, and purple,
creating a dramatic backdrop. Silhouettes of pine trees frame the
foreground, adding depth to the composition. The scene conveys a
sense of peace and natural beauty, typical of wilderness photography.
The lighting suggests this was taken during golden hour, with the
sun just below the horizon creating the colorful sky gradient.
```

---

## 🎯 Common Use Cases

**1. Describe photos for accessibility**
- Help visually impaired users understand images

**2. Organize photo collections**
- Get automatic descriptions for sorting

**3. Analyze screenshots**
- Extract information from images

**4. Check meme content**
- Understand what's in social media images

**5. Verify documents**
- Check what text/content is in scanned docs

**6. Learn about photos**
- Get detailed explanations of any image

---

## ⚡ Pro Tips

1. **Drag & Drop**: In Windows, drag a file into PowerShell to auto-type its path
2. **Relative Paths**: If image is in same folder, just type filename: `photo.jpg`
3. **Multiple Analyses**: GUI version lets you analyze many images without restarting
4. **Compare APIs**: Try same image with both Gemini and OpenAI to see differences
5. **API Speed**: Gemini is usually faster, OpenAI often more detailed

---

## 🆘 Quick Troubleshooting

**"API Key not set"**
```powershell
$env:GEMINI_API_KEY="your_actual_key_here"
```

**"File not found"**
- Use full path: `C:\Users\YourName\Pictures\image.jpg`
- Or copy file to same folder as script

**GUI won't open**
- Use CLI version instead: `python image_analyzer_cli.py`

---

## 📚 Complete Documentation

For more details, see `README_COMPLETE.md`

---

**Ready? Pick an option above and start analyzing! 🎉**
