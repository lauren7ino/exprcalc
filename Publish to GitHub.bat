@echo off
cls
echo Publishing to GitHub 'master' and 'gh-pages'...
echo.

"c:\Program Files\Git\bin\git.exe" push origin master
echo.
if errorlevel 1 pause
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://github.com/lauren7ino/exprcalc/tree/master

ng build --prod --base-href "https://lauren7ino.github.io/exprcalc/"
echo.
if errorlevel 1 pause

angular-cli-ghpages
echo.
if errorlevel 1 pause
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" https://lauren7ino.github.io/exprcalc/
