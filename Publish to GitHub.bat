@echo off
cls
echo Publishing to GitHub 'master' and 'gh-pages'...
echo.

git push origin master
echo.
if errorlevel 1 pause
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://github.com/lauren7ino/exprcalc/tree/master

start /b /wait ng build --prod --base-href "https://lauren7ino.github.io/exprcalc/"
echo.
echo Type 'exit' to continue...
if errorlevel 1 pause

angular-cli-ghpages
echo.
if errorlevel 1 pause
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://github.com/lauren7ino/exprcalc/tree/gh-pages
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://lauren7ino.github.io/exprcalc/
