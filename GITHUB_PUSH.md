# 📤 GitHub Push Instructions

## Step 1: Initialize Git Repository

Open PowerShell in your project folder and run:

```powershell
cd B:\gemini
git init
```

## Step 2: Add Files

```powershell
git add .
```

## Step 3: Create Initial Commit

```powershell
git commit -m "Initial commit: ChatGPT-style AI Assistant with chat history and PDF export"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New repository"** (+ icon, top right)
3. Enter repository name: `ai-assistant` (or your preferred name)
4. Add description: "ChatGPT-style AI Assistant for document analysis and Q&A"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README (we already have one)
7. Click **"Create repository"**

## Step 5: Link to GitHub

Replace `yourusername` with your actual GitHub username:

```powershell
git remote add origin https://github.com/yourusername/ai-assistant.git
```

## Step 6: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

## Done! 🎉

Your repository is now on GitHub!

---

## 🔄 Future Updates

After making changes, push updates with:

```powershell
git add .
git commit -m "Your commit message describing changes"
git push
```

---

## 📝 Common Commands

### Check Status
```powershell
git status
```

### View Commit History
```powershell
git log --oneline
```

### Create New Branch
```powershell
git checkout -b feature/new-feature
```

### Switch Branch
```powershell
git checkout main
```

### Pull Latest Changes
```powershell
git pull origin main
```

---

## 🚨 Important Notes

### Before Pushing:

1. ✅ **Remove API keys** from code
2. ✅ **Check .gitignore** is working
3. ✅ **Test the app** works
4. ✅ **Update README** with your info

### Security:

- ⚠️ **NEVER** commit API keys
- ⚠️ Use environment variables
- ⚠️ Check `.gitignore` includes `.env`

### Best Practices:

- ✅ Write clear commit messages
- ✅ Commit related changes together
- ✅ Test before pushing
- ✅ Update documentation

---

## 🌟 Optional: Add GitHub Actions

Create `.github/workflows/test.yml` for automated testing:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    - name: Run tests
      run: |
        python -m pytest
```

---

## 📧 Need Help?

- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2)
- [GitHub Learning Lab](https://lab.github.com)

---

**Happy Coding! 🚀**
