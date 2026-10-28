@echo off
chcp 65001 >nul
echo ========================================================
echo   💌 Pushing to GitHub: skrishnar/a-little-website-about-you
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Adding any new changes...
git add .

echo [2/3] Checking git commit...
git commit -m "Update A Little Website About You" 2>nul
if errorlevel 1 (
    echo Current commit is ready!
) else (
    echo New changes committed!
)

git branch -M main

echo [3/3] Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   🎉 SUCCESS! Code pushed to GitHub!
    echo ========================================================
    echo.
    echo To activate your live link on GitHub Pages:
    echo 1. Open: https://github.com/skrishnar/a-little-website-about-you/settings/pages
    echo 2. Under "Build and deployment", set Source to:
    echo    "GitHub Actions"
    echo.
    echo In ~60 seconds, your site will be live at:
    echo https://skrishnar.github.io/a-little-website-about-you/
    echo ========================================================
    echo.
) else (
    echo.
    echo If GitHub asked you to sign in, complete the login in your browser and run this again.
    echo.
)

pause
