# Git Setup Instructions

Since the Linux sandbox has file permission issues with Git, run these commands in **PowerShell** or **Command Prompt** on Windows:

```powershell
# Open PowerShell in the project folder
cd C:\Users\HomePC\Desktop\level-one-task-three

# Configure Git identity
git config user.email "ucheukcj@gmail.com"
git config user.name "Uche Uchenna Obioma"

# Add all files
git add .

# Commit
git commit -m "feat: initial commit - DevSpace 3D portfolio with all features"

# Create GitHub repository (requires GitHub CLI or do it manually on github.com)
# Option A: Using GitHub CLI (if installed)
# gh repo create devspace-portfolio --public --source=. --remote=origin --push

# Option B: Manual on github.com
# 1. Go to https://github.com/new
# 2. Repository name: devspace-portfolio
# 3. Description: 3D Interactive Developer Portfolio with 10 features
# 4. Public, no README (we have one)
# 5. Create repository
# 6. Then run:
git remote add origin https://github.com/ucheukcj-coder/devspace-portfolio.git
git branch -M main
git push -u origin main
```

## Files Included

- `index.html` - Main portfolio page
- `style.css` - Complete 3D design system
- `script.js` - All 10 features + hero parallax
- `images/` - Folder for project screenshots (gitignored)
- `.gitignore` - Excludes node_modules, screenshots, etc.
- `DESIGN_PLAN.md` - Design documentation