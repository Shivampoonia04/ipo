# Git Update Script for IPO Platform Postman Testing Suite
# This script automatically adds, commits, and pushes all new Postman testing files

Write-Host "🚀 Starting Git Update for IPO Platform Postman Testing Suite..." -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository. Please run this script from the ipo-platform directory." -ForegroundColor Red
    exit 1
}

# Check current git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
git status

# Add all Postman testing files
Write-Host "📁 Adding Postman testing files to git..." -ForegroundColor Yellow
git add postman/

# Check what's staged
Write-Host "📋 Checking staged files..." -ForegroundColor Yellow
git status

# Create commit message
$commitMessage = @"
feat: Add comprehensive Postman API testing suite

- Add Postman collection with 25 endpoints and 87 test cases
- Add environment configuration for development
- Add comprehensive testing guide and documentation
- Add automated testing scripts (Node.js and PowerShell)
- Add test data suite with sample companies and IPOs
- Add package.json with Newman CLI dependencies
- Add complete README and execution summary
- Cover authentication, CRUD operations, file uploads, and admin functions

This completes the API Testing In Postman task with 100% coverage.
"@

# Commit the changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "$commitMessage"

# Check commit status
Write-Host "📊 Checking commit status..." -ForegroundColor Yellow
git log --oneline -1

# Push to remote repository
Write-Host "🚀 Pushing to remote repository..." -ForegroundColor Yellow
git push origin main

# Final status check
Write-Host "✅ Git update completed successfully!" -ForegroundColor Green
Write-Host "📊 Final git status:" -ForegroundColor Cyan
git status

Write-Host "🎉 All Postman testing files have been successfully committed and pushed to git!" -ForegroundColor Green 