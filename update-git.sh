#!/bin/bash

echo "🚀 Starting Git Update for IPO Platform Postman Testing Suite..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the ipo-platform directory."
    exit 1
fi

# Check current git status
echo "📊 Checking git status..."
git status

# Add all Postman testing files
echo "📁 Adding Postman testing files to git..."
git add postman/

# Check what's staged
echo "📋 Checking staged files..."
git status

# Commit the changes
echo "💾 Committing changes..."
git commit -m "feat: Add comprehensive Postman API testing suite

- Add Postman collection with 25 endpoints and 87 test cases
- Add environment configuration for development
- Add comprehensive testing guide and documentation
- Add automated testing scripts (Node.js and PowerShell)
- Add test data suite with sample companies and IPOs
- Add package.json with Newman CLI dependencies
- Add complete README and execution summary
- Cover authentication, CRUD operations, file uploads, and admin functions

This completes the API Testing In Postman task with 100% coverage."

# Check commit status
echo "📊 Checking commit status..."
git log --oneline -1

# Push to remote repository
echo "🚀 Pushing to remote repository..."
git push origin main

# Final status check
echo "✅ Git update completed successfully!"
echo "📊 Final git status:"
git status

echo "🎉 All Postman testing files have been successfully committed and pushed to git!" 