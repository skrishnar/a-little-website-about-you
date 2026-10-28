@echo off
chcp 65001 >nul
echo ========================================================
echo   💌 Push "A Little Website About You" to GitHub
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Staging all files...
git add .

echo [2/3] Checking commit status...
git commit -m "Update A Little Website About You" 2>nul
if errorlevel 1 (
    echo Everything is already up to date!
) else (
    echo New changes committed successfully!
)

git branch -M main

git remote get-url origin 2>nul
if errorlevel 1 (
    echo.
    echo --------------------------------------------------------
    echo Please create a new repository on GitHub:
    echo 1. Go to https://github.com/new
    echo 2. Repository name: a-little-website-about-you
    echo 3. Choose Public or Private
    echo 4. Leave "Add README" UNCHECKED
    echo 5. Click "Create repository"
    echo --------------------------------------------------------
    echo.
    set /p REPO_URL="Paste your GitHub repository URL (e.g. https://github.com/username/repo.git): "
    if not defined REPO_URL (
        echo No URL provided. Aborting.
        pause
        exit /b 1
    )
    git remote add origin %REPO_URL%
)

echo.
echo [3/3] Pushing to GitHub (main branch)...
git push -u origin main

if errorlevel 0 (
    echo.
    echo ========================================================
    echo   🎉 SUCCESS! Pushed to GitHub!
    echo ========================================================
    echo.
    echo To view your live website on GitHub Pages:
    echo 1. Open your repository on GitHub.
    echo 2. Go to Settings -^> Pages.
    echo 3. Under Build and deployment:
    echo    Source: Choose "GitHub Actions" (or "Deploy from a branch" -^> main).
    echo 4. Your live link will appear at the top in 1-2 minutes!
    echo.
) else (
    echo.
    echo [!] Push encountered an issue. Please make sure you are signed in to GitHub.
    echo.
)

pause
