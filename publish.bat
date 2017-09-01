@echo off
cls
echo Pushing to GitHub 'master' and 'gh-pages'...
echo.

"c:\Program Files\Git\bin\git.exe" push origin master
echo.
if errorlevel 1 pause

ng build --prod --base-href "https://lauren7ino.github.io/exprcalc/"
echo.
if errorlevel 1 pause

angular-cli-ghpages
echo.
if errorlevel 1 pause
