@echo off
cls
echo Publishing to GitHub 'master' ...
echo.
git push origin master
echo.
if errorlevel 1 pause
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://github.com/lauren7ino/exprcalc/tree/master

cls
echo Compiling ...
echo.
echo [Type 'exit' on end to continue]
echo.
start /b /wait ng build --prod --base-href "https://magnumingenium.com/exprcalc/"
echo.
if errorlevel 1 pause

cls
echo Publishing to GitHub 'gh-pages' ...
echo.
echo [Type 'exit' on end to continue]
echo.
start /b /wait angular-cli-ghpages
echo.
if errorlevel 1 pause

REM start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://github.com/lauren7ino/exprcalc/tree/gh-pages
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://magnumingenium.com/exprcalc/
