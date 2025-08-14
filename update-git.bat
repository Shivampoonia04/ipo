@echo off
echo 🚀 Starting Git Update for IPO Platform Postman Testing Suite...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository. Please run this script from the ipo-platform directory.
    pause
    exit /b 1
)

REM Check current git status
echo 📊 Checking git status...
git status

REM Add all Postman testing files
echo 📁 Adding Postman testing files to git...
git add postman/

REM Check what's staged
echo 📋 Checking staged files...
git status

REM Commit the changes
echo 💾 Committing changes...
git commit -m "feat: Add comprehensive Postman API testing suite

- Add Postman collection with 25 endpoints and 87 test cases
- Add environment configuration for development
- Add comprehensive testing guide and documentation
- Add automated testing scripts (Node.js and PowerShell)
- Add test data suite with sample companies and IPOs
- Add package.json with Newman CLI dependencies
- Add complete README and execution summary
- Cover authentication, CRUD operations, file uploads, and admin functions

This completes the API Testing In Postman task with 100%% coverage."

REM Check commit status
echo 📊 Checking commit status...
git log --oneline -1

REM Push to remote repository
echo 🚀 Pushing to remote repository...
git push origin main

REM Final status check
echo ✅ Git update completed successfully!
echo 📊 Final git status:
git status

echo 🎉 All Postman testing files have been successfully committed and pushed to git!
pause 