# ✅ Installation & Testing Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Installation Checklist

- [ ] Python 3.8+ installed
  ```powershell
  python --version
  ```

- [ ] Node.js 14+ installed
  ```powershell
  node --version
  ```

- [ ] npm installed
  ```powershell
  npm --version
  ```

- [ ] GEMINI_API_KEY environment variable set
  ```powershell
  $env:GEMINI_API_KEY = "your-api-key"
  echo $env:GEMINI_API_KEY
  ```

---

## 📦 Installation Checklist

### Backend Setup
- [ ] Navigate to project folder
  ```powershell
  cd b:\gemini
  ```

- [ ] Install Python dependencies
  ```powershell
  pip install -r requirements.txt
  ```

- [ ] Verify Flask installed
  ```powershell
  python -c "import flask; print(flask.__version__)"
  ```

- [ ] Verify Flask-CORS installed
  ```powershell
  python -c "import flask_cors; print('CORS OK')"
  ```

- [ ] Verify Gemini SDK installed
  ```powershell
  python -c "import google.generativeai as genai; print('Gemini OK')"
  ```

### Frontend Setup
- [ ] Navigate to react-app folder
  ```powershell
  cd react-app
  ```

- [ ] Install React dependencies
  ```powershell
  npm install
  ```

- [ ] Verify installation
  ```powershell
  npm list react react-router-dom tailwindcss
  ```

- [ ] Check for errors
  ```powershell
  npm audit
  ```

---

## 🚀 Startup Checklist

### Start Backend
- [ ] Open Terminal 1
- [ ] Navigate to project folder
  ```powershell
  cd b:\gemini
  ```

- [ ] Start Flask server
  ```powershell
  python app.py
  ```

- [ ] Verify output shows:
  - ✅ "AI Assistant Web App Starting..."
  - ✅ "URL: http://localhost:5000"
  - ✅ "API Key: ✓ Configured"

- [ ] Test backend is running
  ```powershell
  # In new terminal
  curl http://localhost:5000/api/usage
  ```

### Start Frontend
- [ ] Open Terminal 2
- [ ] Navigate to react-app folder
  ```powershell
  cd b:\gemini\react-app
  ```

- [ ] Start React dev server
  ```powershell
  npm start
  ```

- [ ] Verify output shows:
  - ✅ "Compiled successfully!"
  - ✅ "Local: http://localhost:3000"
  - ✅ Browser opens automatically

---

## 🧪 Testing Checklist

### Home Page Tests
- [ ] Home page loads at http://localhost:3000
- [ ] 5 feature icons are visible
- [ ] "AI Platform" logo appears in navbar
- [ ] "Dashboard" link appears in navbar
- [ ] Hover over icons shows animation (scale, shadow, border)
- [ ] Click on each icon navigates to correct page
- [ ] Back button returns to home
- [ ] No console errors (F12 → Console)

### Image → Text Page Tests
- [ ] Page loads at http://localhost:3000/image-to-text
- [ ] File upload area is visible
- [ ] "Back to Home" button works
- [ ] Upload an image:
  - [ ] Image preview appears
  - [ ] File name displays
  - [ ] Custom prompt input works
  - [ ] "Process Image" button is enabled
- [ ] Click "Process Image":
  - [ ] Loading spinner appears
  - [ ] Extracted text displays
  - [ ] AI analysis appears
  - [ ] No errors in console
- [ ] Recent searches sidebar:
  - [ ] Shows up to 5 recent searches
  - [ ] Displays file names
  - [ ] Shows timestamps
  - [ ] Click loads previous search
- [ ] Test with different file types:
  - [ ] JPG image
  - [ ] PNG image
  - [ ] Image with text (OCR)
  - [ ] Image without text (AI description)

### Text → Text Page Tests
- [ ] Page loads at http://localhost:3000/text-to-text
- [ ] Text input area is visible
- [ ] "Back to Home" button works
- [ ] Enter text and click "Analyze":
  - [ ] Loading spinner appears
  - [ ] AI response displays
  - [ ] No errors in console
- [ ] Recent searches sidebar:
  - [ ] Shows up to 5 recent searches
  - [ ] Displays input preview
  - [ ] Shows timestamps

### Dashboard Tests
- [ ] Page loads at http://localhost:3000/dashboard
- [ ] Statistics cards display numbers
- [ ] Bar chart is visible and animated
- [ ] Recent activity table shows searches
- [ ] Table columns are:
  - [ ] Feature
  - [ ] Details
  - [ ] Date & Time
  - [ ] Action (View button)
- [ ] Click "View" button navigates to feature
- [ ] "Back to Home" button works

### Navigation Tests
- [ ] All navbar links work
- [ ] All "Back to Home" buttons work
- [ ] All feature icons navigate correctly
- [ ] Browser back/forward buttons work
- [ ] Direct URL navigation works
- [ ] Page refresh works on all routes

---

## 🔍 Browser Testing

### Chrome/Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styles load correctly
- [ ] Animations work smoothly

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styles load correctly

### Safari (Mac)
- [ ] All features work
- [ ] No console errors
- [ ] Styles load correctly

---

## 📱 Responsive Design Testing

### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All features accessible
- [ ] Icons aligned properly

### Tablet (768x1024)
- [ ] Layout adjusts correctly
- [ ] Navigation works
- [ ] Cards stack properly

### Mobile (375x667)
- [ ] Single column layout
- [ ] Touch targets large enough
- [ ] All features accessible
- [ ] Sidebar becomes scrollable

---

## 💾 Data Persistence Testing

### localStorage Tests
- [ ] Open DevTools (F12)
- [ ] Go to Application → Local Storage
- [ ] Perform a search in Image → Text
- [ ] Verify `recentImageToText` key exists
- [ ] Check data format is correct
- [ ] Perform 6 searches
- [ ] Verify only last 5 are kept
- [ ] Clear localStorage
- [ ] Verify searches disappear
- [ ] Perform new search
- [ ] Verify it's saved again

### Recent Searches Tests
- [ ] Perform searches in different features
- [ ] Go to Dashboard
- [ ] Verify all searches appear in table
- [ ] Verify sorted by timestamp (newest first)
- [ ] Verify only top 10 show

---

## 🔌 API Integration Testing

### Upload Endpoint
```powershell
# Test with curl (if available)
curl -X POST http://localhost:5000/api/upload -F "file=@test-image.jpg"
```
- [ ] Returns success
- [ ] Returns extracted text
- [ ] Returns file info

### Analyze Endpoint
```powershell
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"content":"Test content","prompt":null}'
```
- [ ] Returns success
- [ ] Returns AI analysis

### Chat Endpoint
```powershell
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```
- [ ] Returns success
- [ ] Returns AI response

### Usage Endpoint
```powershell
curl http://localhost:5000/api/usage
```
- [ ] Returns JSON
- [ ] Has all feature counts
- [ ] Numbers are valid

---

## 🎨 UI/UX Testing

### Styling Tests
- [ ] Primary color (#4F46E5) used throughout
- [ ] Text is readable on all backgrounds
- [ ] Buttons have hover effects
- [ ] Cards have shadows
- [ ] Rounded corners on all elements
- [ ] Consistent spacing

### Animation Tests
- [ ] Hover effects work on all icons
- [ ] Loading spinners animate smoothly
- [ ] Page transitions are smooth
- [ ] No layout shift when loading

### Accessibility Tests
- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Buttons are keyboard accessible
- [ ] Images have alt text (where applicable)

---

## 🚨 Error Handling Testing

### Backend Errors
- [ ] Stop Flask server
- [ ] Try using app
- [ ] Verify error messages display
- [ ] Restart Flask
- [ ] Verify app works again

### Invalid File Upload
- [ ] Try uploading unsupported file type
- [ ] Verify error message displays
- [ ] App doesn't crash

### API Key Missing
- [ ] Unset GEMINI_API_KEY
- [ ] Start Flask
- [ ] Try analysis
- [ ] Verify error message displays

### Network Errors
- [ ] Turn off backend
- [ ] Try feature
- [ ] Verify error handling
- [ ] No console crashes

---

## 📊 Performance Testing

### Load Times
- [ ] Home page loads < 2 seconds
- [ ] Feature pages load < 1 second
- [ ] Dashboard loads < 2 seconds

### File Upload
- [ ] Small image (< 1MB) uploads quickly
- [ ] Large image (< 16MB) uploads successfully
- [ ] Loading indicators show during upload

### AI Processing
- [ ] Image analysis completes < 10 seconds
- [ ] Text analysis completes < 5 seconds
- [ ] No UI freezing during processing

---

## 🔒 Security Testing

### Input Validation
- [ ] File size limit enforced (16MB)
- [ ] File type validation works
- [ ] Text input sanitized
- [ ] No XSS vulnerabilities

### CORS
- [ ] Only allows requests from localhost:3000
- [ ] Blocks unauthorized origins

---

## 📱 Production Readiness

### Build Tests
- [ ] Run production build
  ```powershell
  cd react-app
  npm run build
  ```
- [ ] Verify build succeeds
- [ ] Check build folder created
- [ ] No build warnings

### Environment Variables
- [ ] API key is secure
- [ ] Not hardcoded in code
- [ ] Documented in README

### Documentation
- [ ] All docs are complete
- [ ] Setup guide is accurate
- [ ] Quick reference is helpful
- [ ] Architecture is documented

---

## ✅ Final Checks

- [ ] All features work as expected
- [ ] No console errors
- [ ] No network errors
- [ ] localStorage persists correctly
- [ ] Recent searches work
- [ ] Dashboard shows data
- [ ] All navigation works
- [ ] Responsive design works
- [ ] Documentation is complete
- [ ] README is updated
- [ ] Project is ready to use!

---

## 🎉 Completion

### If all checks pass:
✅ **Congratulations!** Your AI Platform is fully functional and ready to use!

### If some checks fail:
1. Review the error messages
2. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for troubleshooting
3. Verify all dependencies are installed
4. Check both servers are running
5. Clear cache and try again

---

## 📝 Notes

Use this space to track any issues or customizations:

```
Issue:


Resolution:


```

---

**Checklist Version**: 1.0  
**Last Updated**: October 22, 2025

